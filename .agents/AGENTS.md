# Project Guidelines & Rules (.agents/AGENTS.md)

## ⚡ Package Manager & CLI
- **Always use `bun` and `bunx`**: Never use `npm` or `npx` for commands, builds, package installations, or script executions in this repository.
  - Examples: `bun run dev`, `bun run build`, `bun add <package>`, `bunx cloudflared`.

## 🚀 Share to X (Twitter) Workflow
- **No Native OS Share Sheets**: Do NOT invoke `navigator.share()` or `navigator.canShare()` for Share to X.
- **Clipboard-Only Image Transfer**: Use `navigator.clipboard.write([new ClipboardItem({ 'image/png': blobPromise })])` synchronously on user click.
- **No Automatic File Downloads**: Clicking "SHARE TO X" must NOT trigger an auto-download of the image file.
- **Direct Intent Navigation**: Open `https://x.com/intent/post?text=...` in a new tab with clean, compact URL query parameters.
- **Guidance Modal**: Present the neo-brutalist 3-step paste guidance modal prompting `Ctrl + V` (or `Cmd + V`).

## 📸 Canvas Photo Upload & Interaction
- **Direct Canvas Drop Zone**: The canvas container handles both click-to-upload and file drag-and-drop (`onDragOver`, `onDragLeave`, `onDrop`).
- **No Floating Overlay Blocks**: Do NOT render separate semi-transparent HTML overlay blocks over the canvas placeholder. Canvas placeholder text (`CLICK OR DROP PHOTO`) must be rendered directly on the 2D canvas context (`FormatAOverlay.js`, `FormatBBadge.js`).
- **Drag Feedback**: Display glowing neon drag feedback ONLY when a file is physically dragged over the canvas from desktop.

## 🌐 Vercel Edge Serverless OG Image Generation
- Serverless edge functions reside in `api/og.jsx` using `@vercel/og` (`ImageResponse`).
- URLs shared to X include encoded state query parameters (`?format=A&name=...&title=...`).
