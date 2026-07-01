# Padwal & Associates — Website

A single-page website for Padwal & Associates, Advocates & Cyber Law Consultants.
Built with plain HTML/CSS/JS (no build step) — deploys straight to GitHub Pages.

## Structure

```
index.html        Page content
css/style.css      All styling (design tokens at the top of the file)
js/script.js       3D hero scene (Three.js), tilt-card effects, nav, form
```

## Deploy to GitHub Pages

1. Create a new GitHub repository (e.g. `padwal-associates`).
2. Upload these files to the repo root, keeping the folder structure.
3. In the repo: **Settings → Pages → Source** → select the `main` branch and `/ (root)` folder → **Save**.
4. Your site will be live at `https://<your-username>.github.io/padwal-associates/` in a minute or two.
5. Optional: add a custom domain under **Settings → Pages → Custom domain** if you have one (e.g. `padwalassociates.com`).

## Things you'll likely want to personalize

- **Contact form**: currently opens the visitor's email app pre-filled to `advshantanupadwal@gmail.com` (no backend needed). If you'd prefer it to submit silently, connect it to a service like Formspree or Getform and swap the `submit` handler in `js/script.js`.
- **Phone / email / hours**: search `js/script.js` and `index.html` for `+919921744777` and `advshantanupadwal@gmail.com` to update.
- **WhatsApp link**: `https://wa.me/919921744777` in the Contact section — update the number if needed.
- **Office address**: not currently listed — add it to the Contact section if you'd like it public.
- **Colors/fonts**: all defined as CSS variables at the top of `css/style.css` under `:root`.

## Notes

- The hero's 3D shield/lock scene is rendered with Three.js (loaded from a CDN) — no build tools or extra installs required.
- The site respects `prefers-reduced-motion` and is responsive down to mobile.
- No tracking, analytics, or external form services are wired in by default — add your own if needed.
