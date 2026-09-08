# Tuition O Job Media — PWA files

Upload every file below to the **root** of your GitHub repo (same repo Cloudflare
Pages builds `tuition100.pages.dev` from). No build step, no subfolders — every
file, including the icons, sits flat in the same root directory.

```
/
├── index.html            (your updated site — PWA tags + SW registration + install prompt)
├── manifest.json         (PWA identity: name, colors, icons)
├── service-worker.js     (offline caching)
├── offline.html          (shown if a page can't load and isn't cached)
├── favicon.ico
├── _headers              (tells Cloudflare Pages not to cache the SW/manifest)
├── icon-72.png
├── icon-96.png
├── icon-128.png
├── icon-144.png
├── icon-152.png
├── icon-180.png
├── icon-192.png
├── icon-384.png
├── icon-512.png
├── icon-maskable-192.png
└── icon-maskable-512.png
```

**`admin.html` is intentionally not in here** — see "Keeping the admin panel
separate" below.

## What was changed in index.html
In `<head>`:
- `<link rel="manifest" href="/manifest.json">`
- theme-color, favicon, apple-touch-icon, apple/mobile "web-app-capable" tags
- a tiny inline script at the very top that catches the browser's install
  event the instant it fires (has to run before anything else)

Before `</body>`:
- registers `/service-worker.js`
- the install-prompt modal/floating-button markup + logic (see below)

One line added inside the survey's final-submit success handler to fire the
install prompt at the right moment (see below).

Everything else in your file is untouched.

## Keeping the admin panel separate
`admin.html` isn't included in this upload on purpose — don't push it to
this repo. A few things worth knowing:

- Anyone who *does* find the URL (guessed, leaked, in browser history on a
  shared computer, etc.) can still open it — a public Cloudflare Pages repo
  has no real access control, it's just not linked from anywhere.
- Nothing in `index.html` references or links to `admin.html`, and the PWA
  manifest/service-worker no longer mention it either, so it won't show up
  in search engines, the install shortcut menu, or offline caching.
- For real protection (not just obscurity), consider hosting it as a
  **separate Cloudflare Pages project** (different subdomain, e.g.
  `admin-tuition100.pages.dev`) behind **Cloudflare Access** (free for small
  teams — email/OTP login wall in front of the whole site), or keep it in a
  **private GitHub repo** deployed as its own Pages project. Happy to help
  set either of those up if useful.

## Will the service worker update the app when I edit index.html?
Yes, automatically, no version bump needed for normal content edits.

The service worker uses a **network-first** strategy for page loads: every
time someone opens the site while online, it fetches the live `index.html`
from your server first and only falls back to the cached copy if the
network fails. So your edits go live the moment you push and the visitor
reloads — same as a normal (non-PWA) site.

The cached copy still gets refreshed in the background on every online
visit, purely so the **offline fallback** (what a visitor sees with no
internet) stays reasonably current too.

You only need to bump `CACHE_VERSION` at the top of `service-worker.js` if
you change the *service worker's own logic* (this file) or the icon
filenames — that forces old cached files to be purged. Editing
`index.html` content alone never requires it.

## The Android install prompt
What it does:
1. As soon as the page loads, a tiny script at the top of `<head>` starts
   listening for Chrome's install-eligibility signal (`beforeinstallprompt`)
   and holds onto it — Chrome only fires this once real early, so it has to
   be caught immediately, before the rest of the page even runs.
2. When a tutor finishes the **last question of the survey** (right after
   the "সম্পন্ন করুন" submit succeeds), a full-screen centered popup
   appears with:
   > ভালো ভালো টিউশন পেতে, আমাদের অ্যাপ ইনস্টল করুন
   
   and a large **"এখনই ইনস্টল করুন"** button. Tapping it triggers Chrome's
   real native install prompt (not a custom fake one — Chrome requires the
   real dialog to actually install a PWA).
3. After that first popup (whether they install, dismiss, or close it), a
   smaller floating **"📲 অ্যাপ ইনস্টল করুন"** button stays pinned to the
   bottom of the screen on every page — this one keeps reappearing on every
   visit until they actually install the app.
4. The moment installation succeeds (`appinstalled` event), both the popup
   and the floating button disappear for good — this is remembered in
   `localStorage`, so it won't nag an already-installed user again.
5. **Android only.** The whole thing is gated behind a
   `/Android/i.test(navigator.userAgent)` check. On iPhone/iPad, desktop, or
   any non-Android device, neither the text nor the button ever appears —
   iOS Safari doesn't support this install-prompt API at all, so there's
   nothing useful to show there anyway.

A couple of real-world caveats worth knowing:
- Chrome decides *if and when* `beforeinstallprompt` fires based on its own
  engagement heuristics (e.g. it may not fire on a tutor's very first-ever
  visit, or if the app was already dismissed recently in that browser). If
  it hasn't fired yet when the survey finishes, no popup/button shows on
  that page load — nothing breaks, it just quietly skips.
- If a tutor already installed via their own browser menu (not through this
  button), the `appinstalled` event still fires and the nagging stops.
- The floating button is deliberately dismissable per-view but reappears on
  the next page load until installed — that's the "keeps showing" behavior
  you asked for, without permanently trapping it open over the page content.

## After deploying
1. Push all files to GitHub → Cloudflare Pages auto-deploys.
2. Visit `https://tuition100.pages.dev` in Chrome/Edge (desktop or Android) —
   you should see an "Install app" icon in the address bar, or on mobile a
   banner/"Add to Home Screen" prompt.
3. On iOS Safari, users install via Share → "Add to Home Screen" (Apple doesn't
   show an automatic install prompt, but the icons/meta tags above make it look
   like a real app once added).
4. Test offline: load the site once, then in Chrome DevTools → Network tab,
   set "Offline" and reload. You should still see the cached page (or the
   `offline.html` fallback on a page you haven't visited yet).

## Icons
I generated a simple teal/gold "T" mark icon set since no logo file was
uploaded. Swap any `icons/icon-*.png` file for your real logo any time —
just keep the same filenames and square dimensions, and update
`manifest.json` if you change filenames.

## Updating the site later
The service worker caches `index.html`/`admin.html` for offline use but
always tries the network first, so normal edits show up on next load with no
extra steps. If you ever want to force every visitor's cached copy to be
purged immediately (e.g. after a big change), bump `CACHE_VERSION` at the top
of `service-worker.js` — that's the only "version number" this setup has.

## Note on Supabase / GA / GTM / Clarity / Chart.js / Puter
Those all load from external CDNs and were intentionally left out of the
service worker's cache list, so your data, analytics, and third-party
scripts always come fresh from the network — the offline support only
covers the app shell (the HTML/CSS/JS you wrote, plus icons).
