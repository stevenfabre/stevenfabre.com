export const companyDetails: Record<
  string,
  { role: string; description: string }
> = {
  liveblocks: {
    role: "Co-founder & CEO",
    description:
      "I co-founded Liveblocks to help teams build collaborative software and grew the business from zero to multiple millions in annual recurring revenue. Along the way, I raised over $10M and built the team, systems, and culture to grow without compromising on quality.",
  },
  messenger: {
    role: "Product Design",
    description:
      "At Meta, I worked on design systems for Messenger. One of my projects was Chat Builder, a Figma plugin I designed and built to generate all the layers needed to recreate realistic conversations across any breakpoint or device.",
  },
  invision: {
    role: "Product Design",
    description:
      "I spent nearly five years working on InVision Studio, from its inception through launch. I joined after the Easee acquisition, when almost nothing had been built, and led design for prototyping and motion. I designed and built features too, from a color picker to an update window that introduced users to the people behind Studio.",
  },
  gifmock: {
    role: "Founder",
    description:
      "I designed and built Gifmock to help designers create high-quality GIFs. I ran the business too, looking after the editing experience, launch videos, and updates as the tools around it changed.",
  },
  easee: {
    role: "Founder",
    description:
      "I started Easee on nights and weekends to help designers make web animations without writing code. I built the product, brand, and business around it, before Easee was acquired by [InVision](/work/invision-studio) in 2016.",
  },
  "campaign-monitor": {
    role: "Product Design",
    description:
      "I led design for Campaign Monitor’s email builder. Alongside the product work, I teamed up with Bradley Rodgers on an animated landing page to show how an email comes together, from a blank canvas to the finished design.",
  },
  backseat: {
    role: "Co-founder",
    description:
      "I joined Backseat’s founding team in Sydney to build a ridesharing app. I worked across the app, website, and brand, designing screens, writing code, and making the materials we needed to get the business off the ground.",
  },
};

export const companies = [
  {
    id: "liveblocks",
    name: "Liveblocks",
    url: "https://liveblocks.io",
    years: "2021-Now",
    color: "#9f8dfc",
  },
  {
    id: "messenger",
    name: "Meta",
    url: "https://meta.com",
    years: "2020-2021",
    color: "#3984ff",
  },
  {
    id: "invision",
    name: "InVision",
    url: "https://invisionapp.com",
    years: "2016-2020",
    color: "#ff477f",
  },
  {
    id: "gifmock",
    name: "Gifmock",
    url: "https://gifmock.app",
    years: "2017-Now",
    color: "#22b8a5",
  },
  {
    id: "easee",
    name: "Easee",
    url: "https://thenextweb.com/news/invision-acquires-easee-animation-tool",
    years: "2015-2016",
    color: "#22b8a5",
  },
  {
    id: "campaign-monitor",
    name: "Campaign Monitor",
    url: "https://campaignmonitor.com",
    years: "2014-2016",
    color: "#5582b8",
  },
  {
    id: "backseat",
    name: "Backseat",
    url: "https://www.news.com.au/technology/gadgets/over-taxis-ridesharing-apps-like-uber-and-backseat-hit-australia/news-story/81ebe2794989a0dcc128d97fea140121",
    years: "2014",
    color: "#8ac900",
  },
];

export type Collaborator = {
  name: string;
  role: string;
  href?: string;
  avatar?: string;
};
export type SocialPost = {
  platform?: "instagram";
  name: string;
  handle: string;
  avatar: string;
  text: string;
  publishedAt: string;
  engagement?: {
    likes: number;
    replies: number;
    reposts?: number;
    views?: number;
    shares?: number;
  };
};

export type ProjectVisual = {
  comparison?: { file: string; alt: string };
  kind?: "overview" | "image";
  file: string;
  title: string;
  imageExtension?: "png" | "jpg" | "svg";
  imageAlt?: string;
  aspectRatio: string;
  source?: string;
  caption?: string;
  post?: SocialPost;
};

export function imagePath(visual: ProjectVisual) {
  const extension =
    visual.imageExtension ||
    (visual.kind === "overview"
      ? "svg"
      : visual.kind === "image"
      ? "png"
      : "jpg");
  return `/work/media/${visual.file}.${extension}`;
}

export type Film = ProjectVisual & {
  thumbnailPosition?: string;
  autoLoop?: boolean;
  slug: string;
  company: string;
  year: string;
  duration?: string;
  contributions: string[];
  introduction: string;
  context: string[];
  paragraphs?: string[];
  contribution: string;
  gallery?: ProjectVisual[];
  galleryLayout?: "grid" | "stack";
  links?: { label: string; href: string }[];
  collaborators?: Collaborator[];
};

export const films: Record<string, Film> = {
  liveblocksOverview: {
    file: "liveblocks-company-introduction",
    slug: "building-liveblocks",
    collaborators: [
      {
        name: "Guillaume Salles",
        avatar: "/work/collaborators/guillaume-salles.jpg",
        role: "Co-founder & CTO",
      },
    ],
    autoLoop: false,
    title: "Liveblocks",
    company: "liveblocks",
    year: "2021-Now",
    aspectRatio: "1920 / 1080",
    contributions: [],
    introduction:
      "I met my co-founder Guillaume at [InVision](/work/invision-studio), where we shared a love of building creative tools. We started working on a collaborative presentation tool, but kept running into the same problem: the multiplayer infrastructure we needed was difficult to put together.",
    paragraphs: [
      "We built our own, then realized that other teams were dealing with the same thing. So we set the presentation tool aside and turned that infrastructure into Liveblocks. We launched in 2021 to help software teams bring real-time collaboration to their products.",
      "As co-founder and CEO, I raised over $10M and grew the business from zero to multiple millions in annual recurring revenue. At its peak, our team was 15 people. I interviewed and helped hire everyone, and managed up to 10 people directly. I designed the systems and culture that let us grow while keeping a high bar for quality. My rule is simple: only ship something you’re proud to put your name on.",
      "I still love making things myself. I design, write code, and art direct projects alongside the team. I care about the details of what we ship, and about building a company where other people care about them too.",
    ],
    context: [],
    contribution: "",
    links: [
      {
        label: "The story behind Liveblocks",
        href: "https://liveblocks.io/about",
      },
    ],
  },
  hero: {
    file: "liveblocks-homepage-redesign",
    slug: "liveblocks-art-direction",
    title: "Liveblocks homepage redesign",
    company: "liveblocks",
    year: "2026",
    duration: "0:09",
    aspectRatio: "3 / 2",
    contributions: ["Art direction"],
    introduction:
      "Liveblocks enables multiplayer experiences, so we wanted the homepage to let people experience that firsthand. Show, don’t tell: we created a 3D multiplayer game that visitors can play together, alongside AI agents. I led the art direction, and Marc Bouchenoire designed and built it in Three.js.",
    paragraphs: [
      "The shapes have live reflections, and there’s an Easter egg further down the page: drop in an SVG and it becomes a shape you can play with. I like that the page gives people something to try while introducing what Liveblocks makes possible.",
    ],
    context: [],
    contribution: "",
    collaborators: [
      {
        name: "Marc Bouchenoire",
        avatar: "/work/collaborators/marc-bouchenoire.jpg",
        role: "Design & engineering",
      },
    ],
    galleryLayout: "stack",
    gallery: [
      {
        file: "liveblocks-homepage-reflections",
        title: "Live reflections",
        aspectRatio: "3456 / 2194",
        caption: "Live reflections on the shapes in the homepage hero.",
      },
      {
        file: "liveblocks-homepage-ai-game",
        title: "Playing alongside AI agents",
        aspectRatio: "3456 / 2194",
        caption:
          "A multiplayer game where visitors and AI agents can play together.",
      },
      {
        file: "liveblocks-homepage-svg-playground",
        title: "Bring your own shapes",
        aspectRatio: "2856 / 1694",
        caption:
          "An Easter egg at the end of the page: drop in any SVG and turn it into a shape you can play with in the game.",
      },
    ],
    source: "https://x.com/liveblocks/status/2098051542293311790",
  },
  infrastructure: {
    file: "liveblocks-realtime-infrastructure",
    slug: "liveblocks-realtime-infrastructure",
    thumbnailPosition: "left center",
    title: "Making realtime infrastructure easier to understand",
    company: "liveblocks",
    year: "2026",
    aspectRatio: "1588 / 1080",
    contributions: ["Design", "Engineering"],
    introduction:
      "I designed and built this page to explain the real-time infrastructure behind Liveblocks. It’s an abstract product, so I wanted to give people a way to see how the pieces fit together.",
    paragraphs: [
      "The page shows people and AI agents connected to a shared room, then walks through the things they can do there, from sharing presence to storing data and sending events. I worked on both the design and implementation, including the animations and interactions that help tell that story.",
    ],
    context: [],
    contribution: "",
    source: "https://x.com/stevenfabre/status/2044396309478846970",
  },
  template: {
    file: "liveblocks-nextjs-template-week-multiplayer",
    slug: "nextjs-template-week",
    thumbnailPosition: "left center",
    title: "Next.js Template Week",
    company: "liveblocks",
    year: "2024",
    duration: "0:27",
    aspectRatio: "1556 / 1080",
    contributions: ["Design", "Engineering", "Video production"],
    introduction:
      "For Next.js Template Week, we released three collaborative templates inspired by products people already knew. I created the launch film and designed and built the website for the event.",
    paragraphs: [
      "The site brought the countdowns and launches together, with multiplayer interactions so visitors could play along while they waited. It was a way to show what you could build with Liveblocks before you even opened a template.",
    ],
    context: [],
    contribution: "",
    source: "https://x.com/stevenfabre/status/1834239522642485427",
    galleryLayout: "stack",
    gallery: [
      {
        file: "liveblocks-nextjs-template-week-introduction",
        title: "Next.js Template Week launch film",
        aspectRatio: "16 / 9",
        caption:
          "The launch film I created to introduce the three collaborative templates.",
        source: "https://x.com/liveblocks/status/1834238851314831621",
      },
      {
        file: "liveblocks-nextjs-template-week-issue-tracker",
        title: "Next.js Template Week on launch day",
        aspectRatio: "1544 / 1080",
        caption:
          "The page pairs each template with a countdown. As a new template is revealed, its preview and launch link replace the countdown, inviting visitors to explore what they can build. Here, the first reveal introduces a Linear-like issue tracker.",
        source: "https://x.com/stevenfabre/status/1836058063503016157",
      },
    ],
  },
  louvre: {
    file: "liveblocks-louvre-campaign-launch",
    slug: "liveblocks-louvre-campaign",
    title: "Viral marketing campaign",
    company: "liveblocks",
    year: "2025",
    aspectRatio: "9 / 16",
    contributions: ["Concept", "Art direction", "Marketing"],
    introduction:
      "RAISE Summit, a major AI conference, was taking place at the Louvre. To celebrate Liveblocks 3.0 and reach that audience, I imagined turning the pyramid into a giant screen. I worked on the concept, art direction, and marketing campaign, with Mike Slater creating the films in 3D and VFX.",
    paragraphs: [
      "We released them during RAISE Summit in Paris. Turner Novak, Soleio, and Almonk shared different versions, and Complex picked up the campaign a couple of days later. The films below show how the idea traveled, from our launch to other people sharing it.",
    ],
    context: [],
    contribution: "",
    source: "https://x.com/liveblocks/status/1942678998569353270",
    collaborators: [
      {
        name: "Mike Slater",
        role: "3D & VFX",
        href: "https://mkslate.com/work/live-blocks",
      },
    ],
    gallery: [
      {
        kind: "image",
        file: "liveblocks-louvre-campaign-complex-post",
        post: {
          platform: "instagram",
          name: "Complex",
          handle: "complex",
          // Counts visible in the archived Complex Instagram screenshot.
          engagement: { likes: 27700, replies: 88, shares: 1223 },
          avatar: "liveblocks-louvre-campaign-complex-post.jpg",
          text: "Banksy is that you? 👀\n\nThe Las Vegas Sphere was captured being displayed on the Louvre pyramid in Paris.",
          publishedAt: "2025-07",
        },
        imageExtension: "jpg",
        title: "The campaign on Complex",
        imageAlt:
          "Turner Novak’s screenshot of Complex sharing the Louvre campaign",
        aspectRatio: "1125 / 2012",
        caption:
          "A couple of days later, the campaign appeared on Complex. Screenshot shared by Turner Novak, July 10, 2025.",
        source: "https://www.instagram.com/p/DL6GLE3OfDY/",
      },
      {
        file: "liveblocks-louvre-campaign-sphere",
        post: {
          name: "Turner Novak",
          handle: "TurnerNovak",
          engagement: { likes: 50, replies: 38, reposts: 5, views: 19413 },
          avatar: "liveblocks-louvre-turner-novak-avatar.png",
          text: "someone installed the Las Vegas Sphere on the Louvre pyramid in Paris",
          publishedAt: "2025-07-08T20:12:57+00:00",
        },
        title: "The Louvre meets the Sphere",
        aspectRatio: "9 / 16",
        caption: "The Sphere film, shared by Turner Novak. July 8, 2025.",
        source: "https://x.com/TurnerNovak/status/1942678311743750452",
      },
      {
        file: "liveblocks-louvre-campaign-soleio",
        post: {
          name: "Soleio",
          handle: "soleio",
          engagement: { likes: 24, replies: 3, reposts: 2, views: 2013 },
          avatar: "liveblocks-louvre-soleio-avatar.jpg",
          text: "Everyone at @liveblocks are crazy for doing this at @RaiseSummit",
          publishedAt: "2025-07-08T21:13:53+00:00",
        },
        title: "Louvre campaign film shared by Soleio",
        aspectRatio: "9 / 16",
        caption: "Another take on the pyramid, shared by Soleio. July 8, 2025.",
        source: "https://x.com/soleio/status/1942693645422899411",
      },
      {
        file: "liveblocks-louvre-campaign-almonk",
        post: {
          name: "almonk",
          handle: "almonk",
          engagement: { likes: 27, replies: 7, reposts: 4, views: 3076 },
          avatar: "liveblocks-louvre-almonk-avatar.jpg",
          text: "who gave @stevenfabre the keys to the louvre?",
          publishedAt: "2025-07-08T20:21:00+00:00",
        },
        title: "Louvre campaign film shared by Almonk",
        aspectRatio: "9 / 16",
        caption: "The film shared by Almonk. July 8, 2025.",
        source: "https://x.com/almonk/status/1942680337349300439",
      },
      {
        file: "liveblocks-louvre-campaign-steven-fabre",
        post: {
          name: "Steven Fabre",
          handle: "stevenfabre",
          engagement: { likes: 119, replies: 18, reposts: 9, views: 7583 },
          avatar: "liveblocks-louvre-steven-fabre-avatar.jpg",
          text: "We launched @liveblocks 3.0 a few weeks ago, and just closed our best quarter ever.\nFelt like that deserved something special during @RaiseSummit.",
          publishedAt: "2025-07-08T20:17:51+00:00",
        },
        title: "Steven’s Liveblocks 3.0 campaign film",
        aspectRatio: "9 / 16",
        caption: "The film I shared to celebrate the launch. July 8, 2025.",
        source: "https://x.com/stevenfabre/status/1942679545435312456",
      },
    ],
  },
  liveblocksBrand: {
    thumbnailPosition: "calc(50% + 20px) center",
    kind: "image",
    file: "liveblocks-brand-desktop-website",
    imageExtension: "jpg",
    title: "Liveblocks brand",
    imageAlt: "Liveblocks website displayed on a laptop",
    aspectRatio: "3000 / 1875",
    slug: "liveblocks-brand",
    company: "liveblocks",
    year: "2023",
    contributions: ["Art direction", "Messaging", "Positioning"],
    introduction:
      "We wanted the Liveblocks brand to reflect what we were helping teams build: a more collaborative web. I worked on the art direction, messaging, and positioning, while Pierre Le Vaillant designed and executed the identity.",
    paragraphs: [
      "The message was simple: collaborative experiences in days, not months. The visual identity paired clear typography with softer shapes, color, and multiplayer cursors. Pierre carried it through the website, documentation, and dashboard so they felt like parts of the same product.",
    ],
    context: [],
    contribution: "",
    source: "https://x.com/levaillantp/status/1622650404814061569",
    collaborators: [
      {
        name: "Pierre Le Vaillant",
        avatar: "/work/collaborators/pierre-levaillant.jpg",
        role: "Brand design",
        href: "https://x.com/levaillantp",
      },
    ],
    galleryLayout: "stack",
    gallery: [
      {
        kind: "image",
        file: "liveblocks-brand-collaboration-messaging",
        imageExtension: "jpg",
        title: "Collaborative experiences in days, not months",
        imageAlt:
          "Collaborative experiences in days, not months, with multiplayer cursors",
        aspectRatio: "3000 / 1875",
      },
      {
        kind: "image",
        file: "liveblocks-brand-identity-card",
        imageExtension: "jpg",
        title: "The Liveblocks identity",
        imageAlt: "Liveblocks identity on a black folded card",
        aspectRatio: "2800 / 1750",
      },
      {
        kind: "image",
        file: "liveblocks-brand-react-brussels-announcement",
        imageExtension: "jpg",
        title: "Event announcement",
        imageAlt: "Liveblocks React Brussels event announcement",
        aspectRatio: "3000 / 1875",
      },
      {
        kind: "image",
        file: "liveblocks-brand-wordmark",
        imageExtension: "png",
        title: "The Liveblocks wordmark",
        imageAlt: "White Liveblocks wordmark on black",
        aspectRatio: "3000 / 1688",
      },
      {
        kind: "image",
        file: "liveblocks-brand-colors-and-shapes",
        imageExtension: "jpg",
        title: "Color and shapes",
        imageAlt: "Soft green and yellow gradients with geometric shapes",
        aspectRatio: "1920 / 1080",
      },
      {
        kind: "image",
        file: "liveblocks-brand-station-poster",
        imageExtension: "jpg",
        title: "Brand application",
        imageAlt: "Liveblocks poster concept in a station setting",
        aspectRatio: "3000 / 1875",
      },
      {
        kind: "image",
        file: "liveblocks-brand-collaborative-shapes",
        imageExtension: "jpg",
        title: "Collaborative shapes",
        imageAlt: "Colored circles connected by dark geometric shapes",
        aspectRatio: "3000 / 1688",
      },
      {
        kind: "image",
        file: "liveblocks-brand-mobile-website",
        imageExtension: "jpg",
        title: "Mobile website",
        imageAlt: "Liveblocks website displayed on a phone",
        aspectRatio: "3000 / 1875",
      },
    ],
  },
  logo: {
    file: "liveblocks-logo-experiment",
    slug: "liveblocks-logo-experiment",
    title: "Liveblocks logo experiment",
    company: "liveblocks",
    year: "2025",
    duration: "0:10",
    aspectRatio: "1 / 1",
    contributions: ["Concept", "Video production"],
    introduction:
      "I made this with AI video tools to see what the Liveblocks logo could look like as a physical object. I liked playing with the reflections, light, and material. A small experiment, mostly for the fun of making it.",
    context: [],
    contribution: "",
    source: "https://x.com/stevenfabre/status/1938648049636491558",
  },
  messenger: {
    file: "meta-messenger-chat-builder",
    slug: "messenger-chat-builder",
    title: "Chat Builder for Messenger",
    company: "messenger",
    year: "2020",
    duration: "1:15",
    aspectRatio: "16 / 9",
    contributions: ["Design", "Engineering", "Video production"],
    introduction:
      "Making realistic conversation mockups at Messenger took a lot of work. Designers needed to show the same conversation on different devices and from different senders’ perspectives. Long messages and busy group chats made it even harder to test how a design would hold up.",
    paragraphs: [
      "I designed and built Chat Builder to make that easier. Designers could put together a conversation, edit the messages and reactions, and generate it directly in Figma. It made it much simpler to try the awkward cases as well as the ideal ones.",
      "To introduce the tool, I created the launch video above. It helped drive adoption across the whole Messenger design team.",
    ],
    context: [],
    contribution: "",
  },
  studioOverview: {
    file: "invision-studio",
    slug: "invision-studio",
    collaborators: [
      {
        name: "Scott Savarie",
        avatar: "/work/collaborators/scott-savarie.jpg",
        role: "Product design",
      },
      {
        name: "Tom Giannattasio",
        avatar: "/work/collaborators/tom-giannattasio.jpg",
        role: "Product design",
      },
      {
        name: "Andy Orsow",
        avatar: "/work/collaborators/andy-orsow.jpg",
        role: "Video production",
      },
    ],
    title: "InVision Studio",
    company: "invision",
    year: "2016-2020",
    aspectRatio: "16 / 9",
    contributions: ["Design", "Engineering"],
    introduction:
      "InVision acquired my animation tool, [Easee](/work/easee), in 2016. I joined the team to help build Studio from the ground up. At the time, designing a product meant moving between tools: Sketch or Photoshop for screens, InVision for prototypes, another tool for animation, then handing it all to a developer.",
    paragraphs: [
      "Studio aimed to bring that workflow into one place. I worked on it for over four years, starting with a team of five that grew to more than 60 people.",
      "My main focus was prototyping and animation, building on the work I’d done with Easee. I led design for those features and built prototypes to work through how they should feel.",
      "I later led the cloud initiative: bringing Studio online and making it multiplayer, much like Figma. Working on that challenge eventually led me to start [Liveblocks](/work/building-liveblocks).",
    ],
    context: [],
    contribution: "",
  },
  colorpicker: {
    file: "invision-studio-color-picker",
    slug: "invision-color-picker",
    title: "InVision Studio color picker",
    company: "invision",
    year: "2020",
    duration: "1:32",
    aspectRatio: "1440 / 936",
    contributions: ["Design", "Engineering"],
    introduction:
      "Picking one color is fairly straightforward. Putting together a consistent palette of colors that work well together is harder. I wanted to explore how a color picker could help with that inside InVision Studio.",
    paragraphs: [
      "I designed and built the whole experience myself, from the familiar sliders and color values to a color wheel for exploring how colors relate to one another. The idea was to make it easier to work on a palette as a whole, while keeping the everyday controls close by.",
    ],
    context: [],
    contribution: "",
  },
  studioUpdateWindow: {
    file: "invision-studio-update-window",
    slug: "invision-update-window",
    title: "A more personal update window",
    company: "invision",
    year: "2019",
    aspectRatio: "4 / 3",
    contributions: ["Design", "Engineering"],
    introduction:
      "Release notes tell you what changed, but rarely give you a sense of the people doing the work. I wanted updates in InVision Studio to feel more personal and create a connection between our users and the team.",
    paragraphs: [
      "I designed and built a new update window that put the team’s faces and names alongside what we’d been making. A small interaction, but a chance for people using Studio to meet the people building it.",
    ],
    context: [],
    contribution: "",
  },
  gifmock: {
    file: "gifmock-sketch-demo",
    slug: "gifmock",
    title: "Gifmock for Sketch",
    company: "gifmock",
    year: "2018",
    duration: "0:48",
    aspectRatio: "16 / 9",
    contributions: ["Design", "Engineering", "Marketing"],
    introduction:
      "Gifmock started with a problem I had myself. I often found that a GIF was the simplest way to explain a concept, and I wanted an easy way to make one from the static layers I was already designing.",
    paragraphs: [
      "I designed and built a tool that worked directly inside Sketch, and later Figma. You could turn layers into frames, adjust their timing, preview the animation, and export a GIF without leaving your design tool.",
      "I ran the business too, and kept working on the details that made a difference when using it: cropping out empty space, choosing the right resolution, and lining everything up. The clips below show some of that work.",
    ],
    context: [],
    contribution: "",
    source: "https://x.com/stevenfabre/status/1333419640517783552",
    galleryLayout: "stack",
    gallery: [
      {
        file: "gifmock-figma-precision-editing",
        title: "Pixel-perfect GIFs in Figma",
        aspectRatio: "852 / 480",
        caption:
          "In Gifmock for Figma, I built controls for pinching to zoom, changing the resolution, cropping, and nudging things into place. September 2020.",
        source: "https://x.com/gifmock/status/1301648377034104833",
      },
      {
        file: "gifmock-auto-crop",
        title: "One-click cropping",
        aspectRatio: "1012 / 600",
        caption:
          "Automatic cropping removes the empty space around an animation in one click. August 2020.",
        source: "https://x.com/gifmock/status/1298007564316102656",
      },
      {
        file: "gifmock-macos-big-sur",
        title: "Gifmock for macOS Big Sur",
        aspectRatio: "1126 / 820",
        caption: "The Mac app, updated for macOS Big Sur in November 2020.",
        source: "https://x.com/gifmock/status/1327637293490974721",
      },
    ],
  },
  easee: {
    kind: "image",
    file: "easee-homepage",
    slug: "easee",
    title: "Easee",
    company: "easee",
    year: "2015",
    aspectRatio: "2340 / 1344",
    imageAlt:
      "The original Easee website, with its visual animation editor and green gradient",
    contributions: ["Design", "Engineering", "Branding", "Marketing"],
    introduction:
      "Easee started as a prototype for the designers I worked with at Campaign Monitor. I wanted to help them make CSS animations visually, and kept working on it at night and on weekends until it became a product of its own.",
    paragraphs: [
      "You could bring in layers from Sketch or Photoshop, animate them, and export the CSS to use on the web. I designed and built the editor, created the brand and website, and ran the business.",
      "In November 2015, net magazine featured Easee as its side project of the month. InVision acquired it in April 2016, and I joined the team to work on Studio.",
    ],
    context: [],
    contribution: "",
    gallery: [
      {
        kind: "image",
        file: "easee-animation-library",
        title: "Animation library",
        imageAlt:
          "Easee’s animation library, with a grid of saved projects and a button to create a new animation",
        aspectRatio: "1170 / 624",
        caption:
          "The animation library. A place to keep your experiments and start something new.",
      },
      {
        kind: "image",
        file: "easee-animation-builder",
        title: "Animation builder",
        imageAlt:
          "Easee’s visual animation editor with layer controls for timing, easing, position, scale, rotation, and opacity",
        aspectRatio: "2340 / 1654",
        caption:
          "Set the start and end states, adjust the timing and easing, then play it back. No code needed.",
      },
      {
        kind: "image",
        file: "easee-animation-builder-css",
        title: "CSS export",
        imageAlt:
          "Generated CSS transitions and transforms displayed over the Easee animation editor",
        aspectRatio: "2340 / 1654",
        caption:
          "When you’re happy with the animation, export the CSS to use it on the web.",
      },
      {
        kind: "image",
        file: "easee-net-magazine-feature",
        title: "Easee in net magazine",
        imageAlt:
          "November 2015 net magazine interview with Steven Fabre about creating Easee",
        aspectRatio: "951 / 1240",
        caption:
          "Side project of the month. My interview in net magazine, November 2015.",
      },
    ],
  },
  campaignMonitorBuilder: {
    kind: "image",
    file: "campaign-monitor-email-builder-drag-and-drop",
    slug: "campaign-monitor-email-builder",
    title: "Campaign Monitor email builder",
    company: "campaign-monitor",
    year: "2014-2016",
    aspectRatio: "2340 / 1536",
    imageAlt: "Dragging a content block into a Campaign Monitor email",
    contributions: ["Design", "Engineering", "Research"],
    introduction:
      "Making a responsive email meant dealing with a lot of technical constraints. The email builder let marketers put one together by dragging in content, without having to write HTML. I led design for the team, building on the original interface designed by Buzz Usborne.",
    paragraphs: [
      "One problem kept coming up in support tickets and customer interviews: people wanted more control over typography. But a font size that worked in one column could fall apart on a phone, or when the text moved into a narrower layout.",
      "I designed an inline text editor that gave people that flexibility while keeping the controls simple. Behind it, font sizes and line heights adapted to the device and layout, so customers could make the email their own without having to fix every version themselves.",
    ],
    context: [],
    contribution: "",
    collaborators: [
      {
        name: "Buzz Usborne",
        avatar: "/work/collaborators/buzz-usborne.jpg",
        role: "Product design",
      },
    ],
    galleryLayout: "stack",
    gallery: [
      {
        kind: "image",
        file: "campaign-monitor-typography-editor-after",
        title: "Typography controls",
        aspectRatio: "1140 / 576",
        imageAlt: "The redesigned inline typography editor",
        comparison: {
          file: "campaign-monitor-typography-editor-before",
          alt: "The previous inline text editor",
        },
        caption:
          "Before and after the typography controls. Move across the image, or drag the handle, to compare.",
      },
    ],
  },
  campaignMonitor: {
    kind: "image",
    file: "campaign-monitor-email-builder-landing-page",
    thumbnailPosition: "21% center",
    slug: "campaign-monitor",
    title: "Email builder landing page",
    company: "campaign-monitor",
    year: "2015",
    aspectRatio: "2340 / 1492",
    imageAlt:
      "Campaign Monitor’s Build beautiful emails landing page, with an illustrated email builder",
    contributions: ["Animation", "Engineering"],
    introduction:
      "Bradley Rodgers and I made this landing page during a 24-hour Ship It day at Campaign Monitor. We wanted to show the email builder in action by animating someone putting an email together.",
    paragraphs: [
      "Bradley created the illustrations. I storyboarded the sequence and wrote the animation code. I was also leading design for the email builder, so this was a chance to take the product I worked on and explain it through motion.",
    ],
    context: [],
    contribution: "",
    collaborators: [
      {
        name: "Bradley Rodgers",
        avatar: "/work/collaborators/bradley-rodgers.jpg",
        role: "Illustration",
      },
    ],
  },
  campaignMonitorGallery: {
    kind: "image",
    file: "campaign-monitor-template-gallery-sxsw",
    imageExtension: "jpg",
    slug: "campaign-monitor-template-gallery",
    title: "A new template gallery",
    company: "campaign-monitor",
    year: "2014-2016",
    aspectRatio: "1755 / 900",
    imageAlt: "A customer at SXSW choosing a Campaign Monitor email template",
    contributions: ["Design", "Engineering", "Research"],
    introduction:
      "We had an email builder that customers weren’t finding. A survey helped me understand why: the template gallery was hard to get to, and the choice of templates didn’t give people enough reason to try it.",
    paragraphs: [
      "I designed a new gallery that made the templates easier to discover and browse. We wanted people to see what they could make before they opened the editor. After the redesign, adoption of the email builder increased by 50%.",
      "I also worked on the small interactions: how a template responded on hover, when you clicked it, and while the builder loaded. Each state gave people feedback so they knew what was happening.",
    ],
    context: [],
    contribution: "",
    collaborators: [
      {
        name: "Buzz Usborne",
        avatar: "/work/collaborators/buzz-usborne.jpg",
        role: "Product design",
      },
    ],
    galleryLayout: "stack",
    gallery: [
      {
        kind: "image",
        file: "campaign-monitor-template-gallery-after",
        title: "Template gallery before and after",
        aspectRatio: "1140 / 672",
        imageAlt: "Campaign Monitor’s redesigned template gallery",
        comparison: {
          file: "campaign-monitor-template-gallery-before",
          alt: "Campaign Monitor’s previous template gallery",
        },
        caption: "The template gallery before and after the redesign.",
      },
    ],
  },
  backseat: {
    kind: "image",
    file: "backseat-ride-request-iphone",
    slug: "backseat",
    title: "Getting Backseat on the road",
    company: "backseat",
    year: "2014",
    aspectRatio: "3 / 2",
    imageAlt:
      "The original Backseat ride-request interface presented in a silver iPhone 6s mockup",
    contributions: ["Design", "Engineering"],
    introduction:
      "I joined Backseat’s founding team in Sydney in early 2014. We were building a ridesharing app, and I worked across the product, website, and brand.",
    paragraphs: [
      "I designed the user flows and app screens, built parts of the interface, and designed and coded the website. I also made the things we needed around the product, from icons and flyers to investor decks.",
      "We were featured on Channel 9’s Financial Review Sunday, but the risk of heavy fines made it difficult to keep going. Drivers faced fines of up to $110,000 for charging for trips without accreditation. We were still looking for funding and couldn’t take that risk, so we paused the business while exploring other options.",
    ],
    context: [],
    contribution: "",
    galleryLayout: "stack",
    gallery: [
      {
        kind: "image",
        file: "backseat-channel-nine-feature",
        imageExtension: "png",
        title: "Backseat on Channel 9",
        imageAlt: "Backseat featured on Channel 9’s Financial Review Sunday",
        aspectRatio: "1155 / 650",
        caption: "Backseat on Channel 9’s Financial Review Sunday, 2014.",
      },
    ],
  },
};
export const allFilms = Object.values(films);

// Keep existing shared links working after related work is combined.
export const projectRedirects: Record<string, string> = {
  "invision-studio-prototypes": "invision-studio",
  "template-week-film": "nextjs-template-week",
  "template-week-website": "nextjs-template-week",
  "gifmock-for-sketch": "gifmock",
  "gifmock-for-figma": "gifmock#visual-gifmock-figma-precision-editing",
  "gifmock-auto-crop": "gifmock#visual-gifmock-auto-crop",
  "gifmock-big-sur": "gifmock#visual-gifmock-macos-big-sur",
};
