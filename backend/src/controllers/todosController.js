const db = require('../config/db');

// --- Récupérer toutes les tâches de l'utilisateur connecté ---
exports.getAllTodos = (req, res) => {
    const user_id = req.user.id;
    db.query('SELECT * FROM todo WHERE user_id = ?', [user_id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Internal server error' });
        res.status(200).json(results);
    });
};

// --- Récupérer une tâche par ID (uniquement si elle appartient à l'utilisateur) ---
exports.getTodoById = (req, res) => {
    const user_id = req.user.id;
    const { id } = req.params;

    db.query('SELECT * FROM todo WHERE id = ? AND user_id = ?', [id, user_id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Internal server error' });
        if (results.length === 0) return res.status(404).json({ message: 'Tâche introuvable' });
        res.status(200).json(results[0]);
    });
};

// --- Créer une nouvelle tâche ---
exports.createTodo = (req, res) => {
    const user_id = req.user.id;
    const { title, description, due_time, status } = req.body;

    if (!title || !description || !due_time)
        return res.status(400).json({ message: 'Paramètres invalides' });

    const sql = 'INSERT INTO todo (title, description, due_time, user_id, status) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [title, description, due_time, user_id, status || 'not started'], (err, result) => {
        if (err) return res.status(500).json({ message: 'Internal server error' });

        db.query('SELECT * FROM todo WHERE id = ?', [result.insertId], (err2, rows) => {
            if (err2) return res.status(500).json({ message: 'Internal server error' });
            res.status(201).json(rows[0]);
        });
    });
};

// --- Mettre à jour une tâche ---
exports.updateTodo = (req, res) => {
    const user_id = req.user.id;
    const { id } = req.params;
    const { title, description, due_time, status } = req.body;

    if (!title || !description || !due_time || !status)
        return res.status(400).json({ message: 'Paramètres invalides' });

    // Vérifier que la tâche appartient à l'utilisateur
    db.query('SELECT * FROM todo WHERE id = ? AND user_id = ?', [id, user_id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Internal server error' });
        if (results.length === 0) return res.status(404).json({ message: 'Tâche introuvable' });

        const sql = `
            UPDATE todo
            SET title = ?, description = ?, due_time = ?, status = ?
            WHERE id = ?`;
        db.query(sql, [title, description, due_time, status, id], (err2) => {
            if (err2) return res.status(500).json({ message: 'Internal server error' });

            db.query('SELECT * FROM todo WHERE id = ?', [id], (err3, rows) => {
                if (err3) return res.status(500).json({ message: 'Internal server error' });
                res.status(200).json(rows[0]);
            });
        });
    });
};

// --- Supprimer une tâche ---
exports.deleteTodo = (req, res) => {
    const user_id = req.user.id;
    const { id } = req.params;

    db.query('DELETE FROM todo WHERE id = ? AND user_id = ?', [id, user_id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Internal server error' });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Tâche introuvable' });
        res.status(200).json({ message: 'Tâche supprimée' });
    });
};
