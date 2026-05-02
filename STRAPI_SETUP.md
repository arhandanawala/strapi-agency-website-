# Strapi CMS Setup Guide (CMS-first)

This guide shows how to set up a Strapi-backed CMS that powers a CMS-first business website, inspired by LaunchPad and FoodAdvisor. The frontend will render content from Strapi and allow editing of theming and content blocks. You’ll be able to edit colors, headings, button labels, nav links, site logo, and all page content directly in Strapi.

Prerequisites:
- Node.js 18–22 and npm
- Basic familiarity with Strapi concepts (Single Types vs Collection Types, Components, Media Library)

1) Create Strapi project
- In a terminal, run: npx create-strapi@latest my-strapi-project
- Or use quickstart (skip prompts): npx create-strapi@latest my-strapi-project --quickstart
- When prompted, you can log in later from http://localhost:1337/admin
- Start Strapi: cd my-strapi-project; npm run develop

2) Create the CMS data model (two singletons + collections)
- Homepage (Single Type): fields for siteName, footerText, navigationLinks (repeatable NavLink component), navigationCtaText, logo, heroTitle, heroSubtitle, aboutContent, etc.
- Site Theme (Single Type): all theming tokens (primaryColor, secondaryColor, bgColor, text colors, fonts, borderColor, etc.). Add a site logo here if you want to theme the header via Strapi.
- NavLink component: create a component NavLink with fields name (text) and href (text) and external (boolean). Attach as a repeatable field on Homepage.
- Services (Collection Type): title, description, icon (string), image (Media), slug.
- Testimonials (Collection Type): name, role, company, content, image (Media), rating.
- Contact Submissions (Collection Type): name, email, message, created_at, etc. (Strapi automatically tracks createdAt)

3) Create content types (via Content-Type Builder in Strapi admin)
- Create Component NavLink: name (Text), href (Text), external (Boolean)
- Create Singleton: Homepage
  - siteName (Text)
  - footerText (Text or Rich Text)
  - navigationLinks (Repeatable NavLink component)
  - navigationCtaText (Text)
  - logo (Media)
  - heroTitle (Text)
  - heroSubtitle (Rich Text)
  - aboutContent (Rich Text)
- Create Singleton: Site Theme
  - primaryColor (Text/Color)
  - primaryDarkColor (Text/Color)
  - secondaryColor (Text/Color)
  - bgColor (Text/Color)
  - textPrimaryColor (Text/Color)
  - textSecondaryColor (Text/Color)
  - borderColor (Text/Color)
  - logo (Media)
  - fonts, and any other tokens you want (optional)
- Create Collection: Services
- Create Collection: Testimonials
- Create Collection: Contact Submissions

4) Permissions
- Public role: enable find and findOne for Services, Testimonials
- Public: enable create for Contact Submissions
- If you add a Page type, enable find/findOne for that as well

5) Connect Frontend
- Copy env template to your project and set the Strapi URL
  cp .env.example .env
  Edit .env: VITE_STRAPI_URL=http://localhost:1337
- Optional: generate an API token and set VITE_STRAPI_API_TOKEN in .env
- The frontend will fetch /api/services, /api/testimonials, and singleton endpoints (/api/homepage, /api/site-theme)
- The app will render content from Strapi and apply theme variables from Site Theme to CSS variables

6) Seed demo data (optional but handy for local demos)
- You can enter content via the Strapi Admin UI for Services and Testimonials
- For Homepage: fill in siteName, footerText, navLinks (repeatable NavLink items), logo, heroTitle, etc.
- For Site Theme: fill primaryColor, secondaryColor, bgColor, textPrimaryColor, etc.
- For Contact Submissions: you can view and delete messages in the Content Manager

7) Verify Endpoints
- http://localhost:1337/api/services
- http://localhost:1337/api/testimonials
- http://localhost:1337/api/homepage
- http://localhost:1337/api/site-theme
- http://localhost:1337/api/contact-submissions (POST submissions)

8) Frontend Notes
- The React frontend will read theme values and apply CSS variables so colors, headings, and button styles are editable from Strapi.
- All main blocks (header/logo, hero, services, testimonials, about, contact) are wired to Strapi where possible. Some content in About/Hero can be broken into smaller Strapi components later if you want finer control.
- If Strapi is unavailable, the frontend will render demo/fallback data to keep the site usable.

## Troubleshooting
- If you see 429 or rate-limiting on the Strapi API, wait a moment and retry or reduce frequent requests.
- Check Strapi admin: http://localhost:1337/admin
- Ensure CORS is configured to allow your frontend host (http://localhost:5173).

## Production Deployment

- Host Strapi behind a reverse proxy (Vercel/Netlify is fine for frontend; Strapi can run on a VM or Docker).
- Environment variables for production: VITE_STRAPI_URL and VITE_STRAPI_API_TOKEN

## Production Endpoints (example)

Examples show how frontend will pull data:
- GET /api/services
- GET /api/testimonials
- GET /api/homepage
- GET /api/site-theme
- POST /api/contact-submissions

## Next Steps

- [ ] Expand Content-Type Builder to include header/footer data
- [ ] Move static text into Strapi singletons and components
- [ ] Add CMS-driven navigation & logo editor

## Need Help?

- Strapi Documentation
- Strapi Discord Community

## Verification & Test Plan (local)
- Prerequisites: Node 18.x or 20.x installed; Strapi v5 supports Node 18-22.
- Start Strapi (CMS):
  - cd path/to/my-strapi-project
  - npm install --legacy-peer-deps
  - npm run develop
- Start frontend: npm install; npm run dev
- Verify CMS data model in Strapi Admin at http://localhost:1337/admin
- Verify endpoints:
  - GET http://localhost:1337/api/services
  - GET http://localhost:1337/api/testimonials
  - GET http://localhost:1337/api/homepage
  - GET http://localhost:1337/api/site-theme
  - POST http://localhost:1337/api/contact-submissions
- In the UI, ensure header logo, navigation links, hero, services, testimonials, and about sections render content from Strapi.
- Change theme colors in Site Theme singleton and observe live updates in the UI as CSS variables update.
- Submit a test contact form and confirm a record is created in Strapi's Contact Submissions collection.
- If CMS is unavailable, confirm the UI shows the demo/fallback data gracefully.

## Quick Start (Post-Setup)
- Ensure Node is 18.x or 20.x (as per Strapi)
- Start Strapi and frontend, then perform a round-trip test as described above
