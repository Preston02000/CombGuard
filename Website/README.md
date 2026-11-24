# CombGuard website

The CombGuard website: a plain static site with no build step, ready to host on GitHub Pages.

## Put it online with GitHub Pages

1. Create a repository on GitHub (for example `combguard-site`). If the site will live in your firmware repo instead, put these files in a `docs/` folder there.
2. Upload everything in this folder to the repository. In the browser, use **Add file → Upload files** and drag in all the files and folders. With git:
   ```
   git init
   git add .
   git commit -m "CombGuard website"
   git branch -M main
   git remote add origin https://github.com/YOUR-ACCOUNT/combguard-site.git
   git push -u origin main
   ```
3. In the repository, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, then the `main` branch and the `/ (root)` folder (or `/docs` if you used one). Save.
4. After a minute or two, the site is live at `https://YOUR-ACCOUNT.github.io/combguard-site/`.

Using a custom domain like `combguard.org`? Add it under **Settings → Pages → Custom domain**, then turn on **Enforce HTTPS**.

## What's where

| File or folder | What it is |
| --- | --- |
| `index.html` | Home page, including the opening scroll scene |
| `product.html` | Product page |
| `dashboard.html` | Live hive demo (example data only) |
| `mission.html`, `team.html` | Our mission and Team pages |
| `404.html` | The page people see for a broken link |
| `assets/css/site.css` | All styles. Season colors are in the `:root[data-season=...]` blocks near the top |
| `assets/js/shell.js` | Settings panel, menu, reveal animations and season effects (every page) |
| `assets/js/hero.js` | The opening scroll scene (home only) |
| `assets/js/sketches.js` | Hand-drawn sketches and the home page's interactive parts |
| `assets/js/product.js` | Product tour, hotspots and parts viewer |
| `assets/js/dashboard.js` | The live hive demo and its example data |
| `assets/js/vendor/rough.js` | rough.js 4.6.6 (MIT license), the library that draws the sketches |
| `assets/img/` | Concept renders in WebP, each with a smaller `-800` copy for phones |
| `assets/fonts/` | The site's fonts, hosted with the site |
| `assets/icons/`, `assets/og-image.jpg` | Browser icons and the preview image shown when a link is shared |

To change text, edit the HTML file for that page. The header and footer are repeated on every page, so update them in all five files.

## Things to finish

- **Join the Watch sign-up.** It isn't connected to a mailing list yet. The form tells people their email wasn't saved and points them to the survey. To connect it, set `JOIN_ENDPOINT` near the bottom of `assets/js/sketches.js` to a sign-up URL, such as a Formspree form or your own Cloudflare Worker that calls Resend. The script posts `{"email": "..."}` as JSON. Never put an API key in any file in this folder: everything here is public.
- **Link previews.** Once you know the site's address, change `content="assets/og-image.jpg"` in each page's `og:image` tag to the full address, for example `https://YOUR-ACCOUNT.github.io/combguard-site/assets/og-image.jpg`. Facebook and some apps only show a preview image when the address is complete.
- **Team photos.** The Team page shows four helmets until the team is ready to be introduced.

## Keep secrets out of this repository

Don't add `config.h`, Wi-Fi passwords, device keys or API keys here. The `.gitignore` file blocks the common ones, but check what you upload.
