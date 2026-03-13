// ./routes/user/user.js
const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserTodos,
  getUserByIdOrEmail,
  updateUser,
  deleteUser
} = require('../../controllers/userController');
const authMiddleware = require('../../middleware/auth');

// 1. Récupérer toutes les infos utilisateurs (protégé)
router.get('/', authMiddleware, getAllUsers);

// 2. Récupérer les todos de l’utilisateur connecté (protégé)
router.get('/todos', authMiddleware, getUserTodos);

// 3. Récupérer un utilisateur par ID ou email (protégé)
router.get('/:identifier', authMiddleware, getUserByIdOrEmail);

// 4. Mettre à jour un utilisateur par ID (protégé)
router.put('/:id', authMiddleware, updateUser);

// 5. Supprimer un utilisateur par ID (protégé)
router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;
