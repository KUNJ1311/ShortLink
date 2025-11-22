const { ulid } = require("ulid");

const authMiddleware = (req, res, next) => {
	let userId = req.cookies.user_id;

	if (!userId) {
		userId = ulid();

		res.cookie("user_id", userId, {
			httpOnly: true, // Cannot be accessed by JavaScript (XSS protection)
			sameSite: "none", // Allows cross-domain requests (frontend on different domain than backend)
			secure: process.env.NODE_ENV === "production", // HTTPS only in production
			path: "/", // Available for all routes
			maxAge: 400 * 24 * 60 * 60 * 1000, // 400 days (Safari maximum)
		});
	}

	req.user_id = userId;
	next();
};

module.exports = authMiddleware;
