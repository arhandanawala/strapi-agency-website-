# Your Business Website

A modern business website built with **React + TypeScript + Vite**, featuring smooth animations powered by **GSAP** and **Framer Motion**, and ready to connect with **Strapi CMS**.

Note: This project is now CMS-driven. Almost all content (header/logo, hero, services, testimonials, about content, and contact submissions) is editable in Strapi. The frontend reads theme tokens and content from Strapi and applies them in real-time via CSS variables. If Strapi is down, the site falls back to demo data so you can continue developing.

## Features

- Smooth scroll animations and parallax effects
- Interactive navigation with mobile-responsive menu
- Animated hero section with floating shapes
- Services showcase with hover effects
- About section with image parallax
- Auto-rotating testimonials slider
- Contact form with validation
- Fully responsive design

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Animations:** GSAP + ScrollTrigger + Framer Motion
- **Styling:** CSS Variables + Modern CSS
- **CMS:** Strapi (headless CMS)
- **Icons:** Lucide (SVG)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Connecting to Strapi CMS

### 1. Set Up Strapi Backend

```bash
# Create a new Strapi project
npx create-strapi@latest my-strapi-backend

# Or use Docker
docker run -it -p 1337:1337 strapi/strapi
```

### 2. Create Content Types in Strapi Admin

Navigate to **Content-Type Builder** and create:

**Service**
- `title` (Text)
- `description` (Rich Text)
- `icon` (Enumeration: values like `layers`, `pen-tool`, `credit-card`, `box`, `globe`, `target`)
- `slug` (UID, attached to title)
- `featured` (Boolean)

**Testimonial**
- `name` (Text)
- `role` (Text)
- `company` (Text)
- `content` (Rich Text)
- `image` (Media, Single image)
- `rating` (Number, Integer 1-5)

**Team Member**
- `name` (Text)
- `position` (Text)
- `bio` (Rich Text)
- `image` (Media, Single image)
- `linkedin` (Text)
- `twitter` (Text)

**Page (for dynamic pages)**
- `title` (Text)
- `slug` (UID)
- `content` (Dynamic Zone or Rich Text)
- `seo` (Component with metaTitle, metaDescription)

**Contact Submission (for form submissions)**
- `name` (Text)
- `email` (Email)
- `message` (Long Text)

### 3. Configure Permissions

Go to **Settings > Users & Permissions Plugin > Roles > Public** and enable:

- `service` - find, findOne
- `testimonial` - find, findOne
- `team-member` - find, findOne
- `page` - find, findOne
- `contact-submission` - create

### 4. Connect Frontend to Strapi

```bash
# Copy environment file
cp .env.example .env

# Edit .env with your Strapi URL
VITE_STRAPI_URL=http://localhost:1337
# Optional: Add API token for authenticated requests
VITE_STRAPI_API_TOKEN=your_token_here
```

### 5. Using the Strapi Service

```typescript
import { getServices, getTestimonials, submitContactForm } from './services/strapi'

// Fetch services from Strapi
const services = await getServices()

// Fetch testimonials
const testimonials = await getTestimonials()

// Submit contact form
await submitContactForm({
  name: 'John Doe',
  email: 'john@example.com',
  message: 'Hello!'
})
```

## Project Structure

```
src/
├── components/
│   ├── Navigation.tsx      # Animated nav with mobile menu
│   ├── Hero.tsx            # Hero with floating shapes (GSAP)
│   ├── Services.tsx        # Services grid with scroll animations
│   ├── About.tsx           # About with parallax image
│   ├── Testimonials.tsx    # Auto-slider with Framer Motion
│   └── Contact.tsx         # Contact form with validation
├── services/
│   └── strapi.ts           # Strapi API client
├── App.tsx
└── main.tsx
```

## Customization

### Colors
Edit CSS variables in `App.css`:

```css
:root {
  --primary-color: #6366f1;
  --secondary-color: #ec4899;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
}
```

### Animations

- **GSAP** animations are in component `useEffect` hooks
- **Framer Motion** uses `motion.*` components with whileHover, whileTap
- **ScrollTrigger** handles scroll-based reveals

## Deployment

### Frontend (Vercel/Netlify)

```bash
npm run build
# Deploy dist/ folder
```

### Backend (Strapi)

Options:
- **Strapi Cloud:** One-click deploy
- **Railway/Render:** Docker deployment
- **Self-hosted:** VPS with PM2

## License

MIT
