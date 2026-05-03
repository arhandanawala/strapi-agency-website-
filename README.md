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

## Deployment (Render + Supabase)

Everything is deployed on **Render** — Strapi backend as a web service, frontend as a static site — with **Supabase PostgreSQL** as the database.

### Prerequisites

- GitHub repo pushed: `https://github.com/arhandanawala/strapi-agency-website-`
- Supabase account (free tier)

### Step 1: Create Supabase Database

1. Go to [supabase.com](https://supabase.com) → **New project**
2. Fill in:
   - **Name:** `strapi-agency-db`
   - **Database Password:** Generate and **save it somewhere**
   - **Region:** `US East (N. Virginia)` (closest to Render Oregon)
3. Wait for the database to provision (~2 min)
4. Go to **Project Settings > Database > Connection string (URI)**:
   - Copy the URI: `postgresql://postgres:YOUR_PASSWORD@db.xxxxxxxxxxxx.supabase.co:6543/postgres`
   - Replace `[YOUR-PASSWORD]` with your actual password
   - Note: port is `6543` (Supabase's connection pooler), not `5432`

### Step 2: Deploy Strapi Backend on Render

1. Go to [render.com](https://render.com) → **New + > Blueprint**
2. Connect your GitHub repo
3. Render will auto-detect `render.yaml` at the root
4. Before deploying, click **Edit** and set these **Environment Variables** (marked `sync: false`):
   - `DATABASE_URL` → your Supabase connection string
   - `APP_KEYS` → generate 4 random strings separated by commas (e.g. `abc123,def456,ghi789,jkl012`)
   - `ADMIN_JWT_SECRET` → random string
   - `API_TOKEN_SALT` → random string
   - `TRANSFER_TOKEN_SALT` → random string
   - `JWT_SECRET` → random string
   - `VITE_STRAPI_URL` → leave blank for now, update after deploy
5. Click **Apply** → Render deploys both:
   - `strapi-agency-website-api` (Strapi web service)
   - `strapi-agency-website-frontend` (Static site)

### Step 3: Configure Strapi Admin

1. Once deployed, go to `https://strapi-agency-website-api.onrender.com/admin`
2. Create your admin account
3. Set up **Public permissions**:
   - Settings → Users & Permissions Plugin → Roles → Public
   - Enable: `find` and `findOne` for Service, Testimonial, Page, Site-setting, Site-theme, Homepage, Header, Footer, Global
   - Enable: `create` for Contact-submission
4. Optional: Generate an **API Token** at Settings → API Tokens

### Step 4: Update Frontend Env & Re-deploy

1. On Render dashboard, go to `strapi-agency-website-frontend`
2. Add environment variable: `VITE_STRAPI_URL = https://strapi-agency-website-api.onrender.com`
3. Go to **Manual Deploy > Deploy latest commit**

### Step 5: Update CORS (if needed)

The `render.yaml` deploys the frontend at a Render URL like `https://strapi-agency-website-frontend.onrender.com`.  
The `middlewares.js` already allows `*.vercel.app` — after deployment, you may want to add your actual Render frontend URL and any custom domain.

Your Strapi Admin will be at: `https://strapi-agency-website-api.onrender.com/admin`  
Your frontend live at: `https://strapi-agency-website-frontend.onrender.com`

## License

MIT
