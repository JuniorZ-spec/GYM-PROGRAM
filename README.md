# GYM Program App

Application web de coaching sportif : l'utilisateur renseigne son profil (objectif, niveau, poids, matériel disponible...), une IA génère un programme d'entraînement personnalisé, et un dashboard permet de suivre sa progression (poids, séances complétées).

## Stack technique

**Client** (`/client`)
- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Router
- Recharts (graphiques de progression)
- Lucide React (icônes)

**Serveur** (`/server`)
- Node.js + Express 5 + TypeScript
- Prisma ORM + PostgreSQL (Neon)
- OpenAI SDK via OpenRouter (génération des plans d'entraînement)

## Structure du projet

```
GYM-PROGRAM-APP/
├── client/                # Application React (Vite)
│   └── src/
│       ├── pages/         # Home, Auth, Onboarding, Dashboard, Account, Settings
│       ├── components/    # UI, dashboard, layout
│       ├── context/       # Auth, Theme
│       └── lib/           # api, auth, options de profil
└── server/                 # API Express
    ├── routes/            # profile, plan, progress
    ├── lib/                # ai.ts (génération IA), prisma.ts
    └── prisma/             # schema + migrations
```

## Modèle de données (Prisma)

- `UserProfile` — objectif, poids actuel/cible, taille, âge, niveau, jours/semaine, lieu, équipement, blessures
- `TrainingPlan` — plan généré par l'IA (JSON + texte), versionné par utilisateur
- `WeightLog` — historique du poids
- `SessionLog` — séances complétées (semaine / jour)

## API

| Méthode | Route                          | Description                          |
|---------|---------------------------------|---------------------------------------|
| POST    | `/api/profile`                  | Créer/mettre à jour le profil         |
| GET     | `/api/profile/:userId`          | Récupérer le profil                   |
| POST    | `/api/plan/generate`            | Générer un nouveau plan (IA)          |
| GET     | `/api/plan/current?userId=`     | Récupérer le plan actif               |
| POST    | `/api/progress/weight`          | Ajouter une pesée                     |
| GET     | `/api/progress/weight/:userId`  | Historique de poids                   |
| POST    | `/api/progress/session`         | Marquer une séance comme complétée    |
| GET     | `/api/progress/sessions/:userId`| Historique des séances                |

## Prérequis

- Node.js 18+
- Une base PostgreSQL (ex. [Neon](https://neon.tech))
- Une clé API [OpenRouter](https://openrouter.ai)

## Installation

### 1. Cloner et installer les dépendances

```bash
git clone <url-du-repo>
cd GYM-PROGRAM-APP

# Client
cd client
npm install

# Serveur
cd ../server
npm install
```

### 2. Configurer les variables d'environnement

**`server/.env`**
```
PORT=3001
BASE_URL=http://localhost:3001
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require
OPEN_ROUTER_API_KEY=sk-or-...
```

**`client/.env`**
```
VITE_API_URL=http://localhost:3001
VITE_NEON_AUTH_URL=...
```

### 3. Initialiser la base de données

```bash
cd server
npm run prisma:generate
npm run prisma:migrate
```

## Lancer le projet en développement

```bash
# Terminal 1 — serveur (http://localhost:3001)
cd server
npm run dev

# Terminal 2 — client (http://localhost:5173)
cd client
npm run dev
```

## Déploiement & CI/CD

- **Client** → [Vercel](https://vercel.com) (Root Directory : `client`). Vercel se connecte au repo GitHub et déploie automatiquement : chaque push sur `main` met à jour la prod, chaque pull request génère une preview. `client/vercel.json` gère le rewrite SPA (nécessaire pour que `react-router-dom` fonctionne après un refresh sur une route type `/dashboard`).
- **Serveur** → [Render](https://render.com), via le Blueprint `server/render.yaml` (Infrastructure as Code : Render lit ce fichier pour créer le service tout seul). Le serveur tourne avec `tsx` directement en prod (pas de `tsc` + `node dist/`, car le `tsconfig.json` en `module: ESNext` sans extensions `.js` casserait la résolution ESM de Node au runtime — `tsx` évite ce problème).
- **CI** → [`.github/workflows/ci.yml`](.github/workflows/ci.yml) : à chaque push/PR sur `main`, deux jobs tournent en parallèle — `client` (lint + build) et `server` (typecheck via `tsc --noEmit` + `prisma generate`). Il n'y a pas encore de suite de tests automatisés dans ce repo ; c'est une amélioration à ajouter plus tard.
- **CD** → Vercel déploie via sa propre intégration Git (indépendante de la CI). Le serveur, lui, n'est déployé que si le job `server` de la CI passe : un troisième job (`deploy-server`) appelle ensuite un [Deploy Hook Render](https://render.com/docs/deploy-hooks) via `curl`.
- **Protection de `main`** (à activer dans GitHub → Settings → Branches) : exiger que les checks `client` et `server` passent avant de merger une PR. C'est ce qui garantit que ni Vercel ni Render ne déploient jamais du code cassé, puisqu'ils ne déploient que ce qui atteint `main`.

**Secrets/variables à configurer :**

| Où               | Variable                | Valeur |
|------------------|--------------------------|--------|
| Vercel (dashboard)| `VITE_API_URL`           | URL publique du service Render |
| Vercel (dashboard)| `VITE_NEON_AUTH_URL`     | URL Neon Auth |
| Render (dashboard)| `DATABASE_URL`, `OPEN_ROUTER_API_KEY`, `CORS_ORIGIN`, `BASE_URL` | voir `server/.env.example` |
| GitHub Actions secrets | `RENDER_DEPLOY_HOOK_URL` | Deploy Hook créé dans Render → Settings |

`CORS_ORIGIN` sur Render doit inclure l'URL de prod Vercel (les previews `*.vercel.app` sont autorisées automatiquement par le serveur).

## Scripts disponibles

**Client**
| Script     | Description                    |
|------------|---------------------------------|
| `dev`      | Lance le serveur de dev Vite    |
| `build`    | Build de production             |
| `lint`     | Lint ESLint                     |
| `preview`  | Prévisualise le build           |

**Serveur**
| Script              | Description                        |
|---------------------|--------------------------------------|
| `dev`                | Lance le serveur avec rechargement (`tsx watch`) |
| `build`              | Compile TypeScript                  |
| `prisma:generate`    | Génère le client Prisma             |
| `prisma:migrate`     | Applique les migrations en dev      |

## Licence

Projet privé — tous droits réservés.
