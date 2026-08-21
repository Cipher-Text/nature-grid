import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produce a self-contained server bundle for Docker.
  output: 'standalone',

  // Point file tracing at the monorepo root so standalone output includes
  // workspace package files (@nature-grid/shared, @nature-grid/contracts).
  outputFileTracingRoot: path.join(__dirname, '../../'),

  // Compile workspace TypeScript packages — they ship source, not pre-built JS.
  transpilePackages: ['@nature-grid/shared', '@nature-grid/contracts'],
};

export default nextConfig;
