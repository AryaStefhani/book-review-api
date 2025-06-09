const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const authRoutes = require('./routes/authRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 👈 Tambahkan baris ini
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
});
