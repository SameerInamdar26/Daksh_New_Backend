const express = require('express');
const router = express.Router();
const {
  addNews,
  getNews,
  getSingleNews,
  updateNews,
  deleteNews,
  addComment,
  deleteComment,
  uploadMiddleware
} = require('../controllers/newsController');

const { verifyAdmin } = require('../controllers/authController');

// -------------------- Public Routes --------------------

// Get all news (public)
router.get('/', getNews);

// Get single news by ID (public, also increments views)
router.get('/:id', getSingleNews);

// Add comment to a news post (public)
router.post('/:id/comments', addComment);

// -------------------- Admin Protected Routes --------------------

// Add news (with optional image upload) - only admin
router.post('/', verifyAdmin, uploadMiddleware, addNews);

// Update news by ID - only admin
router.put('/:id', verifyAdmin, uploadMiddleware, updateNews);

// Delete news by ID - only admin
router.delete('/:id', verifyAdmin, deleteNews);

// Delete comment from a news post - only admin
router.delete('/:id/comments/:commentId', verifyAdmin, deleteComment);

module.exports = router;
