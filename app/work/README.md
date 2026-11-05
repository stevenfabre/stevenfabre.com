# Work portfolio

The public portfolio is available at `/work` and `/work/[slug]` in development,
preview deployments, and production.

- `work-data.ts`: project copy, company roles, contribution lists, collaborator credits, and gallery definitions.
- `WorkPortfolio.tsx`: server-rendered company overview, with interactive thumbnails in `ProjectGrid.tsx`.
- `ProjectViewer.tsx`: server-rendered project content, with client navigation and media controls.
- `media-dimensions.json`: original dimensions used to preserve aspect ratios and cap visual sizes.
- `ProjectVideo.tsx`: video playback controls, visibility-aware playback, and preview playback restoration.
- `preview-data.ts`: static homepage preview data passed directly from the server.
- `public/work/media/`: published images, posters, avatars, and web-optimized videos. Static hosting handles caching and byte ranges.
- `src/components/SiteNavigation.tsx`: route-ready shared-element transitions and fallback animation.
- `src/utils/preloadMedia.ts`: bounded image and video metadata preloading.

Only published media copies are retained. Local source notes and research in
`private/work/` are excluded from Git and deployment. Name assets with a company
or project prefix and a descriptive subject, using lowercase hyphen-separated
words. Avoid numbered exports and suffixes such as `hq` or `final`; keep video
and poster stems aligned, and use `-before`/`-after` for comparisons.
To add a project, update its data and dimensions, add the referenced public assets,
and verify the overview, detail view, and mobile layout. Respect reduced-motion
preferences and keep previous/next navigation instant.

Page content renders `RouteReady` once committed, so transitions wait for real
content rather than a loading boundary. Internal links and keyboard shortcuts
use the same Next.js navigation provider. Event listeners live in effects with
cleanup; executable inline navigation scripts are unnecessary. The remaining
JSON-LD script is structured data for search engines.
