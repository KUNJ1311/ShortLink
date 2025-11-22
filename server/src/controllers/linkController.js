const { pool } = require('../database/db');
const { generateRandomCode } = require('../utils/base62');
const analyticsService = require('../services/analyticsService');
const { generate404Page } = require("../templates/notFoundTemplate");
const UAParser = require("ua-parser-js");

const isValidUrl = (string) => {
	try {
		new URL(string);
		return true;
	} catch (err) {
		return false;
	}
};

const RESERVED_ROUTES = ["dashboard", "healthz"];

const isReservedCode = (code) => {
	return RESERVED_ROUTES.includes(code.toLowerCase());
};

const createLink = async (req, res) => {
	const { original_url, custom_code } = req.body;
	const userId = req.user_id;

	if (!original_url || !isValidUrl(original_url)) {
		return res.status(400).json({
			error: "Invalid URL provided",
			errorCode: "INVALID_URL",
		});
	}

	const connection = await pool.getConnection();

	try {
		let code = custom_code;

		if (code) {
			if (!/^[A-Za-z0-9]{6,8}$/.test(code)) {
				return res.status(400).json({
					error: "Code must be 6-8 alphanumeric characters.",
					errorCode: "INVALID_CODE_FORMAT",
				});
			}

			// Check if code is reserved
			if (isReservedCode(code)) {
				return res.status(400).json({
					error: "This code is reserved and cannot be used.",
					errorCode: "RESERVED_CODE",
				});
			}

			const [existing] = await connection.query("SELECT id FROM links WHERE code = ?", [code]);
			if (existing.length > 0) {
				return res.status(409).json({
					error: "Custom code already exists",
					errorCode: "CODE_EXISTS",
				});
			}
		} else {
			let isUnique = false;
			let attempts = 0;
			while (!isUnique && attempts < 100) {
				code = generateRandomCode();

				// Skip if generated code is reserved
				if (isReservedCode(code)) {
					attempts++;
					continue;
				}

				const [existing] = await connection.query("SELECT id FROM links WHERE code = ?", [code]);
				if (existing.length === 0) {
					isUnique = true;
				}
				attempts++;
			}

			if (!isUnique) {
				return res.status(500).json({
					error: "Failed to generate unique code. Please try again.",
					errorCode: "GENERATION_FAILED",
				});
			}
		}

		// Insert into DB
		await connection.query("INSERT INTO links (code, original_url, user_id) VALUES (?, ?, ?)", [code, original_url, userId]);

		res.status(201).json({
			code,
			original_url,
			short_url: `${process.env.CLIENT_BASE_URL}/${code}`,
		});
	} catch (error) {
		console.error("Error creating link:", error);
		res.status(500).json({
			error: "Internal server error",
			errorCode: "INTERNAL_ERROR",
		});
	} finally {
		connection.release();
	}
};

const listLinks = async (req, res) => {
	const userId = req.user_id;
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10;
	const search = req.query.search || "";
	const sortBy = req.query.sortBy || "created_at";
	const sortOrder = req.query.sortOrder || "desc";
	const offset = (page - 1) * limit;

	try {
		let query = "SELECT * FROM links WHERE user_id = ?";
		let countQuery = "SELECT COUNT(*) as total FROM links WHERE user_id = ?";
		const params = [userId];

		if (search) {
			const searchTerm = `%${search}%`;
			query += " AND (code LIKE ? OR original_url LIKE ?)";
			countQuery += " AND (code LIKE ? OR original_url LIKE ?)";
			params.push(searchTerm, searchTerm);
		}

		const [countResult] = await pool.query(countQuery, params);
		const totalItems = countResult[0].total;
		const totalPages = Math.ceil(totalItems / limit);

		// Validate and apply sorting
		const allowedSortFields = ["clicks", "created_at", "last_clicked_at"];
		const sortField = allowedSortFields.includes(sortBy) ? sortBy : "created_at";
		const order = sortOrder.toLowerCase() === "asc" ? "ASC" : "DESC";

		// Map 'clicks' to actual column name
		const columnName = sortField === "clicks" ? "total_clicks" : sortField;

		// Handle NULL values in last_clicked_at by putting them last
		if (sortField === "last_clicked_at") {
			query += ` ORDER BY ${columnName} IS NULL, ${columnName} ${order}`;
		} else {
			query += ` ORDER BY ${columnName} ${order}`;
		}

		query += " LIMIT ? OFFSET ?";
		params.push(limit, offset);

		const [rows] = await pool.query(query, params);

		const links = rows.map((link) => ({
			...link,
			short_url: `${process.env.CLIENT_BASE_URL}/${link.code}`,
		}));

		res.json({
			data: links,
			pagination: {
				totalItems,
				totalPages,
				currentPage: page,
				itemsPerPage: limit,
			},
		});
	} catch (error) {
		console.error("Error listing links:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

const getLinkStats = async (req, res) => {
	const { code } = req.params;
	const userId = req.user_id;
	const connection = await pool.getConnection();

	try {
		const [links] = await connection.query("SELECT * FROM links WHERE code = ? AND user_id = ?", [code, userId]);

		if (links.length === 0) {
			return res.status(404).json({ error: "Link not found or unauthorized" });
		}

		const link = links[0];

		const [analytics] = await connection.query("SELECT device_type, count FROM link_analytics WHERE link_id = ?", [link.id]);

		const devices = analytics.reduce((acc, row) => {
			acc[row.device_type] = row.count;
			return acc;
		}, {});

		res.json({
			code: link.code,
			original_url: link.original_url,
			total_clicks: link.total_clicks,
			last_clicked_at: link.last_clicked_at,
			created_at: link.created_at,
			analytics: {
				devices,
			},
		});
	} catch (error) {
		console.error("Error fetching stats:", error);
		res.status(500).json({
			error: "Internal server error",
			errorCode: "INTERNAL_ERROR",
		});
	} finally {
		connection.release();
	}
};

const deleteLink = async (req, res) => {
	const { code } = req.params;
	const userId = req.user_id;

	try {
		const [result] = await pool.query("DELETE FROM links WHERE code = ? AND user_id = ?", [code, userId]);

		if (result.affectedRows === 0) {
			return res.status(404).json({
				error: "Link not found or unauthorized",
				errorCode: "NOT_FOUND",
			});
		}

		res.status(200).json({ message: "Link deleted successfully" });
	} catch (error) {
		console.error("Error deleting link:", error);
		res.status(500).json({
			error: "Internal server error",
			errorCode: "INTERNAL_ERROR",
		});
	}
};

const updateLink = async (req, res) => {
	const { code } = req.params;
	const { original_url } = req.body;
	const userId = req.user_id;

	if (!original_url || !isValidUrl(original_url)) {
		return res.status(400).json({
			error: "Invalid URL provided",
			errorCode: "INVALID_URL",
		});
	}

	try {
		const [result] = await pool.query("UPDATE links SET original_url = ? WHERE code = ? AND user_id = ?", [original_url, code, userId]);

		if (result.affectedRows === 0) {
			return res.status(404).json({
				error: "Link not found or unauthorized",
				errorCode: "NOT_FOUND",
			});
		}

		res.status(200).json({
			message: "Link updated successfully",
			code,
			original_url,
		});
	} catch (error) {
		console.error("Error updating link:", error);
		res.status(500).json({
			error: "Internal server error",
			errorCode: "INTERNAL_ERROR",
		});
	}
};

const redirectLink = async (req, res) => {
	const { code } = req.params;

	try {
		const [rows] = await pool.query("SELECT id, original_url FROM links WHERE code = ?", [code]);

		if (rows.length === 0) {
			const frontendUrl = process.env.CLIENT_BASE_URL || "http://localhost:3000";
			const html404 = generate404Page(code, frontendUrl);
			return res.status(404).send(html404);
		}

		const link = rows[0];

		const parser = new UAParser(req.headers["user-agent"]);
		const deviceType = parser.getDevice().type || "desktop";

		let normalizedDevice = "desktop";
		if (deviceType === "mobile") normalizedDevice = "mobile";
		if (deviceType === "tablet") normalizedDevice = "tablet";

		analyticsService.trackClick(link.id, normalizedDevice);

		res.redirect(302, link.original_url);
	} catch (error) {
		console.error("Redirect error:", error);
		res.status(500).send("Internal Server Error");
	}
};

module.exports = {
  createLink,
  listLinks,
  getLinkStats,
  deleteLink,
  updateLink,
  redirectLink
};
