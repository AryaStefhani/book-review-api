const db = require('../db');

// 🔹 Tambah review
exports.createReview = (req, res) => {
  const { title, content, rating } = req.body;
  const image = req.file?.filename;

  db.query(
    'INSERT INTO reviews (user_id, title, content, rating, image) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, title, content, rating, image],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send({ message: '✅ Review posted successfully' });
    }
  );
};

// 🔹 Ambil semua review (untuk frontend)
exports.getAllReviews = (req, res) => {
  db.query(
    'SELECT title, content, rating, image FROM reviews',
    (err, results) => {
      if (err) return res.status(500).send(err);

      const simplified = results.map(item => ({
        judul: item.title,
        ulasan: item.content,
        rating: item.rating,
        gambar: `${req.protocol}://${req.get('host')}/uploads/${item.image}`
      }));

      res.send(simplified);
    }
  );
};

// 🔹 Ambil review milik user login
exports.getUserReviews = (req, res) => {
  db.query('SELECT * FROM reviews WHERE user_id = ?', [req.user.id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
};

// 🔄 Update review
exports.updateReview = (req, res) => {
  const reviewId = req.params.id;
  const userId = req.user.id;
  const { title, content, rating } = req.body;
  const image = req.file?.filename;

  let fields = [];
  let values = [];

  if (title) {
    fields.push('title = ?');
    values.push(title);
  }
  if (content) {
    fields.push('content = ?');
    values.push(content);
  }
  if (rating) {
    fields.push('rating = ?');
    values.push(rating);
  }
  if (image) {
    fields.push('image = ?');
    values.push(image);
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: 'Tidak ada field yang diperbarui' });
  }

  const sql = `UPDATE reviews SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`;
  values.push(reviewId, userId);

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ Gagal update review:", err);
      return res.status(500).json({ message: 'Gagal update review' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Review tidak ditemukan atau bukan milik Anda' });
    }

    res.json({ message: '✅ Review berhasil diperbarui' });
  });
};

// 🗑 Hapus review
exports.deleteReview = (req, res) => {
  const reviewId = req.params.id;
  const userId = req.user.id;

  db.query('DELETE FROM reviews WHERE id = ? AND user_id = ?', [reviewId, userId], (err, result) => {
    if (err) {
      console.error("❌ Gagal menghapus review:", err);
      return res.status(500).json({ message: 'Gagal menghapus review' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Review tidak ditemukan atau bukan milik Anda' });
    }

    res.json({ message: '✅ Review berhasil dihapus' });
  });
};
