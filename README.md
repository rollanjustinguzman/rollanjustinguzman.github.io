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

The Video section has two groups, **Organic** (`#organic`) and **AI generated** (`#ai`). Every
video plays from Google Drive: each button holds a Drive file ID (`data-id="…"`), and clicking it
loads Drive's player in place.

**Each file must be shared "Anyone with the link: Viewer"**, or visitors get a sign-in box.

To add a video, copy a `<li class="reel feature">…</li>` block into the right group, then change
the ID (it appears twice, in `data-id` and the thumbnail URL), the title, the caption and the file
name. AI cards carry `<span class="tag tag-ai">AI generated</span>`; organic ones carry
`<span class="tag">Organic</span>`. Update the counts in "Video, 16 pieces" and the two group
buttons to match.

## Graphics deck

Each `<figure class="card">` in `index.html` is one card. Add or remove cards freely; the counter
and dots update on their own. If you change the count, also update "Graphics, 26 pieces" and the
counts in the Clients list so the numbers agree.

## Motion

- The hero is bound to scroll position, so it reverses when you scroll up. Amounts live in
  `frame()` in `site.js` (`--open`, `--title-s`, `--track`).
- Visitors with "reduce motion" switched on get the finished page with no movement.
