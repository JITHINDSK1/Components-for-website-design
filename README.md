# Vault — Minimal Personal Bookmarks & Prompt Library

A clean, minimalist, single-page personal visual bookmarks and prompt gallery.

Designed to organize, search, preview, and reuse website components, UI inspiration, design references, and AI prompts with zero clutter.

---

## Overview

**Vault** is a streamlined personal web tool. It solves a straightforward problem: when discovering great UI components, design patterns, or AI prompts online, you often lose track of URLs or spend unnecessary time retrieving prompts you've previously used.

Vault provides a single visual gallery with:
- **One Clean Screen:** A visual bookmarks gallery matching modern visual bookmark interfaces.
- **Categorized Rows:** Clear sections for Components, Prompts, Websites, and Other with item counts and quick "View all" filters.
- **Visual Screenshot Cards:** Prominent 16:10 visual cards with direct hover actions (1-click prompt copy, visit original source, edit, and delete).
- **Quick-Paste Workflow:** Open the modal, paste an entire prompt or image, optionally add a source URL, and save immediately (`Ctrl+Enter` support).
- **Auto-Generated Titles:** If left blank, titles are automatically generated from the prompt's opening line or source domain.
- **Persistent Local Storage:** Resource metadata is stored in browser `localStorage` and uploaded screenshots/images are persistently stored in browser `IndexedDB`.
- **Zero Configuration:** No accounts, no logins, no subscriptions, no analytics, no external databases, and no external AI APIs required.

---

## Key Features

### 🖼️ Visual Cards Gallery
- Prominent image/screenshot previews with rounded corners and subtle dark borders (`#202024`).
- Automatic placeholder display for items without images.
- Instant 1-click **Copy Prompt** button with visual confirmation.
- Direct **Visit Source** link opening the original webpage in a new tab.
- Edit and delete actions accessible from both cards and the detail view.

### ⚡ Quick-Paste Adding Experience
- Prominent electric blue **+ Add to Library** button.
- Streamlined modal with only essential fields:
  1. **Prompt:** Multiline text area preserving complete formatting and line breaks.
  2. **Title:** Optional (auto-generated from prompt text or source domain if left blank).
  3. **Type:** Component, Prompt, Website, or Other.
  4. **Source URL:** Link to original webpage.
  5. **Image Preview:** Upload screenshot file, paste screenshot from clipboard (`Ctrl+V`), or provide an image URL.
  6. **Description:** Optional short note.
- **Keyboard Shortcut:** `Ctrl+Enter` / `Cmd+Enter` anywhere in the modal immediately saves the resource.

### 🔍 Real-Time Search & Capsule Filters
- Instant search updating as you type across titles, prompts, source URLs, and descriptions.
- Capsule filter tabs: **All saves**, **Components**, **Prompts**, **Websites**, **Other**.
- Categorized horizontal rows in the "All saves" view with clean "View all" expandable category views.

### 💾 Persistent Local Storage
- Browser-local storage ensures your saved resources remain after refreshing the page.
- Image uploads and pasted screenshots persist in `IndexedDB` (`vault_image_store`).
- Includes one-click **Reset Demo** and **Clear All** options in the compact navigation drawer.

---

## Tech Stack

- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS (Modern Theme Tokens & dark canvas)
- **Icons:** Lucide React
- **Storage:** LocalStorage (Metadata) + IndexedDB (Persistent Images/Blobs)

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open the displayed localhost URL (e.g., `http://localhost:5174/`) in your browser.

### Production Build

```bash
npm run build
```

The production assets will be built in the `dist/` directory.

---

## License

MIT License. Designed for private, personal use.
