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

## Deployment (Render + Supabase) — Full Step-by-Step

Everything is deployed on **Render** — Strapi backend as a web service, frontend as a static site — with **Supabase PostgreSQL** as the database.

---

### Prerequisites

| Item | Where to get it |
|------|----------------|
| GitHub account | [github.com](https://github.com) |
| Render account | [render.com](https://render.com) (sign up with GitHub) |
| Supabase account | [supabase.com](https://supabase.com) |

Your code is already pushed to: `https://github.com/arhandanawala/strapi-agency-website-`

---

### Step 1: Create Supabase Database

1. Go to [supabase.com](https://supabase.com) and **log in**
2. Click **"New project"**
3. Fill in the form:
   - **Name:** `strapi-agency-db`
   - **Database Password:** Click **"Generate"** and **copy it somewhere safe** (you'll need it)
   - **Region:** Choose **US East (N. Virginia)** — closest to Render's Oregon servers = faster
4. Click **"Create new project"** and wait ~2 minutes for provisioning

5. Once created, go to **Project Settings** (gear icon) → **Database** in left sidebar

6. Scroll down to **"Connection string"** section:
   - Make sure **Mode: URI** is selected
   - Copy the string that looks like:
     ```
     postgresql://postgres:YOUR_PASSWORD@db.xxxxxxxxxxxx.supabase.co:6543/postgres
     ```
   - **IMPORTANT:** Replace `[YOUR-PASSWORD]` with the password you saved in step 3
   - Note the port is `6543` (Supabase's connection pooler), not `5432`
   - Keep this tab open — you'll paste this into Render next

---

### Step 2: Deploy on Render

#### 2a. Connect your GitHub repo

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click the **"New +"** button → **"Blueprint"**
3. If prompted, **connect your GitHub account** and give Render permission
4. Find and select your repo: **`arhandanawala/strapi-agency-website-`**

#### 2b. Configure environment variables

Render will auto-detect `render.yaml` at the root. **Before clicking Apply**, you need to fill in the secrets:

1. You'll see a screen titled **"Blueprint"** with two services listed:
   - `strapi-agency-website-api` (Node web service)
   - `strapi-agency-website-frontend` (Static site)

2. **Click on each service** to expand and set env vars

3. For `strapi-agency-website-api`, set these environment variables:

   | Variable | Value |
   |----------|-------|
   | `DATABASE_URL` | Paste your Supabase connection string from Step 1 |
   | `APP_KEYS` | `key1,key2,key3,key4` (4 random strings separated by commas) |
   | `ADMIN_JWT_SECRET` | Any random string (e.g. `aB3dEfGhIjK1LmNoPqRsTuVwXyZ`) |
   | `API_TOKEN_SALT` | Any random string (e.g. `mN4oPqRsTuVwXyZaB2cDeFgHiJkL`) |
   | `TRANSFER_TOKEN_SALT` | Any random string (e.g. `pQ7rStUvWxYzAbCdEfGhIjKlMnOp`) |
   | `JWT_SECRET` | Any random string (e.g. `xY9zAbCdEfGhIjKlMnOpQrStUvWx`) |

   **Quick tip for random strings:** Type random keyboard mash — they just need to be unique and secret.

4. For `strapi-agency-website-api`, set `VITE_STRAPI_URL`:
   - Leave this **BLANK** for now — you'll set it after the backend deploys

5. For `strapi-agency-website-frontend`:
   - `VITE_STRAPI_URL` → leave **BLANK** for now

#### 2c. Deploy

1. Click **"Apply"**
2. Render will start deploying both services:
   - First it creates a **PostgreSQL database** (from the database block in render.yaml — wait, actually in this setup we use Supabase, so no Render DB is created)
   - Then it deploys the **Strapi API** (takes 3-5 minutes)
   - Then it deploys the **frontend static site** (takes 1-2 minutes)
3. Watch the logs — if you see errors, check:
   - `DATABASE_URL` is correct
   - `APP_KEYS` has 4 comma-separated values
   - Node version is correct (the yaml sets it to 20.18.0)

4. Once done, you'll see URLs like:
   - API: `https://strapi-agency-website-api.onrender.com`
   - Frontend: `https://strapi-agency-website-frontend.onrender.com`

---

### Step 3: Configure Strapi Admin

1. Open your API URL: `https://strapi-agency-website-api.onrender.com/admin`
2. Create the **first admin account** (email + password)
3. Once logged in, set up **Public API permissions**:

   a. Go to **Settings** (bottom left gear icon)
   b. Scroll to **"Users & Permissions Plugin"** → click **"Roles"**
   c. Click **"Public"**
   d. Under **Permissions**, enable these checkboxes:

   | Content Type | Permissions to enable |
   |-------------|----------------------|
   | Contact-submission | ☑ `create` |
   | Footer | ☑ `find` |
   | Global | ☑ `find` |
   | Header | ☑ `find` |
   | Homepage | ☑ `find` |
   | Page | ☑ `find` + ☑ `findone` |
   | Service | ☑ `find` + ☑ `findone` |
   | Site-setting | ☑ `find` |
   | Site-theme | ☑ `find` |
   | Testimonial | ☑ `find` + ☑ `findone` |

   e. Click **"Save"** at the top right

4. **Optional but recommended — create an API Token:**
   a. Go to **Settings > API Tokens**
   b. Click **"Create new API Token"**
   c. Name it `frontend-token`, token type: **Custom**, duration: **Unlimited**
   d. Select these permissions:
      - `find` and `findone` for Service, Testimonial, Page, Site-setting, Site-theme
      - `create` for Contact-submission
   e. Click **"Save"** — **copy the token** (it won't be shown again)

---

### Step 4: Update Frontend to Point to Your Live API

The frontend needs to know where your Strapi API lives:

1. Go back to [dashboard.render.com](https://dashboard.render.com)
2. Click on **`strapi-agency-website-frontend`**
3. Go to **Environment** tab
4. Click **"Add Environment Variable"**
5. Set:
   - **Key:** `VITE_STRAPI_URL`
   - **Value:** `https://strapi-agency-website-api.onrender.com` (your actual API URL)
6. Click **"Save Changes"**
7. Go to **Manual Deploy** → **"Deploy latest commit"** (takes ~1 minute)

---

### Step 5: Add Content in Strapi

Now add real content to your site:

1. Go to `https://strapi-agency-website-api.onrender.com/admin`
2. Under **Content Manager**, fill in:
   - **Homepage** — site name, hero title, about content
   - **Site Theme** — colors for your brand
   - **Site Setting** — logo, navigation links, social links
   - **Header** — header configuration
   - **Footer** — footer columns and links
   - **Services** — add your services
   - **Testimonials** — add client testimonials
   - **Pages** — create additional pages (About, Contact, etc.)

3. Refresh your frontend URL — the site will now show your content!

---

### Step 6: Custom Domain (Optional)

#### Frontend custom domain:
1. On Render, go to `strapi-agency-website-frontend` → **Settings** → **Custom Domain**
2. Add your domain (e.g. `www.yourbusiness.com`)
3. Update your DNS provider with the CNAME record Render gives you

#### Strapi Admin custom domain:
1. On Render, go to `strapi-agency-website-api` → **Settings** → **Custom Domain**
2. Add your domain (e.g. `cms.yourbusiness.com`)
3. Update DNS with CNAME record

**Then update CORS** in `strapi-cms/config/middlewares.js` to include your custom domain and re-deploy.

---

### Important Notes

- **Free tier limits:** Render free web services spin down after 15 min of inactivity. The first request after idle takes ~30 seconds to wake up
- **Media uploads:** Strapi stores uploaded images on Render's local disk, which gets wiped on each deploy. For production, set up a cloud storage provider (AWS S3, Cloudinary) via Strapi's upload provider plugin
- **Environment variables:** Never commit `.env` files to Git (already in `.gitignore`)
- **Database backups:** Supabase free tier includes daily backups — you can restore from Supabase dashboard

---

### Your URLs After Deployment

```
Strapi Admin:  https://strapi-agency-website-api.onrender.com/admin
API Endpoint:  https://strapi-agency-website-api.onrender.com
Frontend:      https://strapi-agency-website-frontend.onrender.com
```

### License

MIT
