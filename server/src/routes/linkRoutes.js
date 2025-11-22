const express = require('express');
const router = express.Router();
const linkController = require('../controllers/linkController');
const authMiddleware = require('../middlewares/authMiddleware');

// Apply auth middleware to all API routes to ensure user tracking
router.use(authMiddleware);

// POST /api/links - Create a new short link
router.post('/', linkController.createLink);

// GET /api/links - List all links for the user
router.get('/', linkController.listLinks);

// GET /api/links/:code - Get stats for a specific link
router.get('/:code', linkController.getLinkStats);

// PATCH /api/links/:code - Update link URL
router.patch('/:code', linkController.updateLink);

// DELETE /api/links/:code - Delete a link
router.delete('/:code', linkController.deleteLink);

module.exports = router;
