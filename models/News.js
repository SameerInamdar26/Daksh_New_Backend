const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  name: { type: String, required: true },   // commenter name
  text: { type: String, required: true },   // comment text
  date: { type: Date, default: Date.now }
});

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,   // Cloudinary image link
    default: ""
  },
  sampadak: {       // ✅ संपादक
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    default: "Admin"
  },
  date: {
    type: Date,
    default: Date.now
  },
  views: {          // ✅ track page visits
    type: Number,
    default: 0
  },
  comments: [commentSchema]  // ✅ store comments
});

module.exports = mongoose.model('News', newsSchema);
