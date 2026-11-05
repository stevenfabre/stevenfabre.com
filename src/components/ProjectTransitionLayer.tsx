// Runs before hydration so cross-document snapshots get the correct stacking
// order on both forward navigation and history traversal.
export default function ProjectTransitionLayer() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
    (() => {
      const key = 'portfolio-transition-visual';
      let layer;
      function raise(name) {
        if (!/^film-[a-z0-9-]+$/.test(name || '')) return;
        layer?.remove();
        layer = document.createElement('style');
        layer.textContent = '::view-transition-group(' + name + ') { z-index: 100; }';
        document.head.appendChild(layer);
      }
      addEventListener('pageswap', (event) => {
        const destination = event.activation?.entry?.url;
        if (destination && location.pathname.startsWith('/work/') && new URL(destination).pathname.startsWith('/work/')) {
          event.viewTransition?.skipTransition();
          return;
        }
        const visual = document.querySelector('main > figure > div [data-work-visual]');
        const name = visual && getComputedStyle(visual).viewTransitionName;
        if (name) {
          raise(name);
          try { sessionStorage.setItem(key, name); } catch {}
        }
      });
      addEventListener('pagereveal', (event) => {
        const activation = event.activation || window.navigation?.activation;
        const previous = activation?.from?.url;
        if (location.pathname === '/work' && location.hash.startsWith('#project-')) {
          document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
        }
        if (previous && location.pathname.startsWith('/work/') && new URL(previous).pathname.startsWith('/work/')) {
          event.viewTransition?.skipTransition();
        }
        try {
          const name = sessionStorage.getItem(key);
          sessionStorage.removeItem(key);
          raise(name);
        } catch {}
        event.viewTransition?.finished.then(() => layer?.remove(), () => layer?.remove());
      });
    })();
  `,
      }}
    />
  );
}
