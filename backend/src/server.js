require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Import des routes
const authRoutes = require('./routes/auth/auth');
const todosRoutes = require('./routes/todos/todos');
const userRoutes = require('./routes/user/user');

// Routes
app.use('/auth', authRoutes);
app.use('/todos', todosRoutes);
app.use('/users', userRoutes);

// Route racine
app.get('/', (req, res) => {
  res.send('API E-TODO en ligne');
});

// Middleware pour les routes non trouvées (à la fin)
app.use((req, res) => {
  res.status(404).json({ msg: 'Route not found' });
});

// Démarrage du serveur
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
