# Rollan Justin Guzman — Portfolio

Plain HTML, CSS and JavaScript. No build step, no libraries, fonts bundled (Syne + Sora, OFL).
Live at **https://rollanjustinguzman.github.io/**

```
index.html            the whole page
assets/css/site.css   all styling (colours are the variables at the top)
assets/js/site.js     portal hero, card deck, reels, reveals, clock
assets/fonts/         syne.woff2, sora.woff2 + licences
assets/img/           every image (same file names as before)
assets/pdf/           downloadable portfolio
.nojekyll             tells GitHub Pages to serve files as-is
```

## Putting it live

1. In the repo `rollanjustinguzman.github.io`, delete the old files this version doesn't use:
   `assets/css/style.css`, `assets/js/main.js`, the `assets/js/vendor/` folder, and
   `assets/fonts/bricolage.woff2` + `assets/fonts/instrument.woff2`.
2. **Add file → Upload files**, drag in the *contents* of this folder (`index.html`, `README.md`,
   `.nojekyll`, `assets`). Same-named files get replaced.
3. **Commit changes.** Pages rebuilds in 1–3 minutes. Check in a private window.

Or with git: copy these files over your clone, then `git add -A && git commit -m "New portal site" && git push`.

## Videos

Reels play from Google Drive. Each reel button holds a Drive file ID (`data-id="…"`); clicking it
loads Drive's player in place. **Each file must be shared "Anyone with the link: Viewer"**, or
visitors see a sign-in box instead of the video.

To add a reel, copy one `<li class="reel">…</li>` block in `index.html` and change the `data-id`
(the part between `/d/` and `/view` in the Drive link), the thumbnail URL, the date and the caption.

## Graphics deck

Each `<figure class="card">` in `index.html` is one card. Add or remove cards freely; the counter
and dots update on their own. If you change the count, also update "Graphics, 26 pieces" and the
counts in the Clients list so the numbers agree.

## Motion

- The hero is bound to scroll position, so it reverses when you scroll up. Amounts live in
  `frame()` in `site.js` (`--open`, `--title-s`, `--track`).
- Visitors with "reduce motion" switched on get the finished page with no movement.
