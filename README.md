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

## Local portfolio draft

The optional portfolio lives in ignored `app/work/` and `private/work/` folders.
Its pages and media routes are development-only; they are not part of this public
repository or its deployment previews. Homepage work links keep their external
URLs in production.

Shared UI lives in `src/components`. `SiteNavigationProvider` waits for destination
content before capturing native view transitions, with a small Web Animations
fallback. Project detail roots identify readiness with `data-project-slug`;
matching media uses `data-work-visual` and a unique `view-transition-name`.
Animation timing is defined in `src/styles/transitions.css`. Keyboard navigation,
reduced motion, and project-to-project navigation skip travel.

Validate changes with `npx tsc --noEmit`, `npm run lint`, and `npm run build`.
