## Up Next
- [ ] Change font
- [ ] Better design for relationship graph
- [ ] Deployment (Railway / VPS)

## Ideas

### Migration map (Leaflet)
Migratory bird species (e.g. *Oriolus oriolus*, *Sturnus vulgaris*) have well-documented, GeoJSON-friendly range data. A Leaflet map on the species detail page could show:
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