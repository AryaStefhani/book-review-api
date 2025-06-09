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
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);

// Optional: test route for Railway check
app.get('/', (req, res) => {
  res.send('🚀 Book Review API is running');
});

// LISTEN using Railway's provided PORT or fallback to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
