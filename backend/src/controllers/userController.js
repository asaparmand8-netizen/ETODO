// ./controllers/userController.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

//  UTILISATEURS

// 1. Récupérer tous les utilisateurs
const getAllUsers = (req, res) => {
    db.query('SELECT id, email, name, firstname, created_at FROM user', (err, results) => {
        if (err) return res.status(500).json({ message: 'Internal server error', error: err.message });
        res.json(results);
    });
};

// 2. Récupérer tous les todos de l'utilisateur connecté
const getUserTodos = (req, res) => {
    const userId = req.user.id; // fourni par authMiddleware après vérification du JWT
    db.query('SELECT * FROM todo WHERE user_id = ?', [userId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Internal server error', error: err.message });
        res.json(results);
    });
};

// 3. Récupérer un utilisateur par ID ou email
const getUserByIdOrEmail = (req, res) => {
    const identifier = req.params.identifier;
    let query = '';
    let value = '';

    if (/^\d+$/.test(identifier)) { // si c'est un ID numérique
        query = 'SELECT id, email, name, firstname, created_at FROM user WHERE id = ?';
        value = identifier;
    } else { // sinon, on suppose que c'est un email
        query = 'SELECT id, email, name, firstname, created_at FROM user WHERE email = ?';
        value = identifier;
    }

    db.query(query, [value], (err, results) => {
        if (err) return res.status(500).json({ message: 'Internal server error', error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(results[0]);
    });
};

// 4. Mettre à jour un utilisateur par ID
const updateUser = (req, res) => {
    const { email, password, name, firstname } = req.body;
    const { id } = req.params;

    // Hash le mot de passe si présent
    const hashedPassword = password ? bcrypt.hashSync(password, 10) : undefined;

    // Construire la requête dynamiquement selon les champs fournis
    let fields = [];
    let values = [];

    if (email) { fields.push('email = ?'); values.push(email); }
    if (password) { fields.push('password = ?'); values.push(hashedPassword); }
    if (name) { fields.push('name = ?'); values.push(name); }
    if (firstname) { fields.push('firstname = ?'); values.push(firstname); }

    if (fields.length === 0) return res.status(400).json({ message: 'No fields to update' });

    const sql = `UPDATE user SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ message: 'Internal server error', error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });

        // Retourne l'utilisateur mis à jour
        db.query('SELECT id, email, name, firstname, created_at FROM user WHERE id = ?', [id], (err2, results) => {
            if (err2) return res.status(500).json({ message: 'Internal server error', error: err2.message });
            res.json(results[0]);
        });
    });
};

// 5. Supprimer un utilisateur par ID
const deleteUser = (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM user WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Internal server error', error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
        res.json({ message: `Successfully deleted record number: ${id}` });
    });
};

module.exports = {
    getAllUsers,
    getUserTodos,
    getUserByIdOrEmail,
    updateUser,
    deleteUser
};
