# Work portfolio

The public portfolio is available at `/work` and `/work/[slug]` in development,
preview deployments, and production.

- `work-data.ts`: project copy, company roles, contribution lists, collaborator credits, and gallery definitions.
- `WorkPortfolio.tsx`: server-rendered company overview, with interactive thumbnails in `ProjectGrid.tsx`.
- `ProjectViewer.tsx` and `ProjectContent.tsx`: server-rendered project content, with client navigation and media controls.
- `ProjectPage.tsx`: shared page shell for loaded projects and loading states.
- `ProjectMedia.tsx`: shared media frame and image/video/comparison selection for lead visuals and galleries.
- `ProjectSwipe.tsx`: touch horizontal gestures, spring settling, and inert neighboring previews. `src/utils/swipe.ts` defines distance/velocity thresholds.
- `media-dimensions.json`: original dimensions used to preserve aspect ratios and cap visual sizes.
- `ProjectVideo.tsx`: video controls and poster markup; `useProjectVideo.ts` owns playback synchronization and preview restoration.
- `src/hooks/useSwipeGesture.ts`: shared touch recognition and pointer capture for project and slideshow navigation.
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

On touch screens, project content follows horizontal drags at any viewport width
while the header stays fixed. Gesture eligibility uses pointer type, not layout
breakpoints. Tapping an untouched video reveals its native controls; dragging
across it navigates projects without revealing controls.
Neighboring content is server-rendered and mounted as inert, still-image previews
only during a gesture; adjacent routes are prefetched for the handoff. Vertical
scrolling, browser-edge gestures, and nested comparison/media controls keep their
own behavior. Reduced motion keeps swipe navigation but skips sliding.

Overview/detail transitions decode visible poster images before capturing either
state. Only the selected visual gets a separate transition layer; other media,
the portrait, and navigation stay in the page snapshot. Videos retain a real
poster image until a decoded frame is ready, and remain hidden during snapshots
to avoid empty hardware-video surfaces on iOS. Closing restores the saved
overview scroll position before measuring the destination thumbnail.

Use Tailwind for component layout, spacing, colors, and interaction states.
`HeadingLink` owns heading links and their focus treatment; `buttonStyles.ts`
shares icon-control styling beside `ButtonLink`. Named surface utilities and
shadow tokens in `globals.css` keep floating surfaces consistent. Footer links are data-driven, and
`videoPlayback.ts` owns the preview-to-player session handoff. Keep CSS modules
for coordinated keyframes, media geometry/cropping, and browser-specific range
pseudo-elements rather than duplicating ordinary utility styles.

Use `@/` imports for shared code in `src` and `@/work/` for portfolio code imported from outside that directory. Styled links share `AppLink`, which uses portfolio navigation for local routes and native anchors for external, hash, and mail links.
