## Up Next

- [ ] Fix soft 404 — `notFound()` returns HTTP 200
- [ ] Make the `[kingdom]` archive static

## Known Issues

### Soft 404: `notFound()` returns HTTP 200

The frontend renders the correct not-found UI but responds **200 instead of 404**.
Reproduced in dev, in a local production build, and on `symbiosis.barnemax.com`.
Routes that match nothing at all (e.g. `/some/deep/nonsense`) _do_ return a proper
404, so this is specific to `notFound()` being called from a route that matched.

Matters for SEO: Google treats soft 404s as indexable duplicates.

Three plausible causes were each tested and eliminated — don't repeat this work:

- **next-intl middleware rewrite** — temporarily bypassed the rewrite in `proxy.ts`
  for a probe path; still 200.
- **`loading.tsx` flushing the shell before `notFound()` fires** — removed both
  `[kingdom]/loading.tsx` and `[kingdom]/[slug]/loading.tsx`, rebuilt; still 200.
- **ISR / full-route caching** — `/nope` is dynamic and serves `no-store`; still 200.

Open question: whether this predates the multiple-root-layouts refactor in `6d8cda0`
(which removed `app/layout.tsx` in favour of `app/[locale]/layout.tsx` +
`app/admin/layout.tsx`). Settle it with a git worktree on `6d8cda0~1` rather than
stashing. Next 16's `app/global-not-found.tsx` is also worth testing, since there is
no longer a single root layout.

Related: a `not-found.tsx` placed inside a route group is never matched — that is why
the boundary lives at `app/[locale]/not-found.tsx` and rebuilds the public shell by
hand instead of inheriting `(public)/layout.tsx`.

### Swagger UI broken in production

`https://symbiosis-api.barnemax.com/api/docs` doesn't work properly. Local dev serves
it fine, so this looks prod-specific. Confirm the actual failure mode first (blank
page, 404, asset errors, CSP) before assuming a cause. Candidates: `composer install
--no-dev` in `docker/php/Dockerfile.prod` dropping the docs assets, `auto_https off`
plus custom-domain routing, or asset paths under the Railway domain.

## Ideas

### Static `[kingdom]` archive

`app/[locale]/(public)/[kingdom]/page.tsx` is the only public route still rendered on
demand. The sole cause is that it awaits `searchParams` (`search`, `sort`, `page`) —
query strings aren't part of a URL path, so Next can't prerender one file per query.

Plan: ship the species list to the browser and filter locally. ~109KB of JSON (~25KB
gzipped) for ~74 species, sent once, making search/sort/pagination instant and
removing the debounced `router.replace()` → SSR round trip in `SearchInput.tsx`.

The usual objection — paginated results stop being crawlable — doesn't apply here:
`sitemap.xml` enumerates every species URL and all 148 species pages are prerendered,
so crawl discovery never depended on `?page=2`.

Remaining trade-off is staleness between deploys; consider rendering from the baked
list and revalidating in the background. The alternative lever is Next 16's
`cacheComponents` (PPR), which would leave the data flow untouched and stream only the
list, but it's a project-wide config flag that needs re-testing on every route.

### Migration map (Leaflet)

Migratory bird species (e.g. _Oriolus oriolus_, _Sturnus vulgaris_) have well-documented, GeoJSON-friendly range data. A Leaflet map on the species detail page could show:

- **Breeding range** (summer)
- **Wintering range** (sub-Saharan Africa for oriole)
- **Migration corridor** as a polyline or gradient overlay

Implementation sketch:

- Add a `migrationGeoJson` field to the Species entity (nullable JSON column) for species that migrate
- Source polygons from GBIF or BirdLife range maps (CC-licensed shapefiles → GeoJSON via QGIS/mapshaper)
- Render with `react-leaflet` on the species detail page. No extra backend work needed once the JSON is stored
- Non-migratory / resident species simply omit the field and show nothing

This would be a standout visual feature with almost no backend complexity.

### Image optimization

Images are now downloaded and converted to WebP locally via `app:download-media`. Next.js `<Image>` still uses `unoptimized` because the API server is on a private Docker network that Next.js image optimization can't reach. Options:

- Serve images from a shared volume or CDN so Next.js can optimize them
- Self-host the Next.js image optimizer with `minimumCacheTTL`
