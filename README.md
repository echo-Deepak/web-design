# Convene – Event Management Website

A responsive event discovery and registration website built with **HTML5, CSS3 and vanilla JavaScript** (no frameworks).

**Live demo:** _add your Vercel / Netlify / GitHub Pages link here_

## Features
- Hero section with a live countdown to the next event
- Event cards with date, venue, image, description and seats left
- Search by name, venue or topic, plus category filter chips
- Event details dialog with its own countdown timer
- Registration form (name, email, phone, event) with JavaScript validation
  - Name: letters only, at least 3 characters
  - Email: standard email pattern
  - Phone: 10-digit Indian mobile number (optional +91)
  - Duplicate registration and sold-out checks
- Confirmation message with a reference ID
- **Bonus:** dark/light mode (remembers choice), countdown timers, animations, Local Storage registrations with a "My registrations" list and cancel option

## Project structure
```
index.html   page structure and semantic markup
style.css    design tokens, layout (Grid/Flexbox), themes, responsive rules
script.js    event data, rendering, filtering, validation, Local Storage
```

## How it works
- Events live in an array in `script.js`. Dates are set relative to today so the demo always shows upcoming events.
- `render()` rebuilds the cards from the current search text and category.
- Registrations are stored in `localStorage` under the key `regs`. Seats left are calculated from them.
- Colours are CSS variables; the dark theme overrides them via `data-theme="dark"` on `<html>`.
- Responsive: CSS Grid `auto-fill` for cards, and a media query at 800px for the hero and navigation.
- Accessibility: semantic HTML, labelled inputs, keyboard-friendly `<dialog>`, visible focus, reduced-motion support.

## Run locally
Open `index.html` in a browser, or run `npx serve .`

## Deploy
- **GitHub Pages:** push to GitHub, then Settings → Pages → deploy from `main` branch, root folder.
- **Netlify / Vercel:** import the repository; no build command is needed.

## Git workflow
```
git init
git add .
git commit -m "Initial commit: Convene event website"
git branch -M main
git remote add origin https://github.com/<your-username>/convene.git
git push -u origin main
```

## Possible improvements
Backend for real registrations, email confirmations, real event images, calendar export.
