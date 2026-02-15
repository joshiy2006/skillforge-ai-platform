# SkillForge AI Platform – Requirements

## System Requirements

* Node.js >= 18.x (Recommended: 18 or 20 LTS)
* npm >= 9.x or pnpm >= 8.x
* Git (for version control)
* Modern web browser (Chrome, Edge, or Firefox)

## Tech Stack

* React 18
* TypeScript
* Vite
* Tailwind CSS
* Radix UI Components
* Three.js (3D rendering)
* React Flow (visual diagrams)
* Material UI (MUI)
* Monaco Editor

## Core Dependencies

Install automatically via package manager (from package.json):

* react
* react-dom
* vite
* @vitejs/plugin-react
* tailwindcss
* @tailwindcss/vite
* lucide-react
* mermaid
* react-router
* react-hook-form
* recharts
* three
* @react-three/fiber
* @react-three/drei
* @mui/material
* @mui/icons-material
* @emotion/react
* @emotion/styled
* @monaco-editor/react
* reactflow
* sonner
* clsx
* class-variance-authority
* tailwind-merge
* date-fns
* embla-carousel-react
* react-dnd
* react-dnd-html5-backend
* react-day-picker
* react-slick
* next-themes
* vaul
* cmdk

## Installation Steps

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd skillforge-ai-platform
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

   or (recommended if using pnpm):

   ```bash
   pnpm install
   ```

## Development Server

Run the development server:

```bash
npm run dev
```

The app will start on:
[http://localhost:5173](http://localhost:5173)

## Build for Production

```bash
npm run build
```

## Optional Tools (Recommended)

* VS Code
* ESLint & Prettier (for code formatting)
* Node Version Manager (nvm)

## Notes

* Ensure Node.js version compatibility to avoid Vite and Tailwind build issues.
* If authentication or Git issues occur during deployment, use GitHub Personal Access Token instead of password.
