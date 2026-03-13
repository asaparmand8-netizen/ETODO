# ETODO

Application web Full Stack de gestion de tâches (todos) avec authentification JWT, API REST et containerisation Docker.

> Projet d'équipe (3 personnes) — Node.js • Express • MySQL • Docker

---

## Sommaire

- [Aperçu](#aperçu)
- [Architecture](#architecture)
- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Structure du projet](#structure-du-projet)
- [Prérequis](#prérequis)
- [Installation et lancement](#installation-et-lancement)
- [Variables d'environnement](#variables-denvironnement)
- [Base de données](#base-de-données)
- [API Reference](#api-reference)
- [Auteurs](#auteurs)

---

## Aperçu

ETODO est une application web permettant à chaque utilisateur de gérer ses tâches personnelles. Elle repose sur une API REST sécurisée (JWT) côté backend et une interface web en HTML/CSS/JS vanilla côté frontend, le tout orchestré via Docker.

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   Frontend                       │
│     login.html  ·  todos.html  ·  user.html     │
│              (HTML / CSS / JS)                   │
└─────────────────────┬───────────────────────────┘
                      │ HTTP (REST)
┌─────────────────────▼───────────────────────────┐
│                   Backend                        │
│           Express.js  ·  Node.js                 │
│   /auth     /todos     /users                    │
│   Controllers · Middleware (JWT)                 │
└─────────────────────┬───────────────────────────┘
                      │ mysql2
┌─────────────────────▼───────────────────────────┐
│               MySQL 8 (Docker)                   │
│          Tables : user  ·  todo                  │
└─────────────────────────────────────────────────┘
```

Pattern **MVC** : routes → controllers → base de données.

---

## Fonctionnalités

### Authentification
- Inscription (nom, prénom, email, mot de passe)
- Connexion avec retour d'un token JWT (durée : 24h)
- Hachage des mots de passe avec bcryptjs (10 rounds)
- Protection des routes via middleware JWT

### Gestion des todos
- Créer une tâche (titre, description, date d'échéance, statut)
- Lister toutes ses tâches
- Consulter une tâche par son ID
- Modifier une tâche
- Supprimer une tâche
- Statuts disponibles : `not started` · `todo` · `in progress` · `done`

### Gestion des utilisateurs
- Consulter son profil
- Modifier ses informations (email, mot de passe, nom, prénom)
- Supprimer son compte
- Consulter les todos liés à un utilisateur

---

## Technologies

| Couche     | Technologie                        |
|------------|------------------------------------|
| Backend    | Node.js 18, Express.js 4.x         |
| Base de données | MySQL 8                       |
| Driver DB  | mysql2 3.x                         |
| Auth       | jsonwebtoken 9.x, bcryptjs 3.x     |
| Config     | dotenv                             |
| CORS       | cors                               |
| Frontend   | HTML5, CSS3, JavaScript (vanilla)  |
| Conteneurs | Docker, Docker Compose             |

---

## Structure du projet

```
ETODO/
├── backend/
│   ├── src/
│   │   ├── server.js              # Point d'entrée Express
│   │   ├── config/
│   │   │   └── db.js              # Connexion MySQL
│   │   ├── controllers/
│   │   │   ├── authController.js  # Inscription / Connexion
│   │   │   ├── todosController.js # CRUD todos
│   │   │   └── userController.js  # Gestion utilisateurs
│   │   ├── routes/
│   │   │   ├── auth/auth.js
│   │   │   ├── todos/todos.js
│   │   │   └── user/user.js
│   │   └── middleware/
│   │       ├── auth.js            # Vérification JWT
│   │       └── notFound.js        # Handler 404
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── index.html                 # Redirection vers login
│   ├── login.html                 # Connexion / Inscription
│   ├── todos.html                 # Dashboard des tâches
│   ├── user.html                  # Profil utilisateur
│   └── styles.css
├── e-todo.sql                     # Schéma de la base de données
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Prérequis

- [Docker](https://www.docker.com/) et [Docker Compose](https://docs.docker.com/compose/)
- (Optionnel, sans Docker) Node.js ≥ 18 et un serveur MySQL 8

---

## Installation et lancement

### Avec Docker (recommandé)

```bash
# 1. Cloner le dépôt
git clone <url-du-repo>
cd ETODO

# 2. Configurer les variables d'environnement
cp .env.example .env
# Éditer .env selon votre configuration

# 3. Lancer les conteneurs
docker compose up -d

# L'API est disponible sur http://localhost:3000
# La base de données est disponible sur localhost:3307
```

### Sans Docker

```bash
# 1. Importer le schéma dans MySQL
mysql -u root -p < e-todo.sql

# 2. Installer les dépendances backend
cd backend
npm install

# 3. Configurer l'environnement
cp ../.env.example .env
# Adapter DB_HOST, DB_USER, DB_PASSWORD, etc.

# 4. Lancer le serveur
node src/server.js
```

Ouvrir ensuite `frontend/login.html` dans un navigateur (ou servir le dossier `frontend/` via un serveur HTTP statique).

---

## Variables d'environnement

Copier `.env.example` en `.env` et renseigner les valeurs :

| Variable      | Description                          | Exemple          |
|---------------|--------------------------------------|------------------|
| `DB_HOST`     | Hôte MySQL (nom du service Docker)   | `db`             |
| `DB_USER`     | Utilisateur MySQL                    | `etodo`          |
| `DB_PASSWORD` | Mot de passe MySQL                   | `password123`    |
| `DB_NAME`     | Nom de la base de données            | `etodo`          |
| `DB_PORT`     | Port MySQL interne                   | `3306`           |
| `PORT`        | Port d'écoute du serveur Node.js     | `3000`           |
| `SECRET`      | Clé secrète pour la signature JWT    | `monSecretJWT`   |

> Ne jamais committer le fichier `.env` en production.

---

## Base de données

Le fichier `e-todo.sql` initialise automatiquement le schéma au démarrage du conteneur MySQL.

### Table `user`

| Colonne      | Type          | Description                    |
|--------------|---------------|--------------------------------|
| `id`         | INT PK AI     | Identifiant unique             |
| `email`      | VARCHAR(255)  | Email unique                   |
| `password`   | VARCHAR(255)  | Mot de passe haché (bcrypt)    |
| `name`       | VARCHAR(100)  | Nom                            |
| `firstname`  | VARCHAR(100)  | Prénom                         |
| `created_at` | DATETIME      | Date de création (auto)        |

### Table `todo`

| Colonne       | Type                                              | Description               |
|---------------|---------------------------------------------------|---------------------------|
| `id`          | INT PK AI                                         | Identifiant unique        |
| `title`       | VARCHAR(255)                                      | Titre de la tâche         |
| `description` | TEXT                                              | Description               |
| `created_at`  | DATETIME                                          | Date de création (auto)   |
| `due_time`    | DATETIME                                          | Date d'échéance           |
| `status`      | ENUM(`not started`, `todo`, `in progress`, `done`) | Statut de la tâche       |
| `user_id`     | INT FK → user.id                                  | Propriétaire (cascade delete) |

---

## API Reference

Toutes les routes protégées nécessitent le header :
```
Authorization: Bearer <token>
```

### Authentification

| Méthode | Endpoint         | Corps (JSON)                              | Description           |
|---------|------------------|-------------------------------------------|-----------------------|
| POST    | `/auth/register` | `name, firstname, email, password`        | Créer un compte       |
| POST    | `/auth/login`    | `email, password`                         | Connexion → JWT token |

### Todos (protégé)

| Méthode | Endpoint       | Corps (JSON)                              | Description                  |
|---------|----------------|-------------------------------------------|------------------------------|
| GET     | `/todos`       | —                                         | Lister ses todos              |
| GET     | `/todos/:id`   | —                                         | Récupérer un todo             |
| POST    | `/todos`       | `title, description, due_time, status`    | Créer un todo                 |
| PUT     | `/todos/:id`   | `title, description, due_time, status`    | Modifier un todo              |
| DELETE  | `/todos/:id`   | —                                         | Supprimer un todo             |

### Utilisateurs (protégé)

| Méthode | Endpoint              | Corps (JSON)                        | Description                     |
|---------|-----------------------|-------------------------------------|---------------------------------|
| GET     | `/users`              | —                                   | Lister tous les utilisateurs    |
| GET     | `/users/todos`        | —                                   | Todos de l'utilisateur connecté |
| GET     | `/users/:identifier`  | —                                   | Utilisateur par ID ou email     |
| PUT     | `/users/:id`          | `email, password, name, firstname`  | Modifier un utilisateur         |
| DELETE  | `/users/:id`          | —                                   | Supprimer un utilisateur        |

---

## Auteurs

Projet réalisé en équipe de 3 personnes.

- **Tano** — Backend & Architecture
