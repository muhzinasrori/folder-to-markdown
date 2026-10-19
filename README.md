# 📁 folder-to-markdown

A web-based tool built with Next.js that allows you to upload a local project folder and instantly compile all of its source code files into a single, clean Markdown (.md) document. 

Perfect for generating code dumps, documentation backups, or feeding your entire codebase into AI prompts.

## ✨ Features
- **Full Folder Upload:** Recursively reads all files in a directory directly from your browser.
- **Smart Filtering:** Automatically ignores non-essential folders like `node_modules`, `.next`, and lock files.
- **Syntax Highlighting:** Automatically detects file extensions (like `.js`, `.tsx`, `.py`) for proper code formatting.
- **Privacy First:** 100% client-side processing. Your code never leaves your computer.

## 🛠️ Tech Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS

## 🚀 Getting Started

First, clone the repository and install dependencies:

```bash
git https://github.com/muhzinasrori/folder-to-markdown.git
cd folder-to-markdown
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.