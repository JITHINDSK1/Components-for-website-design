import { Resource } from '../types/resource';

export const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'res-1',
    title: 'Interactive 3D Bento Grid with Glow Borders',
    description: 'Modular high-contrast bento layout featuring subtle border hover highlights and nested cards.',
    type: 'component',
    sourceUrl: 'https://21st.dev/r/aceternity/bento-grid',
    sourceWebsiteName: '21st.dev',
    previewImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    promptText: `Create a responsive 3D Bento Grid component in React with Tailwind CSS.
Features:
- Dark background (#0D0D0F) with slate-800 borders (#1F1F24).
- Hover effect: radial glow gradient following cursor position.
- Flexible spans: col-span-1 to col-span-3 for varied card weights.
- Clean typography and subtle spring transition on card hover.`,
    createdAt: '2026-02-01T12:00:00Z',
    updatedAt: '2026-02-01T12:00:00Z',
  },
  {
    id: 'res-2',
    title: 'Senior Frontend & Design System Architect Prompt',
    description: 'High-precision system prompt for generating clean dark-mode React components with strict TypeScript.',
    type: 'prompt',
    sourceUrl: 'https://claude.ai/prompts/library',
    sourceWebsiteName: 'claude.ai',
    promptText: `You are an elite Senior UI/UX Engineer and Design Technologist.
When building React components:
1. Always apply dark-first minimalist aesthetics (#0D0D0F canvas, #16161A cards, #26262B borders).
2. Prioritize semantic HTML, strict TypeScript typing with zero 'any', and compound component patterns.
3. Every button or interactive card must feature keyboard focus rings, subtle hover scale or border sheen, and disabled states.
4. Keep CSS utility footprint compact without redundant classes.
5. Provide realistic, contextual mock data instead of placeholder text like 'Lorem Ipsum'.`,
    createdAt: '2026-02-02T09:30:00Z',
    updatedAt: '2026-02-05T11:15:00Z',
  },
  {
    id: 'res-3',
    title: 'Linear-Style Global Command Palette (Cmd+K)',
    description: 'Keyboard-first command navigation overlay with fuzzy search and categorized actions.',
    type: 'component',
    sourceUrl: 'https://cmdk.paco.me',
    sourceWebsiteName: 'cmdk.paco.me',
    previewImageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    promptText: `Implement a fast Cmd+K command palette using React and Tailwind CSS.
Include:
- Global shortcut listener for Cmd+K and Ctrl+K.
- Backdrop blur overlay with fade animation.
- Instant keyboard navigation with ArrowUp, ArrowDown, Enter, and Escape.
- Categorized list items (Navigation, Actions, Settings).`,
    createdAt: '2026-02-03T15:45:00Z',
    updatedAt: '2026-02-03T15:45:00Z',
  },
  {
    id: 'res-4',
    title: 'Godly — Curated Web Design Inspiration',
    description: 'The best web design inspiration on the internet. Everyday browsing for cutting-edge digital experiences.',
    type: 'website',
    sourceUrl: 'https://godly.website',
    sourceWebsiteName: 'godly.website',
    previewImageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-02-05T18:00:00Z',
    updatedAt: '2026-02-05T18:00:00Z',
  },
  {
    id: 'res-5',
    title: 'Dynamic Island HUD Notification Component',
    description: 'Expanding pill notification island with fluid layout transitions and spring physics.',
    type: 'component',
    sourceUrl: 'https://github.com/emilkowalski/vaul',
    sourceWebsiteName: 'github.com',
    previewImageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    promptText: `Build an iOS-inspired Dynamic Island component in React.
Support states:
- Compact pill (idle)
- Expanded audio player (with waveforms)
- Incoming call notification
Use Framer Motion layoutId for fluid Morph transitions.`,
    createdAt: '2026-02-07T11:20:00Z',
    updatedAt: '2026-02-07T11:20:00Z',
  },
  {
    id: 'res-6',
    title: 'Tailwind Color Palette Generator Prompt',
    description: 'Formulaic prompt to generate accessible, balanced 10-shade HSL dark-mode palettes.',
    type: 'prompt',
    sourceUrl: 'https://chatgpt.com',
    sourceWebsiteName: 'chatgpt.com',
    promptText: `Generate a 10-step accessible Tailwind CSS color token system based on an electric blue primary hue.
Include:
- 50 to 950 stops with perceptual lightness progression
- Surface neutral shades tinted with 2% blue undertone
- Contrast ratios >= 4.5:1 against #0D0D0F background
- Hex, HSL and OKLCH color codes`,
    createdAt: '2026-02-09T14:10:00Z',
    updatedAt: '2026-02-09T14:10:00Z',
  },
  {
    id: 'res-7',
    title: '21st.dev — The NPM for Design Engineers',
    description: 'Open-source React components crafted by leading designers and frontend engineers.',
    type: 'website',
    sourceUrl: 'https://21st.dev',
    sourceWebsiteName: '21st.dev',
    previewImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-02-10T16:00:00Z',
    updatedAt: '2026-02-10T16:00:00Z',
  },
  {
    id: 'res-8',
    title: 'SVG Curved Mesh Gradient Backgrounds',
    description: 'Procedural noise mesh generator for ambient dark mode hero section backdrops.',
    type: 'other',
    sourceUrl: 'https://meshgradient.in',
    sourceWebsiteName: 'meshgradient.in',
    previewImageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-02-12T08:30:00Z',
    updatedAt: '2026-02-12T08:30:00Z',
  },
];
