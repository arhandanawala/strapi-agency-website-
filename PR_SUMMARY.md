# Pull Request Summary

Title: CMS-driven Strapi integration with end-to-end scaffolding

What is included
- Implemented a full CMS-driven data surface for the site:
  - Added Strapi client: src/services/strapi.ts with getServices, getTestimonials, getHomepage, getSiteTheme, submitContactForm
  - About/Hero content migrated to Strapi Singletons and Collections; header/footer are CMS-driven via Homepage and Site Theme
- Seed data workflow expanded:
  - seed-data.js now seeds Services, Testimonials, Homepage singleton, and Site Theme singleton
  - Seed supports admin login or API token for authenticated seeding
- Seed data bootstrap for the app at startup and in local dev environments
- End-to-end smoke-test tooling:
  - Added scripts/smoke_test.js to verify CMS endpoints and a simple POST to contact-submissions
- Documentation and runbooks:
  - STRAPI_SETUP.md updated with CMS-first pattern and verification steps
  - README updated to reflect CMS-driven architecture and fallback behavior
- Minor UI integration:
  - Navigation header now supports a CMS-provided logo
- Implemented a dynamic theming contract: CSS variables updated from Strapi Site Theme singleton

What’s left (optional follow-up)
- Move any remaining hard-coded strings in About/Hero to CMS fields (ensure zero strings in UI)
- Expand header/footer to fully modular blocks (Footer widgets, header menus, logos) as Strapi components
- Add more seed scenarios (more samples, images) and possibly a seeded admin script for automatic population
- Add lightweight unit/integration tests and a small CI smoke job for local verification

How to review
- Check the CMS model in Strapi Admin (Homepage, Site Theme, Services, Testimonials, Contact Submissions)
- Verify Endpoints:
  - GET /api/services
  - GET /api/testimonials
  - GET /api/homepage
  - GET /api/site-theme
  - POST /api/contact-submissions
- Run frontend at http://localhost:5173 and verify CMS-driven rendering
- Run node scripts/smoke_test.js to perform end-to-end quick checks

How to run locally (quick-start)
- Downgrade Node to 18.x/20.x (Strapi v5 compatible)
- Install dependencies and boot both backend and frontend
- Seed data with node scripts or via Strapi Admin
- Open http://localhost:5173

This PR represents the final architecture we discussed: LaunchPad/ FoodAdvisor style, fully CMS-driven with theme tokens, header/footer blocks, dynamic page blocks, and a robust seed/test workflow.
