# anubhavkhanna.com — portfolio

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


## Current state (31 Jul 2026)

- Live at `anubhavkhanna.com`, DNS at GoDaddy, hosted on GitHub Pages
- **Every page carries `noindex, nofollow`** — the site will not appear in search
  results. Remove those meta tags from all 6 HTML files to make it findable.
- `robots.txt` deliberately *allows* crawling so bots can read the noindex tag,
  and blocks the AI training crawlers that honour robots.txt.
- Campaign images are local WebP. No Base44 dependency except the anime portrait,
  which still falls back to their CDN — save it as `assets/img/anime-portrait.jpg`
  to cut the last tie.

## Still to add

- `assets/img/anubhav.jpg` — contact-section photo (block hides itself if absent)
- `assets/img/anime-portrait.jpg` — currently loading from Base44
- Two testimonial attributions: search `TODO` in `index.html`


## Anonymisation (31 Jul 2026)

The homepage carries **no employer brand names and no gaming/betting terminology**.
Employers appear as descriptors ("Global Consumer Entertainment Brand"), and
category jargon was translated to plain commercial language:

| Was | Now |
|---|---|
| Real Money Gaming / iGaming / RMG | Regulated Consumer Digital / Consumer Entertainment |
| FTD, first-time depositor | first-time paying customer |
| NDP, new depositing player | new paying customer |
| NGR | net revenue |
| player retention | customer retention |
| named brand taglines | "flagship Hindi-language tagline" |

Pluto World is the one name kept — it is Anubhav's own venture.

### The campaigns folder

`/campaigns/` still contains the fully named case studies, including creative with
Parimatch and Fun88 logos burned into the images. Those pages are:

- **unlinked** — no navigation or footer link points to them
- **noindex, nofollow** — excluded from search
- reachable only by typing or being sent the URL

They are the strongest proof material on the site, which is why they were kept
rather than deleted. To remove them completely, delete the `campaigns` folder
from the repository.
