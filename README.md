# GYM Program App

Application web de coaching sportif : l'utilisateur renseigne son profil (objectif, niveau, poids, matériel disponible...), une IA génère un programme d'entraînement personnalisé, et un dashboard permet de suivre sa progression (poids, séances complétées).

**Stack DevOps** : GitHub Actions (CI) · Vercel (déploiement client) · Render (déploiement serveur, Infrastructure as Code) · Neon Postgres. Détails dans la section [DevOps : CI/CD & Déploiement](#devops--cicd--déploiement).

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

## DevOps : CI/CD & Déploiement

```
GitHub repo (JuniorZ-spec/GYM-PROGRAM)
│
├─ push/PR ──▶ GitHub Actions CI (.github/workflows/ci.yml)
│               ├─ job "client"  : lint + build
│               └─ job "server"  : typecheck (tsc --noEmit) + prisma generate
│
├─ merge sur main (CI verte, via branch protection)
│               │
│               ├─▶ Vercel (intégration Git native) ─▶ déploie client/ en prod
│               │      + preview automatique sur chaque PR
│               │
│               └─▶ job "deploy-server" (needs: server ✅)
│                      ─▶ POST sur le Render Deploy Hook ─▶ Render build & déploie server/
│
Neon Postgres (base de données, gérée séparément)
```

Le principe central : **la CI ne bloque pas Vercel directement** (Vercel a son propre pipeline Git indépendant), mais la **branch protection sur `main`** interdit de merger si la CI échoue — donc rien de cassé n'atteint jamais `main`, donc rien de cassé n'est jamais déployé. Pour le serveur, une couche supplémentaire : le déploiement Render est explicitement conditionné (`needs: server`) à la réussite du job de CI serveur.

### CI — Intégration Continue
[`.github/workflows/ci.yml`](.github/workflows/ci.yml) tourne à chaque `push`/`pull_request` sur `main` :
- job **`client`** : `npm ci` → `npm run lint` → `npm run build`
- job **`server`** : `npm ci` → `npx prisma generate` → `npx tsc --noEmit`

Pas encore de suite de tests automatisés dans ce repo (aucun test n'existe côté client ni serveur) — c'est la prochaine brique à ajouter pour renforcer la CI.

### CD — Déploiement Continu
- **Client → [Vercel](https://vercel.com)** (Root Directory : `client`). Intégration Git native : chaque push sur `main` déploie la prod, chaque PR génère une preview isolée. `client/vercel.json` gère le rewrite SPA, indispensable pour que `react-router-dom` ne 404 pas au refresh sur une route type `/dashboard`.
- **Serveur → [Render](https://render.com)**. Le job `deploy-server` de la CI n'appelle le [Deploy Hook Render](https://render.com/docs/deploy-hooks) (via `curl`) qu'après un job `server` vert — le serveur ne se redéploie jamais sur du code cassé.

### Infrastructure as Code
[`server/render.yaml`](server/render.yaml) est un *Blueprint* Render : la configuration du service (build command, start command, healthcheck, variables d'env) est écrite et versionnée dans le repo plutôt que cliquée à la main dans un dashboard. Render lit ce fichier pour (re)créer le service à l'identique.

Le serveur tourne avec `tsx` directement en prod (pas de `tsc` + `node dist/`) : le `tsconfig.json` compile en `module: ESNext` sans extensions `.js` sur les imports relatifs, ce qui casserait la résolution ESM de Node au runtime. `tsx` évite ce problème et reste cohérent avec `npm run dev` qui l'utilise déjà.

*Pas de Docker ici* — choix assumé, pas un oubli : le runtime natif de Render (buildpack Node) est plus simple à opérer pour ce projet. Docker apporterait une portabilité totale (même image en local/CI/prod, indépendance vis-à-vis de Render) au prix d'un `Dockerfile` à écrire et maintenir — à envisager si on change d'hébergeur ou si l'environnement doit être strictement reproductible.

### Gestion des secrets
- `client/.env.example` et `server/.env.example` documentent les variables nécessaires **sans** valeurs réelles.
- Les vraies valeurs vivent uniquement dans les dashboards Vercel / Render / GitHub Actions Secrets — jamais dans le repo Git.

| Où               | Variable                | Valeur |
|------------------|--------------------------|--------|
| Vercel (dashboard)| `VITE_API_URL`           | URL publique du service Render |
| Vercel (dashboard)| `VITE_NEON_AUTH_URL`     | URL Neon Auth |
| Render (dashboard)| `DATABASE_URL`, `OPEN_ROUTER_API_KEY`, `CORS_ORIGIN`, `BASE_URL` | voir `server/.env.example` |
| GitHub Actions secrets | `RENDER_DEPLOY_HOOK_URL` | Deploy Hook créé dans Render → Settings |

### Observabilité
`GET /health` sur le serveur ([server/index.ts](server/index.ts)) permet à Render de vérifier que le service répond, et de le redémarrer automatiquement sinon.

### Sécurité réseau
Le CORS est piloté par la variable `CORS_ORIGIN` (liste d'origines autorisées) plutôt que grand ouvert. Elle doit inclure l'URL de prod Vercel ; les previews `*.vercel.app` du projet sont autorisées automatiquement par le serveur.

### À faire manuellement (hors du repo)
1. **Render** : New → Blueprint → connecter le repo → renseigner les env vars marquées `sync: false` → créer un Deploy Hook.
2. **GitHub** : Settings → Secrets and variables → Actions → ajouter `RENDER_DEPLOY_HOOK_URL`.
3. **Vercel** : Add New Project → Root Directory `client` → renseigner `VITE_API_URL` et `VITE_NEON_AUTH_URL`.
4. **GitHub branch protection** sur `main` : Settings → Branches → exiger que les checks `client`/`server` passent avant de merger (une fois que la CI a tourné au moins une fois).

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
