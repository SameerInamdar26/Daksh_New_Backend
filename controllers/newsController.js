const News = require('../models/News');
const cloudinary = require('../utils/cloudinary');
const multer = require('multer');

// Multer setup for handling file uploads
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Middleware for single image upload
exports.uploadMiddleware = upload.single('image');

// Add News (with optional image upload)
exports.addNews = async (req, res) => {
  try {
    let imageUrl = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    const news = new News({
      title: req.body.title,
      content: req.body.content,
      sampadak: req.body.sampadak,
      imageUrl,
      author: req.body.author || "Admin"
    });

    await news.save();
    res.json(news);
  } catch (err) {
    console.error("Error saving news:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get All News
exports.getNews = async (req, res) => {
  try {
    const news = await News.find().sort({ date: -1 });
    res.json(news);
  } catch (err) {
    console.error("Error fetching news:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get Single News by ID (increment views)
exports.getSingleNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ error: "News not found" });

    // increment views
    news.views += 1;
    await news.save();

    res.json(news);
  } catch (err) {
    console.error("Error fetching single news:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update News by ID
exports.updateNews = async (req, res) => {
  try {
    const updated = await News.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        content: req.body.content,
        sampadak: req.body.sampadak
      },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "News not found" });
    res.json(updated);
  } catch (err) {
    console.error("Error updating news:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete News by ID
exports.deleteNews = async (req, res) => {
  try {
    const deleted = await News.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "News not found" });
    res.json({ message: "News deleted successfully" });
  } catch (err) {
    console.error("Error deleting news:", err);
    res.status(500).json({ error: err.message });
  }
};

// Add Comment
exports.addComment = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ error: "News not found" });

    news.comments.push({
      name: req.body.name,
      text: req.body.text
    });

    await news.save();
    res.json(news);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete Comment
exports.deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const news = await News.findById(id);
    if (!news) return res.status(404).json({ error: "News not found" });

    // Debugging logs
    console.log("Requested commentId:", commentId);
    console.log("Existing comments:", news.comments.map(c => ({ id: c._id.toString(), name: c.name })));

    const comment = news.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    comment.deleteOne(); // safer than .remove()
    await news.save();

    res.json({ message: "Comment deleted successfully", news });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ error: err.message });
  }
};
