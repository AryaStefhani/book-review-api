const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {
  const { email, password } = req.body;
  const hashed = bcrypt.hashSync(password, 10);

  db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashed], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ message: '✅ User registered successfully' });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err || results.length === 0) return res.status(400).send({ message: '❌ User not found' });

    const user = results[0];
    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) return res.status(401).send({ message: '❌ Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.send({ message: '✅ Login successful', token });
  });
};
