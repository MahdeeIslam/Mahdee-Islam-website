# mahdeeislam.com

Personal website of Mahdee Islam, built with [Astro](https://astro.build) and hosted on GitHub Pages.

## Run it on your computer

```bash
npm install
npm run dev
```

Then open http://localhost:4321. Changes to files show up straight away.

## Where things live

| What | File |
| --- | --- |
| Links, Substack address, hidden posts, topic tags | `src/config.ts` |
| Home page text (about, work, research, sport) | `src/pages/index.astro` |
| The four-language "word" explorer | `src/components/WordExplorer.astro` |
| Global Peace Summit panel and video | `src/components/SummitVideo.astro` |
| Colours and fonts | `src/styles/global.css` |
| Portrait | `src/assets/mahdee-islam.jpg` |

## Articles

Articles come from two places and are merged, newest first:

1. **Substack.** Set `SUBSTACK_URL` in `src/config.ts`. Every public post is pulled in when the site builds. The site rebuilds every day, so new posts appear within 24 hours (or straight away if you run the workflow by hand from the Actions tab). Each imported page tells search engines the Substack post is the original, so the two never compete.
2. **Written on the site.** Copy `src/content/articles/_example.md`, drop the underscore from the name, and write in Markdown.

To leave a Substack post off the site, add its slug to `HIDDEN_SUBSTACK_POSTS`. To add topic filters, use `SUBSTACK_TAGS`.

## Publishing

Pushing to `main` builds and publishes the site automatically.

One-time setup:

0. Move the workflow file into place (GitHub only runs workflows from `.github/workflows`). In Terminal, inside this folder:
   ```bash
   mkdir -p .github/workflows && mv github-workflow/deploy.yml .github/workflows/deploy.yml && rmdir github-workflow
   ```
1. On GitHub, open the repository's **Settings → Pages** and set **Source** to **GitHub Actions**.
2. In the same page, enter `mahdeeislam.com` as the custom domain and tick **Enforce HTTPS** once it is available.
3. At your domain registrar, add these DNS records:
   - Four `A` records for `@` pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - A `CNAME` record for `www` pointing to `mahdeeislam.github.io`
4. Add the site to [Google Search Console](https://search.google.com/search-console), submit `https://mahdeeislam.com/sitemap-index.xml`, and request indexing for the home page.
