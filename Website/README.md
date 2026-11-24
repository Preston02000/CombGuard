# CombGuard website

The CombGuard website: a plain static site with no build step, hosted on Cloudflare Pages at https://combguard.com.

## How it goes online

This folder is the `Website` folder of the CombGuard repository. Cloudflare Pages watches the repository and publishes this folder to https://combguard.com every time something changes on `main`. There's no build step.

Cloudflare Pages settings (Workers & Pages → your project → Settings → Build):
- Production branch: `main`
- Build command: leave empty
- Build output directory: `Website`

Cloudflare serves `product.html` at `combguard.com/product`, so the clean addresses are what you should share. `_headers` adds a few security headers and lets browsers keep the fonts cached.

If the domain ever changes, find and replace `https://combguard.com/` in every page, `sitemap.xml` and `robots.txt`.

## What's where

| File or folder | What it is |
| --- | --- |
| `index.html` | Home page, including the opening scroll scene |
| `product.html` | Product page |
| `demo.html` | Live hive demo (example data only) |
| `dashboard.html`, `assets/site.css`, `assets/site.js` | The real sign-in dashboard that talks to `api.combguard.com`. It is separate from the new design, so don't delete these |
| `_redirects` | Sends the old `/about`, `/gen1` and `/gen2` addresses to the new pages |
| `mission.html`, `team.html` | Our mission and Team pages |
| `404.html` | The page people see for a broken link |
| `assets/cg.css` | All styles. Season colors are in the `:root[data-season=...]` blocks near the top |
| `assets/shell.js` | Settings panel, menu, reveal animations and season effects (every page) |
| `assets/hero.js` | The opening scroll scene (home only) |
| `assets/sketches.js` | Hand-drawn sketches and the home page's interactive parts |
| `assets/product.js` | Product tour, hotspots and parts viewer |
| `assets/dashboard.js` | The live hive demo and its example data |
| `assets/rough.js` | rough.js 4.6.6 (MIT license), the library that draws the sketches |
| `assets/` | Concept renders in WebP, each with a smaller `-800` copy for phones |
| `assets/` | The site's fonts, hosted with the site |
| `assets/`, `assets/og-image.jpg` | Browser icons and the preview image shown when a link is shared |

To change text, edit the HTML file for that page. The header and footer are repeated on every page, so update them in all five files.

## Things to finish

- **Join the Watch sign-up.** It isn't connected to a mailing list yet. The form tells people their email wasn't saved and points them to the survey. To connect it, set `JOIN_ENDPOINT` near the bottom of `assets/sketches.js` to a sign-up URL, such as a Formspree form or your own Cloudflare Worker that calls Resend. The script posts `{"email": "..."}` as JSON. Never put an API key in any file in this folder: everything here is public.
- **Team photos.** The Team page shows four helmets until the team is ready to be introduced.

## Keep secrets out of this repository

Don't add `config.h`, Wi-Fi passwords, device keys or API keys here. The `.gitignore` file blocks the common ones, but check what you upload.
