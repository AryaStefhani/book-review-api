const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/authMiddleware');
const {
  createReview,
  getAllReviews,
  getUserReviews,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');

// 📦 Konfigurasi Multer untuk upload gambar
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// 📌 ROUTES
router.post('/', upload.single('image'), auth, createReview);
router.get('/', getAllReviews);
router.get('/my', auth, getUserReviews);
router.put('/:id', upload.single('image'), auth, updateReview);   // 🔄 UPDATE
router.delete('/:id', auth, deleteReview);                        // 🗑 DELETE

module.exports = router;
