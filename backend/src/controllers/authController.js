const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Inscription
exports.register = (req, res) => {
  const { email, password, name, firstname } = req.body;
  if (!email || !password || !name || !firstname)
    return res.status(400).json({ message: 'Tous les champs sont requis.' });

  db.query('SELECT * FROM user WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) return res.status(400).json({ message: 'Email déjà utilisé.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO user (email, password, name, firstname) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, name, firstname],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        const token = jwt.sign({ id: result.insertId, email }, process.env.SECRET, { expiresIn: '24h' });

        res.status(201).json({ message: 'Utilisateur créé avec succès', token });
      }
    );
  });
};

// Connexion
exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email et mot de passe requis.' });

  db.query('SELECT * FROM user WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Utilisateur introuvable.' });

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Mot de passe incorrect.' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.SECRET, { expiresIn: '24h' });

    res.json({ message: 'Connexion réussie', token });
  });
};
