# 2048

A React + TypeScript implementation of the classic 2048 sliding tile puzzle.

**Live demo:** https://hyfung.github.io/2048/

## Controls

| Input | Action |
|-------|--------|
| Arrow keys / WASD | Move tiles |
| Swipe | Move tiles (mobile) |

## Stack

- React 18 + TypeScript
- Vite 5
- Docker (dev server)

## Development

**Local (with nvm):**
```bash
./npm_run_dev.sh
```

**Docker:**
```bash
./run.sh
```

**Build:**
```bash
npm run build
```

## Deployment

Pushes to `master` automatically build and deploy to GitHub Pages via GitHub Actions.

> **First-time setup:** Go to *Settings → Pages* in the GitHub repo and set the source to **GitHub Actions**.
