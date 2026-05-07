import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Works on GitHub Pages project sites like:
// https://USERNAME.github.io/REPOSITORY-NAME/
// Using './' makes built asset paths relative to index.html.
export default defineConfig({
  plugins: [react()],
  base: './',
});
