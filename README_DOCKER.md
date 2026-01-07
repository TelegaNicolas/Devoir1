Devoir1 - Déploiement Docker Compose
Résumé

Ce dépôt contient une application full-stack composée d’un frontend React (Vite) et d’un backend Express (architecture MVC) connecté à une base de données PostgreSQL.
Le dépôt fournit un unique Dockerfile multi-target ainsi qu’un docker-compose.yml permettant de lancer l’ensemble de la stack (frontend, backend, Postgres).

Le frontend est servi par Nginx, qui agit également comme reverse proxy pour rediriger les requêtes /api vers le backend.

# Prérequis

    Docker Desktop (Windows/macOS) ou Docker Engine + Docker Compose v2
    Docker >= 20.10
    Système d’exploitation : Windows / macOS / Linux
    Structure des fichiers
    Dockerfile : Deux Dockerfiles un qui target backend et le second le frontend.
    docker-compose.yml : orchestre les services postgres-1, api-core-1 et frontend-1.
    nginx.conf : configuration Nginx (support SPA + proxy /api).
    init.sql : script d’initialisation PostgreSQL (création des tables users et products).
    .env.example : variables d’environnement à copier en .env.

# Procédure

    1 - Copier l’exemple de variables d’environnement :

            cp .env.example .env
            modifier POSTGRES_DB par : devoir1db
            et modifier POSTGRES_PASSWORD par le votre

    2 - Construire et démarrer l'application : 

            docker compose up --build

    3 - Accéder aux services : 

            Frontend : http://localhost:8080
            Backend API : http://localhost:3000
            Health check : /api/status

    Les appels API depuis le frontend passent par Nginx via des URLs relatives (/api/...).

# Notes Techniques

    Il y a deux dockerfiles, un pour le frontend (Dockerfile.frontend) et un pour le backend (Dockerfile.backend)
    Le backend Express écoute sur le port 3000 et utilise le module pg pour se connecter à PostgreSQL.
    Le frontend est servi par Nginx sur le port 80 dans le conteneur, mappé sur le port 8080 de l’hôte.

    Nginx agit comme reverse proxy :

    / → frontend React (SPA)
    /api/* → backend Express

    PostgreSQL utilise un volume Docker (pgdata) pour assurer la persistance des données.
    Les tables sont automatiquement créées au premier démarrage via le fichier init.sql.
    Les variables sensibles (credentials PostgreSQL, etc.) sont fournies via .env et ne doivent pas être versionnées.

    Architecture (schéma simplifié)
    Frontend (Nginx + React)
            ↕ HTTP (/api)
    api-core-1 (Express / Node.js)
            ↕ TCP (5432)
    postgres-1 (PostgreSQL + volume)

# Bonnes Pratiques et sécurité

    L’image backend s’exécute avec un utilisateur non-root.
    Les mots de passe et informations sensibles ne sont pas inclus dans le dépôt.
    Les requêtes SQL sont paramétrées pour éviter les injections SQL.
    Pour un environnement de production :

    utiliser un gestionnaire de secrets (Docker secrets, Vault…)
    activer TLS (HTTPS)
    mettre en place des logs et une supervision

# Dépannage

    Reconstruire complètement les images :

    docker compose build --no-cache
    docker compose up

    Arrêter les services et supprimer les volumes (supprime les données) :

    docker compose down -v
