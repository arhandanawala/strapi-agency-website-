# Business Website - Startup Guide

## Quick Start (Windows)

Run these commands in separate terminals:

### Terminal 1 - Strapi (CMS)
```bash
cd C:\Users\irsha\business-website\my-strapi-project
set PATH=C:\Users\irsha\node-v20.18.0-win-x64\node-v20.18.0-win-x64;%PATH%
node node_modules/@strapi/strapi/bin/strapi.js develop
```

### Terminal 2 - Frontend
```bash
cd C:\Users\irsha\business-website
npm run dev
```

## URLs
- **Strapi Admin**: http://localhost:1337/admin
- **Frontend**: http://localhost:5173

## API Endpoints (Public)
- GET `/api/services` - Services list
- GET `/api/testimonials` - Testimonials list
- GET `/api/homepage` - Homepage content (singleton)
- GET `/api/site-theme` - Site theme colors (singleton)
- POST `/api/contact-submissions` - Submit contact form

## Content Types
1. **Service** - Services offered (title, description, icon, slug, featured)
2. **Testimonial** - Client testimonials (name, role, company, content, rating, image)
3. **Homepage** - All homepage content (single type)
4. **Site Theme** - Color/theme settings (single type)
5. **Contact Submission** - Form submissions (collection)

## Troubleshooting

### Port already in use
```bash
# Kill processes on port 1337
netstat -ano | findstr :1337
taskkill /PID <PID> /F
```

### Restart cleanly
```bash
# In Strapi folder
rd /s /q node_modules\.cache
rd /s /q dist
node node_modules/@strapi/strapi/bin/strapi.js develop
```

## Seed Data
Seed data is automatically created on first Strapi boot via `src/index.js` bootstrap.

## Customizing Content
1. Go to http://localhost:1337/admin
2. Create an admin user (first time)
3. Edit Content Types:
   - Single Types → Homepage (edit all sections)
   - Single Types → Site Theme (edit colors)
   - Collection Types → Services (add/edit services)
   - Collection Types → Testimonials (add/edit reviews)

## Files Reference
- `src/services/strapi.ts` - API client
- `src/components/` - UI components (Hero, Services, About, Testimonials, Contact, Navigation)
- `src/content/siteDefaults.ts` - Fallback data when CMS unavailable
- `my-strapi-project/src/api/` - CMS content type definitions