# [stevenfabre.com](https://stevenfabre.com)

- Real-time collaboration: [Liveblocks](https://liveblocks.io/)
- Framework: [Next.js](https://nextjs.org/)
- Deployment: [Vercel](https://vercel.com)
- Styling: [Tailwind CSS](https://tailwindcss.com/)

## Running locally

To run locally, you’ll first need to [create a Liveblocks account](https://liveblocks.io/api/auth/signup) to get a new secret key generated.

Once you’ve generated [the public key](https://liveblocks.io/dashboard/apikeys), create an `.env.local` file and assign it to the`NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY` variable.

You can then run the following commands in your terminal:

```bash
git clone https://github.com/stevenfabre/stevenfabre.com.git
cd stevenfabre.com
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Work portfolio

`/work` presents selected projects across design, engineering, art direction, and
company building. Individual projects live at `/work/[slug]`, with descriptions,
contribution credits, collaborators, and image/video galleries. Homepage work
links preview this content.

Portfolio content lives in `app/work/work-data.ts`. The 17 project pages are
prerendered for production. Published media lives in `public/work/media/`, served
as static assets with native caching and byte-range support. Videos are H.264/AAC
MP4s optimized for web playback. Only the published media copies are retained;
local source notes and research in `private/work/` are not needed to build or deploy.
Use descriptive, lowercase, hyphen-separated asset names with a company/project
prefix (for example, `liveblocks-brand-desktop-website.jpg`). Video posters share
the video’s filename stem, and comparison images use `-before` and `-after`.

Shared UI lives in `src/components`. `SiteNavigationProvider` waits for destination
content before capturing native view transitions, with a small Web Animations
fallback. Project detail roots identify readiness with `data-project-slug`;
matching media uses `data-work-visual` and a unique `view-transition-name`.
Animation timing is defined in `src/styles/transitions.css`. Keyboard navigation,
reduced motion, and project-to-project navigation skip travel.

Validate changes with `npx tsc --noEmit`, `npm run lint`, and `npm run build`.
