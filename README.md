# Sachin Rana

Personal profile of Sachin Rana: agentic AI, cloud and infrastructure, industrial IoT and digital twins.

Live at **https://sachinrana2025.github.io**

## Stack

Next.js 15 (static export), React 19, TypeScript, Tailwind CSS v4. Served by GitHub Pages from the `gh-pages` branch, published with `npm run deploy:pages`. `.github/workflows/pages.yml` can take over once GitHub Actions is available on the account.

## Develop

```bash
npm ci
npm run dev          # http://localhost:3000
npm run build        # static export to out/, then the leak check
npm run check:repo   # scan every tracked file before pushing
npm run deploy:pages # build, check and publish out/ to gh-pages
```
