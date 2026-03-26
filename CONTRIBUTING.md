# Contributing to Togetherwise

Thank you for contributing! This guide explains the Git workflow to collaborate cleanly.

## Branching Strategy

```
main          ← Production-ready code only (protected)
│
├── dev       ← Integration branch — all features merge here first
│   │
│   ├── feature/home-page-hero
│   ├── feature/donation-stripe-integration
│   ├── feature/admin-volunteer-management
│   └── fix/navbar-mobile-menu
```

## How to Work on a Feature

### 1. Always start from `dev`
```bash
git checkout dev
git pull origin dev
git checkout -b feature/your-feature-name
```

### 2. Work and commit regularly
```bash
git add .
git commit -m "feat: add stripe payment integration"
```

**Commit message format:**
| Prefix | Use for |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `style:` | UI/CSS changes only |
| `refactor:` | Code restructure, no behavior change |
| `docs:` | README or comments |
| `chore:` | Config, deps, build |

### 3. Push your branch
```bash
git push origin feature/your-feature-name
```

### 4. Open a Pull Request → into `dev`
- Describe what changed and why
- Request a review from your collaborator
- Do NOT merge directly into `main`

### 5. Merge `dev` → `main` when ready to deploy
```bash
git checkout main
git merge dev
git push origin main
```

## What NOT to commit
- `.env` files (they are gitignored — use `.env.example` as template)
- `node_modules/`
- `client/dist/` (build output)
- `server/uploads/` (user-uploaded files)

## First-Time Setup (for your collaborator)
```bash
git clone https://github.com/YOUR_USERNAME/togetherwise.git
cd togetherwise

# Backend
cd server
cp .env.example .env      # Fill in your MongoDB URI + JWT secret
npm install
npm run dev

# Frontend (in a new terminal)
cd ../client
npm install
npm run dev
```
