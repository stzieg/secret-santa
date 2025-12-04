# Secret Santa Generator

A React-based web application for organizing Secret Santa gift exchanges with relationship constraints and a festive reveal screen.

## Features

- Add and manage participants
- Define relationship constraints (e.g., couples who shouldn't be paired)
- Generate valid Secret Santa assignments
- Animated reveal screen with custom music and background
- Local storage persistence
- Fully tested with property-based testing

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Run tests:
   ```bash
   npm test
   ```

## Customizing the Reveal Screen

You can add your own Christmas music and animated background to the reveal screen!

### Step 1: Add Your Media Files

Place your files in the `public/media/` directory:
- **Audio file**: `christmas-song.mp3` (or .wav, .ogg)
- **GIF/Image file**: `christmas-animation.gif` (or .jpg, .png)

### Step 2: Update the Configuration

Edit `src/config/revealScreenMedia.ts` and change the filenames:

```typescript
export const REVEAL_SCREEN_MEDIA = {
  audio: {
    filename: 'your-song.mp3',  // Change this to your audio filename
    volume: 0.3,                 // Adjust volume (0.0 to 1.0)
    loop: true,                  // Set to false to play once
  },
  background: {
    filename: 'your-animation.gif',  // Change this to your image filename
    opacity: 0.3,                     // Adjust opacity (0.0 to 1.0)
  },
};
```

### Step 3: Refresh and Enjoy!

Reload your browser to see your custom media in action.

See `public/media/README.md` for more details and tips.

---

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
