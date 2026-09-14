# Rollan Justin Guzman — Portfolio Website

A single-page portfolio site. Plain HTML, CSS and JavaScript — no framework, no build step,
nothing to install. If you can upload files, you can publish this.

---

## What's in the folder

```
portfolio/
├── index.html              ← the whole page lives here
├── .nojekyll               ← leave this alone (see note at the bottom)
├── README.md               ← this file
└── assets/
    ├── css/style.css       ← all the styling
    ├── js/main.js          ← mobile menu, image lightbox, footer year
    ├── fonts/              ← the two typefaces, bundled so they always load
    ├── img/                ← every image on the page
    └── pdf/                ← the downloadable PDF portfolio
```

---

## Publishing it on GitHub Pages

This is the free, no-credit-card route. It takes about ten minutes the first time.

### Step 1 — Make a GitHub account

Go to **github.com** and sign up if you don't have an account. Pick your username carefully:
it becomes part of your web address.

### Step 2 — Create a repository

1. Click the **+** in the top right, then **New repository**.
2. **Repository name:** `portfolio`
3. Set it to **Public**. Pages won't work on a private repo on the free plan.
4. Do *not* tick "Add a README file" — you already have one.
5. Click **Create repository**.

### Step 3 — Upload the files

On the empty repository page, click **uploading an existing file**.

Now the part people get wrong: **drag the contents of the folder, not the folder itself.**
Open the `portfolio` folder, select `index.html`, `README.md`, `.nojekyll` and the `assets`
folder, and drag all of those in together. GitHub keeps the folder structure inside `assets`
automatically.

When the upload finishes, scroll down and click **Commit changes**.

Your repository should now show `index.html` at the top level. If you instead see a single
folder called `portfolio`, you dragged the wrong thing — delete it and try again, or skip to
Step 6 and set the source folder accordingly.

### Step 4 — Turn on GitHub Pages

1. Click **Settings** (top of the repository, not your account settings).
2. In the left sidebar, click **Pages**.
3. Under **Source**, choose **Deploy from a branch**.
4. Under **Branch**, pick **main** and the folder **/ (root)**.
5. Click **Save**.

### Step 5 — Wait, then visit your site

Give it one to three minutes. Refresh the Pages settings screen and your address appears at
the top:

```
https://YOUR-USERNAME.github.io/portfolio/
```

That's your live portfolio. Put it in your email signature, your Upwork and OnlineJobs
profiles, your LinkedIn, and your Instagram bio.

### Step 6 — Update the SEO links

Open `index.html` and find the block near the top marked `<!-- ===== SEO ... ===== -->`.
Replace `YOUR-USERNAME` in the three URLs with your actual GitHub username. This controls the
preview card that appears when someone shares your link on Facebook, LinkedIn or Messenger.

To edit a file directly on GitHub: click the file, click the pencil icon, make the change,
then click **Commit changes**. The site rebuilds itself within a minute or two.

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

Everything is written in plain language and commented. The most common edits:

**Change your contact details** — search `index.html` for `rollanguzman@gmail.com` and
`+63 928 788 1891`. They each appear in two places.

**Change the colours** — open `assets/css/style.css`. The first block is `:root`, which holds
every colour as a named value. Change `--amber` to swap the accent colour across the whole
site in one edit.

**Add a new work image** — drop the file into `assets/img/`, then copy an existing `<figure>`
block in `index.html` and point it at your new filename.

**Swap the PDF** — replace `assets/pdf/rollan-guzman-portfolio.pdf`, keeping the same filename
so the download buttons keep working.

**Preview before you publish** — double-click `index.html` on your own computer. It opens in
your browser exactly as it will appear live.

---

## A few notes

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
