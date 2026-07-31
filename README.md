# anubhav-khanna.com — portfolio

Static site. No build step, no framework, no dependencies, no backend.
Just HTML + one CSS file + one JS file. Deploys to GitHub Pages as-is.

## Structure

```
index.html                                  homepage
campaigns/index.html                        campaign list
campaigns/<slug>/index.html                 case studies (3)
404.html
assets/css/site.css                         all styling + design tokens
assets/js/site.js                           theme toggle, tabs, reveal, form
assets/img/                                 put your images here
CNAME                                       your custom domain (one line)
```

## Things to fill in

| What | Where |
|---|---|
| `REPLACE-WITH-YOUR-DOMAIN` (4 places) | `index.html` head, `robots.txt`, `sitemap.xml` |
| Resume PDF | save as `assets/Anubhav-Khanna-CV.pdf` |
| Your photo (contact section) | save as `assets/img/anubhav.jpg` |
| Anime portrait | save as `assets/img/anime-portrait.jpg` |
| Campaign images | `assets/img/baazi-jeet-ki.png`, `seawings-1.webp`, `seawings-2.webp`, `seawings-3.webp`, `lagi-shart.jpeg` |
| 2 testimonial names/titles | search `TODO` in `index.html` |
| LinkedIn URL | search `linkedin.com/in/anubhavkhanna` — correct it if the handle differs |

Images currently fall back to the Base44 CDN if the local file is absent,
so the site works immediately. Dropping the local files in makes you
independent of Base44 — do it before you delete that project.

## Editing content

Everything is plain HTML. To change a stat, a bullet, a testimonial:
open the file, find the text, change it. No build, no rebuild.

Colours and fonts live in the `:root` block at the top of `site.css`.
Change `--accent` in one place to re-skin the whole site.

## Contact form

Composes an email in the visitor's mail app via `mailto:` — zero cost,
zero third parties. To collect submissions server-side instead, sign up
for Formspree's free tier and change the form to
`<form action="https://formspree.io/f/YOUR_ID" method="POST">`,
then delete the contact-form block at the bottom of `site.js`.

## Notes

- Campaign pages carry `noindex, nofollow` and are excluded in `robots.txt`,
  matching the original "private portfolio" behaviour. Remove those two lines
  if you want them found in search.
- `.nojekyll` stops GitHub from running Jekyll over the files.
- Light/dark toggle is real and persists in `localStorage`.
- Fonts load from Google Fonts. To swap the display face, change
  `Plus Jakarta Sans` in the `<link>` tags and in `site.css`.
