# vault. — Personal Design & Prompt Library

A private, dark-themed personal library to organize, search, preview, and reuse website components, UI inspiration, design references, and reusable AI prompts.

Inspired by the visual experience and discovery architecture of 21st.dev.

---

## 1. Project Introduction

**vault.** is a personal web application designed for developers, UI/UX engineers, and AI designers who constantly discover high-quality web components, design references, and system prompts across the web.

### The Problem It Solves
When browsing platforms like 21st.dev, Aceternity UI, GitHub, Dribbble, or Twitter/X, you frequently find impressive UI components or effective AI prompts. Over time:
- URLs get lost across disorganized browser bookmarks.
- Prompt text has to be recovered by revisiting external websites repeatedly.
- Screenshots and notes are scattered across various note-taking tools.
- Finding a previously used prompt or component takes unnecessary time.

### The Solution
**vault.** provides a single, local-first repository to:
- Save and categorize components, prompts, website references, animations, templates, and screenshots.
- Store full, multiline reusable prompts with instant 1-click clipboard copying.
- Retain the original website URLs and source platform names.
- Attach custom implementation notes, tags, and thematic collections.
- Instantly locate any saved resource with global fuzzy search (`Ctrl+K` / `⌘K`).

**vault.** is intentionally built as an account-free, privacy-preserving tool. There are no logins, subscriptions, external AI API keys, or databases required. All data resides in your browser's local storage with full JSON export and import capabilities.

---

## 2. Feature Overview

### 🏛️ Discovery Dashboard (Home)
- **Recently Saved:** Responsive grid displaying the newest additions to your library with category badges, source domain indicators, and quick favorite toggles.
- **Top Saved & Favorites:** Quick access to frequently referenced assets and starred components.
- **Your Collections:** Thematic folder cards highlighting resource counts and accent colors.
- **Recently Added Prompts:** Direct cards showing the actual prompt preview text, word count, and 1-click copy button.
- **Continue Exploring:** Recent item history for rapid access.

### 🗂️ All Saved Library Browser
- **Grid and List Views:** Switch seamlessly between visual cards and compact list rows.
- **Full-Text Search:** Instant live filtering across resource titles, descriptions, prompt contents, source URLs, tags, and personal notes.
- **Category & Type Filters:** Filter by UI Components, AI Prompts, Website References, Templates, Animations, Screenshots, or Other.
- **Collections & Tags Filter:** Filter directly by custom collections or specific hashtag taxonomies.
- **Sorting Options:** Sort by Recently Added, Recently Updated, Alphabetical (A–Z), or Most Used.
- **Active Filter Counter & Reset:** Real-time result counter with a one-click reset button.
- **Context Actions:** Open details, edit, copy prompt, visit original URL in a new tab, star as favorite, or delete.

### ⚡ AI Prompt Library
- **Dedicated Prompt Experience:** Purpose-built view optimized for finding and utilizing long prompts.
- **Readable Monospaced Blocks:** Inspect formatted prompts with word counts without layout truncation.
- **One-Click Raw Copy:** Copy raw prompts to clipboard with confetti feedback and toast alerts.
- **Copy with Context:** Export prompt prepended with source title and origin URL headers.
- **Usage Tracker & Mark as Used:** Tracks usage frequency and last-used dates.

### 📁 Custom Collections Management
- Create, customize, and edit collections with custom titles, descriptions, accent colors, and icons.
- Delete collections safely: deleting a collection removes the association from resources without deleting the resources themselves.
- Resources can belong to multiple collections simultaneously.

### 🏷️ Case-Insensitive Tag Explorer
- Assign unlimited tags to resources.
- Normalized lower-case handling prevents accidental duplicate tags (e.g. `Tailwind` vs `tailwind`).
- Explore all resources grouped under any specific tag with one click.

### 🔍 Command Palette (`Ctrl+K` / `⌘K`)
- Global keyboard-accessible overlay accessible from anywhere in the app.
- Fuzzy searches resources and collections simultaneously.
- Keyboard navigation (Arrow keys `↑`/`↓` and `Enter` to select, `Esc` to close).

### 💾 Backup, Export & Import
- **JSON Export:** Download your entire library, collections, and settings as a clean JSON backup file.
- **JSON Import with Validation:** Upload a `.json` file or paste JSON text. Choose between:
  - **Merge:** Adds new resources while keeping existing records intact.
  - **Replace:** Overwrites current library with the imported backup.
- **Restore Demo Data:** Reset to 16+ curated sample components and prompts anytime.
- **Wipe Library:** Permanently clear local storage with safety confirmation.

---

## 3. Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) version 18.0.0 or higher.
- `npm` (version 9 or higher).

### Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/JITHINDSK1/Components-for-website-design.git
   cd Components-for-website-design
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to the printed local address (typically `http://localhost:5173` or `http://localhost:5174`).

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview the production build:**
   ```bash
   npm run preview
   ```

---

## 4. How to Use the Application

### Adding a Resource Manually
1. Click the **"Add to library"** button in the sidebar or header.
2. Select the resource category (**UI Component**, **AI Prompt**, **Website Ref**, **Template**, **Animation**, **Screenshot**, or **Other**).
3. Enter the title (required) and optional source URL (e.g. `https://21st.dev/r/aceternity/bento-grid`).
4. Type or select suggested preview image URLs.
5. Add relevant tags by typing a tag name and pressing `Enter`.
6. Assign the resource to one or more collections.
7. Click **"Save to Library"** or **"Save & Add Another"**.

### Saving Prompts Quickly
1. In the **"Add to library"** modal, select the **"Paste Prompt"** tab.
2. Click **"Paste Clipboard"** or paste your prompt into the multiline editor.
3. Vault automatically sets the type to AI Prompt, calculates the word count, and drafts a title from the first line.
4. Click **"Save to Library"**.

### Copying Prompts with 1-Click
- On any prompt card in the Home or Prompts page, click the **"Copy"** button for immediate clipboard capture.
- Open the prompt in the Detail Modal and click **"Copy with Context"** to generate comment headers containing the original title and URL.

### Managing Collections
1. Click **Collections** in the sidebar.
2. Click **"New Collection"** to open the creator dialog.
3. Pick a name, description, accent color, and icon.
4. Click on any collection card to view its resources.

### Backing Up and Restoring Data
1. Navigate to **Settings & Data** from the bottom of the sidebar.
2. Click **"Export Library as JSON"** to download your backup.
3. To restore or transfer data to a new device, click **"Import JSON File..."**, choose **Merge** or **Replace**, and confirm.

---

## 5. Data Storage and Privacy

- **Local Storage:** All resources, collections, favorites, and notes are stored client-side in the browser via `window.localStorage`.
- **Persistence:** Saved items survive page refreshes and browser restarts.
- **No Remote Telemetry or Tracking:** No accounts, user tracking, or backend database servers are contacted.
- **Portability:** Use the **Export Library as JSON** tool to create periodic backups or transfer data across machines.
- **Storage Limits:** Modern browsers allocate 5MB to 10MB for `localStorage`, which can store thousands of text prompts, metadata records, and image URLs.

---

## 6. Technology Stack & Project Structure

### Technology Stack
- **Framework:** [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict typing)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Micro-Interactions:** [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Fonts:** Inter & JetBrains Mono (Google Fonts)

### Project Structure
```
d:/TEMPLATES WEBSTIE/
├── index.html                   # HTML entry point with dark styling and Google Fonts
├── vite.config.ts               # Vite configuration with Tailwind CSS v4 & path aliases
├── tsconfig.json                # TypeScript project configuration
├── tsconfig.app.json            # Application TypeScript configuration
├── package.json                 # Project dependencies and npm scripts
└── src/
    ├── main.tsx                 # React DOM mount point
    ├── App.tsx                  # Core application shell, routing, modal orchestration
    ├── index.css                # Tailwind CSS v4 design tokens and sleek dark theme
    ├── types/
    │   └── resource.ts          # Resource, Collection, and ViewMode type contracts
    ├── data/
    │   └── demo-resources.ts    # 16+ curated initial sample components and AI prompts
    ├── lib/
    │   ├── storage.ts           # Centralized localStorage persistence and JSON export/import
    │   ├── search.ts            # Filter, sort, and search engine
    │   └── clipboard.ts         # Clipboard helpers and confetti micro-interactions
    ├── components/
    │   ├── layout/
    │   │   ├── Sidebar.tsx      # Collapsible dark sidebar with navigation and storage stats
    │   │   ├── Header.tsx       # Sticky top navigation bar with search trigger and CTAs
    │   │   └── Toast.tsx        # Toast notification provider and floating alert system
    │   ├── library/
    │   │   ├── ResourceCard.tsx # 21st.dev inspired card with grid/list rendering
    │   │   ├── FilterBar.tsx    # Filter bar with search, categories, collections, and views
    │   │   ├── ResourceDetailModal.tsx # Full detail modal with prompt code viewer
    │   │   ├── AddResourceModal.tsx    # Add & edit modal with quick-paste tab
    │   │   └── DeleteConfirmModal.tsx  # Deletion confirmation modal
    │   ├── collections/
    │   │   └── CollectionModal.tsx     # Collection creation and color picker modal
    │   └── search/
    │       └── CommandPalette.tsx      # Global search modal (Ctrl+K / ⌘K)
    └── pages/
        ├── HomePage.tsx         # Dashboard with Sections A through E
        ├── AllSavedPage.tsx     # Comprehensive library browser
        ├── PromptsPage.tsx      # Dedicated AI prompt library
        ├── CollectionsPage.tsx  # Collections management and drill-down views
        ├── TagsPage.tsx         # Tag explorer and taxonomy clustering
        └── SettingsPage.tsx     # Storage analytics, JSON export/import, and danger zone
```

---

## 7. Keyboard Shortcuts & Tips

| Shortcut | Action | Description |
| :--- | :--- | :--- |
| `Ctrl + K` / `⌘K` | **Command Palette** | Opens global search overlay from anywhere |
| `Esc` | **Close Overlays** | Closes any open modal, dialog, or search overlay |
| `↑` / `↓` | **Navigate Search** | Move through Command Palette search results |
| `Enter` | **Select Result** | Opens the selected resource or collection |
| `Quick Paste` | **Prompt Shortcut** | Quickly pastes clipboard contents into a new prompt |

---

## 8. Known Limitations & Troubleshooting

- **Local-Only Scope:** Because Vault operates without a backend database, resources saved in one browser profile will not automatically synchronize to other devices without exporting and importing the JSON file.
- **Port In Use During Development:** If port `5173` is occupied by another application, Vite automatically binds to `5174`. Check the terminal output when running `npm run dev`.
- **External Image Hotlinking:** If an external preview image link expires or blocks cross-origin requests, Vault displays a polished fallback icon placeholder.

---

## 9. Development & Contribution Workflow

To run the application locally and contribute:
1. Ensure `node -v` is `>= 18`.
2. Run `npm run dev` to start the development server with HMR.
3. Validate changes with `npm run build` to ensure TypeScript types and bundle steps pass cleanly.
4. Keep all direct `localStorage` calls centralized in `src/lib/storage.ts` to maintain state consistency across views.

---

## 10. Roadmap

Planned future enhancements:
- [ ] Browser extension to clip web components and prompts directly from any webpage.
- [ ] Direct export of components into clean Tailwind CSS sandbox files.
- [ ] End-to-end encrypted peer-to-peer device sync option.

---

## License

MIT License. Free for personal and commercial creative workflows.
