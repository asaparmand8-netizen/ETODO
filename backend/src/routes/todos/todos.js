// backend/src/routes/todos.js
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const todosController = require('../../controllers/todosController');

// --- Tâches de l'utilisateur connecté ---
// GET /todos -> récupérer toutes les tâches de l'utilisateur
router.get('/', auth, todosController.getAllTodos);

// GET /todos/:id -> récupérer une tâche par ID (uniquement si elle appartient à l'utilisateur)
router.get('/:id', auth, todosController.getTodoById);

// POST /todos -> créer une nouvelle tâche pour l'utilisateur connecté
router.post('/', auth, todosController.createTodo);

// PUT /todos/:id -> modifier une tâche (uniquement si elle appartient à l'utilisateur)
router.put('/:id', auth, todosController.updateTodo);

// DELETE /todos/:id -> supprimer une tâche (uniquement si elle appartient à l'utilisateur)
router.delete('/:id', auth, todosController.deleteTodo);

module.exports = router;
