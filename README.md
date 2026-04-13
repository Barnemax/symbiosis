# Symbiosis | Nature Encyclopedia

A nature encyclopedia built with **Symfony 8 + API Platform 4** and a **Next.js 16** frontend, exploring ecological relationships between birds, trees, and fungi.

> A playground for experimenting with AI-assisted content curation and an excuse to learn more about nature.

---

## Stack

| Layer | Technology |
|---|---|
| Backend | Symfony 8, API Platform 4, Doctrine ORM |
| Database | PostgreSQL 16 |
| Web server | FrankenPHP (Caddy) |
| Frontend | Next.js 16, React 19 (App Router) |
| Auth | NextAuth v5 (Credentials provider) |
| Containerization | Docker + Docker Compose |

---

## What it does

The encyclopedia covers three kingdoms — **birds**, **trees**, and **fungi** — linked by typed ecological relationships (`nests_in`, `feeds_on`, `symbiosis_with`, `disperses_spores_of`, …). Each species has a scientific name, IUCN conservation status, common names in multiple locales, and associated media (images, bird calls).

An interactive force-graph on the `/explore` page visualises the full ecological network.

The API is self-documented at `/api/docs` (Swagger/OpenAPI).

---

## Getting started

**Requirements:** [Docker Desktop](https://www.docker.com/products/docker-desktop/)

```bash
git clone <repo-url>
cd symbiosis
cp frontend/.env.example frontend/.env.local
# edit api/.env.local and frontend/.env.local with your secrets
docker compose up -d
docker compose exec php composer install
```

Seed the database:

```bash
docker compose exec php bin/console doctrine:migrations:migrate
docker compose exec php bin/console doctrine:fixtures:load
```

- Frontend: http://localhost:3000
- API: http://localhost:8080/api
- Swagger: http://localhost:8080/api/docs

---

## Data

All species data has real, documented ecological associations. The dataset is expanded using a Claude-assisted curation workflow (see below). Sources:

- [Wikipedia](https://wikipedia.org/) — species descriptions
- [Wikimedia Commons](https://commons.wikimedia.org/) — images (CC-licensed)
- [iNaturalist](https://www.inaturalist.org/) — leaf and feather photos (CC-licensed)
- [xeno-canto](https://xeno-canto.org/) — bird calls (CC-licensed)
- [IUCN Red List](https://www.iucnredlist.org/) — conservation status

### Claude-assisted curation workflow

Adding ecologically accurate species to the dataset involves two tools:

**`scripts/suggest-species.mjs`** — a Node script that calls the Claude API. It reads the existing fixture data and asks Claude to suggest new species with *documented* ecological links to what's already in the dataset (not just plausible ones). Output is a structured Markdown file ranking candidates by relationship density.

**Claude Code skills** (`/review-suggestions`, `/add-species`) — slash commands that run inside Claude Code. `/review-suggestions` reads the latest suggestions file and cross-references it against the current fixtures to recommend the best additions. `/add-species` takes a species name, writes the PHP fixture entry, and updates the suggest script's known-species list so future runs stay in sync.

This keeps the dataset small but ecologically coherent — every relationship in the graph has a real source.

---

## License

MIT
