require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const analyticsService = require("./services/analyticsService");
const linkRoutes = require("./routes/linkRoutes");
const { redirectLink } = require("./controllers/linkController");
const { initializeDatabase, pool } = require("./database/db");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
	cors({
		origin: process.env.CLIENT_BASE_URL || "http://localhost:3000",
		credentials: true,
	})
);
app.use(express.json());
app.use(cookieParser());

// Health Check with DB metrics
app.get("/healthz", async (req, res) => {
	const startTime = Date.now();

	let dbStatus = "down";
	let dbResponseTime = null;

	try {
		const dbStart = Date.now();
		await pool.query("SELECT 1");
		dbResponseTime = Date.now() - dbStart;
		dbStatus = "operational";
	} catch (e) {
		dbResponseTime = Date.now() - startTime;
	}

	res.status(200).json({
		ok: true,
		version: "1.0",
		uptime: process.uptime(),
		timestamp: new Date().toISOString(),
		services: {
			database: dbStatus,
			server: "operational",
		},
		metrics: {
			dbResponseTime: `${dbResponseTime}ms`,
			totalResponseTime: `${Date.now() - startTime}ms`,
		},
	});
});

// API Routes
app.use("/api/links", linkRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Link Shortener Service API");
});

// Redirect Route
app.get("/:code", redirectLink);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

const startServer = async () => {
  try {
		await initializeDatabase();

		const connection = await pool.getConnection();
		console.log("Connected to the database as id", connection.threadId);
		connection.release();

		analyticsService.startSyncJob();

		const server = app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
			console.log(`Backend URL: http://localhost:${PORT}`);
		});

		const shutdown = async () => {
			console.log("Shutting down gracefully...");

			server.close(async () => {
				console.log("HTTP server closed.");

				await analyticsService.flush();
				analyticsService.stopSyncJob();

				await pool.end();
				console.log("Database pool closed.");

				process.exit(0);
			});
		};

		process.on("SIGTERM", shutdown);
		process.on("SIGINT", shutdown);
	} catch (error) {
		console.error("Failed to start server:", error);
		process.exit(1);
	}
};

startServer();
