# Rollan Justin Guzman — Portfolio Website

A single-page portfolio. Plain HTML, CSS and JavaScript, no build step, nothing to install.
Animation is done with GSAP (ScrollTrigger + SplitText) and Lenis smooth scrolling. Both libraries
are bundled in `assets/js/vendor/`, so the site never depends on an outside CDN.

Live at **https://rollanjustinguzman.github.io/**

---

## What's in the folder

```
rollanjustinguzman.github.io/
├── index.html              ← the whole page lives here
├── .nojekyll               ← leave this alone (see notes at the bottom)
├── README.md               ← this file
└── assets/
    ├── css/style.css       ← all the styling
    ├── js/main.js          ← every animation and interaction, commented
    ├── js/vendor/          ← GSAP, ScrollTrigger, SplitText, Lenis (don't edit)
    ├── fonts/              ← Bricolage Grotesque + Instrument Sans, bundled
    ├── img/                ← every image on the page
    └── pdf/                ← the downloadable PDF portfolio
```

---

## Updating the live site with this version

Your repository `rollanjustinguzman.github.io` already exists and Pages is already on, so this is
a file swap.

1. **Delete the two old files this version no longer uses:** `assets/css/hover-motion.css` and
   `assets/js/reveal.js`. (Open each file on GitHub → the **⋯** menu → **Delete file** → commit.)
   Leaving them does no harm, but it keeps the repo tidy.
2. On the repository's main page, click **Add file → Upload files**.
3. Open this folder on your computer, select `index.html`, `README.md`, `.nojekyll` and the
   `assets` folder, and drag them all in together. Drag the **contents**, not the folder itself.
   Files with the same name get replaced.
4. Click **Commit changes**. The site rebuilds in one to three minutes.
5. Open the site in a private window (so you don't see a cached copy) and check it.

The SEO links near the top of `index.html` are already set to your address.

---

## What moves, and how to adjust it

All of it lives in `assets/js/main.js`, in numbered, commented blocks.

- **Preloader** (block 11): the name rises, a counter runs to 100, then the screen wipes up and your
  name builds in letter by letter. Repeat visits in the same browser session get a shorter version.
- **Smooth scroll** (block 2): Lenis. `lerp: 0.09` controls the glide; lower is floatier.
- **Custom cursor** (block 6): a dot that grows into "View" over images and "Open" over the work list.
  Only on computers with a mouse; phones keep normal touch.
- **Work list preview** (block 8): hover a project name and its cover follows the mouse.
- **Scroll effects** (block 12): headings rise line by line, the big statement lights up word by word,
  images open like a shutter, the review gallery scrolls sideways on desktop (swipe on phones), and
  the image strip under the hero speeds up with your scrolling.

**Animations always run**, including on computers with Windows "Animation effects" or macOS
"Reduce motion" switched on. If the scripts ever fail to load, the page shows everything unanimated
rather than getting stuck.

---

## Optional: your own domain name

A domain like `rollanguzman.com` costs roughly $10–15 a year and looks noticeably more
professional to overseas clients than a `github.io` address.

1. Buy the domain (Namecheap, Porkbun and Cloudflare are all reasonable).
2. In your domain registrar's DNS settings, add four **A records** for `@` pointing to:
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
3. Add one **CNAME record** for `www` pointing to `YOUR-USERNAME.github.io`
4. Back in GitHub: **Settings → Pages → Custom domain**, type your domain, click **Save**.
5. Once the check passes, tick **Enforce HTTPS**.

DNS changes can take anywhere from a few minutes to a day to take effect.

---

## Making changes

**Contact details** — search `index.html` for `rollanguzman@gmail.com` (it appears in the mobile menu
and the contact section) and `639287881891` / `+63 928 788 1891`.

**Colours** — the first block in `assets/css/style.css` is `:root`. The site is deliberately black and
white (`--black`, `--white`, `--grey`) so the work provides the colour.

**Tools list** — in the About section of `index.html`, tools are grouped (Editing, Design, AI, CRM and
automation, Social, Workspace). Add or remove a `<li>`, and update the count in
`Tools and platforms (25)`.

**Add a work image** — drop the file into `assets/img/`, copy an existing `<figure>` block inside the
case you want and point it at the new filename. Clicking it opens the lightbox automatically.

**Swap the PDF** — replace `assets/pdf/rollan-guzman-portfolio.pdf`, keeping the filename.

**Preview before you publish** — double-click `index.html`. Everything works locally, including the
animations. (The Drive video players need an internet connection.)

---

## A few notes

**Unused images.** `d13.jpg`, `d15.jpg` and `photo.jpg` are in `assets/img/` but not on the page.
Keep them for later or delete them.

**The `.nojekyll` file.** GitHub Pages runs a tool called Jekyll by default, which ignores
folders starting with an underscore and can cause odd missing-file problems. This empty file
switches that off. It's invisible in some file managers — on Windows, enable "Hidden items" in
File Explorer's View tab, and on Mac press `Cmd + Shift + .` so you can see it when you upload.

**Video — read this before you publish.** The video section embeds five reels straight from
Google Drive. Drive embeds only play for visitors if the *files themselves* are shared publicly.
In Drive, open each video, click **Share**, and set **General access** to
**Anyone with the link — Viewer**. Setting the folder alone is not always enough; check each file.
Then open your live site in a private browser window and confirm the players work. If a visitor
sees a "request access" screen, the sharing is still restricted.

Two caveats worth knowing. Drive is not a video host — it will be slower than YouTube and
Google can throttle a file that suddenly gets a lot of views. And these clips were made for a
client, so make sure you have their permission before putting them on a public page.

**Swapping a video to YouTube** (recommended once you have time). Upload the clip as *Unlisted*,
then in `index.html` replace the whole `src` of that iframe:

```
https://drive.google.com/file/d/FILE_ID/preview     ← replace this
https://www.youtube.com/embed/YOUTUBE_ID            ← with this
```

Nothing else changes. The frame, the caption and the layout all stay the same.

**Images.** They're already compressed for the web. If you add more, keep each one under about
400 KB or the page will feel slow on mobile data, which is how most people will open it.

**Analytics.** If you want to know how many people visit, Cloudflare Web Analytics is free and
doesn't require a cookie banner. Paste its snippet just before the closing `</body>` tag.
