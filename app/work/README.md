# Work portfolio

The public portfolio is available at `/work` and `/work/[slug]` in development,
preview deployments, and production.

- `work-data.ts`: project copy, company roles, contribution lists, collaborator credits, and gallery definitions.
- `WorkPortfolio.tsx`: the company-organized thumbnail overview.
- `ProjectViewer.tsx`: focused project views with previous/next and close navigation.
- `media-dimensions.json`: original dimensions used to preserve aspect ratios and cap visual sizes.
- `ProjectVideo.tsx`: video playback controls, visibility-aware playback, and preview playback restoration.
- `preview/route.ts`: the homepage preview manifest.
- `public/work/media/`: published images, posters, avatars, and web-optimized videos. Static hosting handles caching and byte ranges.
- `src/components/SiteNavigation.tsx`: route-ready shared-element transitions and fallback animation.
- `src/utils/preloadMedia.ts`: bounded image and video metadata preloading.

Original media and research in `private/work/` are excluded from Git and deployment.
To add a project, update its data and dimensions, add the referenced public assets,
and verify the overview, detail view, and mobile layout. Respect reduced-motion
preferences and keep previous/next navigation instant.
