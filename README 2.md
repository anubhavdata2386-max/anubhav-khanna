# anubhavkhanna.com — portfolio

Static site. No build step, no framework, no dependencies, no backend.
HTML, one CSS file, one JS file. GitHub Pages serves it from `main` as-is.

## Structure

```
index.html                          homepage, all sections
campaigns/index.html                campaign summary page
campaign-case-studies/              long-form case studies
404.html
robots.txt
sitemap.xml
CNAME                               custom domain — managed by GitHub
assets/css/site.css                 all styling and design tokens
assets/js/config.js                 API keys for the contact form
assets/js/site.js                   theme toggle, tabs, reveal, form, effects
assets/img/                         images, all WebP
.github/workflows/                  scheduled keep-alive ping
```

## Editing content

Everything is plain HTML. To change a stat, a bullet or a testimonial: open the
file, find the text, change it. There is no build step to run.

Colours, fonts and spacing live in the `:root` block at the top of `site.css`.
Changing `--accent` there re-skins the whole site.

After any upload, hard-refresh with **Cmd+Shift+R**. A normal refresh serves the
cached CSS and JS and makes a successful change look broken.

## Search indexing

Most of the site is indexed normally. **A few pages deliberately carry a
`noindex` meta tag so they stay out of search results — do not remove those
tags.** Each one has a comment above it explaining why.

`robots.txt` allows crawling on purpose: a `noindex` tag only works if a crawler
is allowed to read the page it sits in. Blocking a folder there would prevent
that and achieve the opposite of what it looks like. It does block the AI
training crawlers that honour robots.txt.

## Contact form

Each submission posts to two places in parallel — a Supabase table and
Web3Forms, which sends an email notification. It succeeds if either one
resolves, and falls back to opening the visitor's mail app if both fail, so a
message is never silently lost. Spam handling is a honeypot field plus length
limits in the database.

Keys live in `assets/js/config.js`. They are public by design: this is a static
site, so there is nowhere private to put them. Security is enforced by Supabase
row-level security, which allows inserts and nothing else — not by hiding keys.

`.github/workflows/` holds a scheduled job that pings Supabase twice a week.
Free Supabase projects pause after a week of no traffic. A `401` in that
workflow's log is the correct result.

## Things not to do

- Don't overwrite `assets/js/config.js` — it holds the API keys.
- Don't upload `CNAME`. GitHub manages it.
- Don't re-indent the workflow YAML. It is whitespace-sensitive.
- Don't remove a `noindex` tag without knowing why it's there.
- When uploading through the web interface, drag **folders**, not their contents,
  or the paths get flattened. Check the commit preview shows full paths.
