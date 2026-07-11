# SADU Affiliate Creator Landing Page

Production-ready landing page for recruiting TikTok Affiliate Creators for SADU. The project is mobile-first, optimized for TikTok Ads traffic, and prepared for final asset replacement, form connection, tracking setup, and deployment.

## Project Overview

- Goal: maximize creator registrations
- Audience: mostly mobile users from TikTok Ads
- Stack: HTML5, CSS3, Vanilla JavaScript ES modules
- Status: production-ready UI and conversion flow, placeholder assets and integration hooks still need real values

## Folder Structure

```text
.
├── assets/
│   ├── fonts/
│   ├── icons/
│   │   └── favicon-placeholder.svg
│   ├── images/
│   └── videos/
├── config/
│   └── site-config.js
├── css/
│   ├── reset.css
│   ├── variables.css
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   └── responsive.css
├── js/
│   ├── app.js
│   ├── calculator.js
│   ├── config.js
│   ├── form.js
│   ├── interactions.js
│   └── utils.js
├── index.html
├── robots.txt
├── README.md
└── FINAL_REPORT.md
```

## File Guide

- `index.html`: all page content, structure, SEO tags, placeholder comments
- `config/site-config.js`: central site-level config placeholder
- `js/config.js`: runtime and integration placeholders
- `js/calculator.js`: reward and commission calculator logic
- `js/form.js`: validation and form submit flow
- `js/interactions.js`: sticky CTA, modal, ripple, progress, smooth scroll
- `css/components.css`: UI components and conversion states
- `css/layout.css`: layout, spacing, section flow
- `css/responsive.css`: all breakpoint adjustments

## Replace Assets

### Replace Logo

1. Update the `.brand-mark` block in `index.html`
2. Put the real logo in `assets/icons/` or `assets/images/`
3. Keep the link wrapper and accessible label intact

### Replace Hero Video

Search for:

```html
<!-- Replace Hero Video -->
```

Then replace the placeholder block inside the hero phone mockup with the real media.

### Replace Creator Videos

Search for:

```html
<!-- Replace Creator Video -->
```

Replace each placeholder with the real creator proof asset.

### Replace Creator Avatars

Search for:

```html
<!-- Replace Creator Avatar -->
```

Swap the avatar placeholders with real avatar images or initials blocks.

### Replace Favicon

1. Replace `assets/icons/favicon-placeholder.svg`
2. Or update the favicon path in `index.html`

## Edit Content

Most text content lives in `index.html`.

Main areas to review before launch:

- Hero headline and subtitle
- Benefit pills
- Statistics placeholders
- Social proof text
- Final CTA copy
- Form helper text

## Change Reward Milestones

Edit:

- `js/calculator.js`

Update the `BONUS_MILESTONES` array to change:

- revenue milestones
- bonus amounts
- reward labels

## Change Commission Rates

Edit:

- `index.html` for visible pricing content
- `js/calculator.js` for the actual 15% calculator logic

Current calculator commission is:

```js
const commission = revenue * 0.15;
```

## Connect The Form

The UI is ready, but no real backend is connected yet.

Files involved:

- `js/form.js`
- `js/config.js`
- `config/site-config.js`

Recommended steps:

1. Add the real endpoint in `INTEGRATION_CONFIG.form`
2. Replace the simulated timeout in `js/form.js`
3. Submit the serialized result from `getFormData(form)`
4. Keep the success modal for successful responses
5. Add real error handling for failed requests

Supported destinations:

- Google Apps Script
- Google Sheet via Apps Script
- Webhook
- CRM
- Custom API

## Add Pixel And Analytics

Prepared hooks already exist in:

- `index.html`
- `js/config.js`
- `config/site-config.js`

You can wire:

- TikTok Pixel
- Google Analytics 4
- Google Tag Manager
- Meta Pixel

Recommended steps:

1. Replace placeholder IDs in config
2. Insert production snippets in the marked `index.html` hook area
3. Add event tracking for CTA clicks and successful submit events

## SEO Setup

Already prepared:

- title
- description
- Open Graph
- Twitter Card
- canonical placeholder
- robots meta
- theme color
- favicon placeholder
- `robots.txt`

Replace before launch:

- canonical URL
- OG image
- Twitter image
- sitemap URL

## Deploy

Works as a static site on:

- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages

Deployment steps:

1. Upload the project root
2. Keep `index.html` at the root
3. Replace `https://example.com/...` placeholders
4. Update `robots.txt` sitemap URL
5. Replace all placeholder assets
6. Connect form and pixels

## Deploy Checklist

- [ ] Thay logo
- [ ] Thay favicon
- [ ] Thay Hero Video
- [ ] Thay video Creator
- [ ] Thay avatar Creator
- [ ] Thay ảnh OG
- [ ] Thay canonical URL
- [ ] Thay sitemap URL trong `robots.txt`
- [ ] Kiểm tra lại text cuối cùng
- [ ] Kết nối form thật
- [ ] Kết nối TikTok Pixel
- [ ] Kết nối GA4 hoặc GTM
- [ ] Test submit form
- [ ] Test sticky CTA
- [ ] Test responsive trên mobile

## Production Notes

- Placeholder comments are already inserted in `index.html`
- No inline CSS or inline JS is used
- JavaScript is split by responsibility
- Conversion flow is already working in demo mode
