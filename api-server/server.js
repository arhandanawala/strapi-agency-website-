import express from 'express';
import cors from 'cors';
import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'data.db');

const app = express();
app.use(cors());
app.use(express.json());

let db;

async function initDb() {
  const SQL = await initSqlJs();
  
  if (fs.existsSync(DB_PATH)) {
    db = new SQL.Database(fs.readFileSync(DB_PATH));
  } else {
    db = new SQL.Database();
    createTables();
    seedData();
    saveDb();
  }
}

function createTables() {
  db.run(`CREATE TABLE IF NOT EXISTS homepages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    site_name TEXT,
    hero_title TEXT,
    hero_highlighted_text TEXT,
    hero_subtitle TEXT,
    hero_primary_button_text TEXT,
    hero_secondary_button_text TEXT,
    hero_stats TEXT,
    services_title TEXT,
    services_subtitle TEXT,
    about_title TEXT,
    about_highlighted_text TEXT,
    about_description_one TEXT,
    about_description_two TEXT,
    about_image_url TEXT,
    about_experience_number TEXT,
    about_experience_text TEXT,
    about_features TEXT,
    testimonials_title TEXT,
    testimonials_subtitle TEXT,
    contact_title TEXT,
    contact_highlighted_text TEXT,
    contact_description TEXT,
    contact_info_items TEXT,
    created_at TEXT,
    updated_at TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT,
    slug TEXT,
    featured INTEGER DEFAULT 1,
    created_at TEXT,
    updated_at TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    role TEXT,
    company TEXT,
    content TEXT,
    rating INTEGER DEFAULT 5,
    created_at TEXT,
    updated_at TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS globals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    site_name TEXT,
    navbar_links TEXT,
    navbar_cta_text TEXT,
    navbar_cta_link TEXT,
    footer_tagline TEXT,
    footer_columns TEXT,
    footer_copyright TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    contact_address TEXT,
    created_at TEXT,
    updated_at TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS site_themes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    primary_color TEXT,
    secondary_color TEXT,
    text_primary_color TEXT,
    text_secondary_color TEXT,
    footer_background_color TEXT,
    footer_text_color TEXT,
    created_at TEXT,
    updated_at TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS contact_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    message TEXT,
    created_at TEXT
  )`);
}

function seedData() {
  const now = new Date().toISOString();

  // Seed homepage
  db.run(`INSERT INTO homepages (site_name, hero_title, hero_highlighted_text, hero_subtitle, hero_primary_button_text, hero_secondary_button_text, hero_stats, services_title, services_subtitle, about_title, about_highlighted_text, about_description_one, about_description_two, about_image_url, about_experience_number, about_experience_text, about_features, testimonials_title, testimonials_subtitle, contact_title, contact_highlighted_text, contact_description, contact_info_items, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'YourBusiness',
      'We Help You',
      'Grow Faster',
      'Empowering businesses with innovative solutions that drive results.',
      'Start Your Journey',
      'Learn More',
      JSON.stringify([
        { value: '500+', label: 'Happy Clients' },
        { value: '98%', label: 'Success Rate' },
        { value: '10+', label: 'Years Experience' }
      ]),
      'Our Services',
      'Comprehensive solutions tailored to your business needs',
      'We Help Businesses',
      'Grow & Succeed',
      "With over a decade of experience, we've helped hundreds of businesses achieve their goals.",
      "We believe in building long-term partnerships based on trust and results.",
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=700&fit=crop',
      '10+',
      'Years of Experience',
      JSON.stringify([
        { title: 'Innovative Solutions', description: 'We bring fresh ideas and modern approaches.' },
        { title: 'Expert Team', description: 'Our team has years of industry experience.' },
        { title: 'Client Focus', description: 'Your success is our top priority.' }
      ]),
      'What Our Clients Say',
      'Trusted by businesses worldwide',
      "Let's Start a",
      'Conversation',
      "Ready to transform your business? We'd love to hear from you.",
      JSON.stringify([
        { label: 'Email', value: 'hello@yourbusiness.com', icon: 'email' },
        { label: 'Phone', value: '+1 (555) 123-4567', icon: 'phone' }
      ]),
      now,
      now
    ]
  );

  // Seed services
  const services = [
    ['Strategic Consulting', 'Expert guidance to help you navigate complex business challenges and identify growth opportunities.', 'layers', 'strategic-consulting'],
    ['Brand Development', 'Create a powerful brand identity that resonates with your target audience.', 'pen', 'brand-development'],
    ['Digital Marketing', 'Data-driven marketing strategies that increase visibility and conversions.', 'card', 'digital-marketing'],
    ['Product Design', 'User-centered design solutions that create engaging experiences.', 'box', 'product-design'],
    ['Web Development', 'Custom web solutions built with modern technologies.', 'globe', 'web-development'],
    ['Analytics & Insights', 'Comprehensive data analysis for informed business decisions.', 'target', 'analytics-insights'],
  ];
  
  for (const s of services) {
    db.run(`INSERT INTO services (title, description, icon, slug, featured, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [s[0], s[1], s[2], s[3], 1, now, now]);
  }

  // Seed testimonials
  const testimonials = [
    ['Sarah Johnson', 'CEO', 'TechStart Inc.', 'Working with this team transformed our business completely. Their strategic insights helped us achieve 200% growth.', 5],
    ['Michael Chen', 'Founder', 'GrowthLabs', 'The level of professionalism exceeded expectations. They delivered exceptional results that made a real difference.', 5],
    ['Emily Rodriguez', 'Marketing Director', 'InnovateCo', 'From strategy to execution, they handled everything flawlessly. Our brand awareness increased by 300%.', 5],
  ];
  
  for (const t of testimonials) {
    db.run(`INSERT INTO testimonials (name, role, company, content, rating, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [t[0], t[1], t[2], t[3], t[4], now, now]);
  }

  // Seed globals
  db.run(`INSERT INTO globals (site_name, navbar_links, navbar_cta_text, navbar_cta_link, footer_tagline, footer_columns, footer_copyright, contact_email, contact_phone, contact_address, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'YourBusiness',
      JSON.stringify([
        { name: 'Home', href: '/' },
        { name: 'Services', href: '/services' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' }
      ]),
      'Get Started',
      '/contact',
      'Empowering businesses with innovative solutions that drive results.',
      JSON.stringify([
        { title: 'Quick Links', links: [
          { name: 'Home', href: '/' },
          { name: 'Services', href: '/services' },
          { name: 'About', href: '/about' },
          { name: 'Contact', href: '/contact' }
        ]},
        { title: 'Services', links: [
          { name: 'Consulting', href: '/services' },
          { name: 'Development', href: '/services' },
          { name: 'Marketing', href: '/services' }
        ]},
        { title: 'Contact', links: [
          { name: 'hello@yourbusiness.com', href: 'mailto:hello@yourbusiness.com' },
          { name: '+1 (555) 123-4567', href: 'tel:+15551234567' }
        ]}
      ]),
      '© 2026 YourBusiness. All rights reserved.',
      'hello@yourbusiness.com',
      '+1 (555) 123-4567',
      '123 Business Ave, Suite 100',
      now,
      now
    ]
  );

  // Seed site theme
  db.run(`INSERT INTO site_themes (primary_color, secondary_color, text_primary_color, text_secondary_color, footer_background_color, footer_text_color, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ['#6366f1', '#ec4899', '#1f2937', '#6b7280', '#111827', '#ffffff', now, now]);
}

function saveDb() {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

function parseJson(value) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function rowToObject(columns, row) {
  const obj = {};
  columns.forEach((col, i) => {
    obj[col] = parseJson(row[i]);
  });
  return obj;
}

// ============ API ROUTES ============

// Homepage - GET
app.get('/api/homepage', (req, res) => {
  try {
    const result = db.exec('SELECT * FROM homepages LIMIT 1');
    if (result[0] && result[0].values.length > 0) {
      const data = rowToObject(result[0].columns, result[0].values[0]);
      res.json({
        data: {
          id: data.id,
          attributes: {
            siteName: data.site_name,
            heroTitle: data.hero_title,
            heroHighlightedText: data.hero_highlighted_text,
            heroSubtitle: data.hero_subtitle,
            heroPrimaryButtonText: data.hero_primary_button_text,
            heroSecondaryButtonText: data.hero_secondary_button_text,
            heroStats: data.hero_stats,
            servicesTitle: data.services_title,
            servicesSubtitle: data.services_subtitle,
            aboutTitle: data.about_title,
            aboutHighlightedText: data.about_highlighted_text,
            aboutDescriptionOne: data.about_description_one,
            aboutDescriptionTwo: data.about_description_two,
            aboutImageUrl: data.about_image_url,
            aboutExperienceNumber: data.about_experience_number,
            aboutExperienceText: data.about_experience_text,
            aboutFeatures: data.about_features,
            testimonialsTitle: data.testimonials_title,
            testimonialsSubtitle: data.testimonials_subtitle,
            contactTitle: data.contact_title,
            contactHighlightedText: data.contact_highlighted_text,
            contactDescription: data.contact_description,
            contactInfoItems: data.contact_info_items,
          }
        }
      });
    } else {
      res.json({ data: null });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Homepage - PUT
app.put('/api/homepage', (req, res) => {
  try {
    const data = req.body;
    const now = new Date().toISOString();
    
    const fields = [];
    const values = [];
    
    const fieldMap = {
      siteName: 'site_name',
      heroTitle: 'hero_title',
      heroHighlightedText: 'hero_highlighted_text',
      heroSubtitle: 'hero_subtitle',
      heroPrimaryButtonText: 'hero_primary_button_text',
      heroSecondaryButtonText: 'hero_secondary_button_text',
      heroStats: 'hero_stats',
      servicesTitle: 'services_title',
      servicesSubtitle: 'services_subtitle',
      aboutTitle: 'about_title',
      aboutHighlightedText: 'about_highlighted_text',
      aboutDescriptionOne: 'about_description_one',
      aboutDescriptionTwo: 'about_description_two',
      aboutImageUrl: 'about_image_url',
      aboutExperienceNumber: 'about_experience_number',
      aboutExperienceText: 'about_experience_text',
      aboutFeatures: 'about_features',
      testimonialsTitle: 'testimonials_title',
      testimonialsSubtitle: 'testimonials_subtitle',
      contactTitle: 'contact_title',
      contactHighlightedText: 'contact_highlighted_text',
      contactDescription: 'contact_description',
      contactInfoItems: 'contact_info_items',
    };
    
    for (const [key, dbField] of Object.entries(fieldMap)) {
      if (data[key] !== undefined) {
        fields.push(`${dbField} = ?`);
        values.push(typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key]);
      }
    }
    
    if (fields.length > 0) {
      fields.push('updated_at = ?');
      values.push(now);
      db.run(`UPDATE homepages SET ${fields.join(', ')} WHERE id = 1`, values);
      saveDb();
    }
    
    const result = db.exec('SELECT * FROM homepages LIMIT 1');
    const row = rowToObject(result[0].columns, result[0].values[0]);
    res.json({ data: { id: row.id, attributes: row } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Services - GET all
app.get('/api/services', (req, res) => {
  try {
    const result = db.exec('SELECT * FROM services WHERE featured = 1 ORDER BY id');
    if (result[0]) {
      const data = result[0].values.map(row => {
        const r = rowToObject(result[0].columns, row);
        return {
          id: r.id,
          attributes: {
            title: r.title,
            description: r.description,
            icon: r.icon,
            slug: r.slug,
            featured: r.featured,
          }
        };
      });
      res.json({ data });
    } else {
      res.json({ data: [] });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Services - GET one
app.get('/api/services/:id', (req, res) => {
  try {
    const { id } = req.params;
    const result = db.exec(`SELECT * FROM services WHERE id = ${id}`);
    if (result[0] && result[0].values.length > 0) {
      const r = rowToObject(result[0].columns, result[0].values[0]);
      res.json({
        data: {
          id: r.id,
          attributes: {
            title: r.title,
            description: r.description,
            icon: r.icon,
            slug: r.slug,
            featured: r.featured,
          }
        }
      });
    } else {
      res.status(404).json({ error: 'Service not found' });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Services - PUT
app.put('/api/services/:id', (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const now = new Date().toISOString();
    
    const fields = [];
    const values = [];
    
    if (data.title !== undefined) { fields.push('title = ?'); values.push(data.title); }
    if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }
    if (data.icon !== undefined) { fields.push('icon = ?'); values.push(data.icon); }
    if (data.slug !== undefined) { fields.push('slug = ?'); values.push(data.slug); }
    if (data.featured !== undefined) { fields.push('featured = ?'); values.push(data.featured ? 1 : 0); }
    
    if (fields.length > 0) {
      fields.push('updated_at = ?');
      values.push(now);
      values.push(id);
      db.run(`UPDATE services SET ${fields.join(', ')} WHERE id = ?`, values);
      saveDb();
    }
    
    const result = db.exec(`SELECT * FROM services WHERE id = ${id}`);
    const r = rowToObject(result[0].columns, result[0].values[0]);
    res.json({ data: { id: r.id, attributes: r } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Services - POST
app.post('/api/services', (req, res) => {
  try {
    const data = req.body;
    const now = new Date().toISOString();
    db.run(`INSERT INTO services (title, description, icon, slug, featured, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [data.title, data.description, data.icon || '', data.slug || '', data.featured ? 1 : 1, now, now]);
    saveDb();
    const result = db.exec('SELECT * FROM services ORDER BY id DESC LIMIT 1');
    const r = rowToObject(result[0].columns, result[0].values[0]);
    res.status(201).json({ data: { id: r.id, attributes: r } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Services - DELETE
app.delete('/api/services/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.run(`DELETE FROM services WHERE id = ?`, [id]);
    saveDb();
    res.json({ data: { id: parseInt(id) } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Testimonials - GET all
app.get('/api/testimonials', (req, res) => {
  try {
    const result = db.exec('SELECT * FROM testimonials ORDER BY id');
    if (result[0]) {
      const data = result[0].values.map(row => {
        const r = rowToObject(result[0].columns, row);
        return {
          id: r.id,
          attributes: {
            name: r.name,
            role: r.role,
            company: r.company,
            content: r.content,
            rating: r.rating,
          }
        };
      });
      res.json({ data });
    } else {
      res.json({ data: [] });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Testimonials - POST
app.post('/api/testimonials', (req, res) => {
  try {
    const data = req.body;
    const now = new Date().toISOString();
    db.run(`INSERT INTO testimonials (name, role, company, content, rating, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [data.name, data.role, data.company, data.content, data.rating || 5, now, now]);
    saveDb();
    const result = db.exec('SELECT * FROM testimonials ORDER BY id DESC LIMIT 1');
    const r = rowToObject(result[0].columns, result[0].values[0]);
    res.status(201).json({ data: { id: r.id, attributes: r } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Testimonials - DELETE
app.delete('/api/testimonials/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.run(`DELETE FROM testimonials WHERE id = ?`, [id]);
    saveDb();
    res.json({ data: { id: parseInt(id) } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Global - GET
app.get('/api/global', (req, res) => {
  try {
    const result = db.exec('SELECT * FROM globals LIMIT 1');
    if (result[0] && result[0].values.length > 0) {
      const data = rowToObject(result[0].columns, result[0].values[0]);
      res.json({
        data: {
          id: data.id,
          attributes: {
            siteName: data.site_name,
            navbarLinks: data.navbar_links,
            navbarCtaText: data.navbar_cta_text,
            navbarCtaLink: data.navbar_cta_link,
            footerTagline: data.footer_tagline,
            footerColumns: data.footer_columns,
            footerCopyright: data.footer_copyright,
            contactEmail: data.contact_email,
            contactPhone: data.contact_phone,
            contactAddress: data.contact_address,
          }
        }
      });
    } else {
      res.json({ data: null });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Global - PUT
app.put('/api/global', (req, res) => {
  try {
    const data = req.body;
    const now = new Date().toISOString();
    
    const fieldMap = {
      siteName: 'site_name',
      navbarLinks: 'navbar_links',
      navbarCtaText: 'navbar_cta_text',
      navbarCtaLink: 'navbar_cta_link',
      footerTagline: 'footer_tagline',
      footerColumns: 'footer_columns',
      footerCopyright: 'footer_copyright',
      contactEmail: 'contact_email',
      contactPhone: 'contact_phone',
      contactAddress: 'contact_address',
    };
    
    const fields = [];
    const values = [];
    
    for (const [key, dbField] of Object.entries(fieldMap)) {
      if (data[key] !== undefined) {
        fields.push(`${dbField} = ?`);
        values.push(typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key]);
      }
    }
    
    if (fields.length > 0) {
      fields.push('updated_at = ?');
      values.push(now);
      db.run(`UPDATE globals SET ${fields.join(', ')} WHERE id = 1`, values);
      saveDb();
    }
    
    const result = db.exec('SELECT * FROM globals LIMIT 1');
    const row = rowToObject(result[0].columns, result[0].values[0]);
    res.json({ data: { id: row.id, attributes: row } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Site Theme - GET
app.get('/api/site-theme', (req, res) => {
  try {
    const result = db.exec('SELECT * FROM site_themes LIMIT 1');
    if (result[0] && result[0].values.length > 0) {
      const data = rowToObject(result[0].columns, result[0].values[0]);
      res.json({
        data: {
          id: data.id,
          attributes: {
            primaryColor: data.primary_color,
            secondaryColor: data.secondary_color,
            textPrimaryColor: data.text_primary_color,
            textSecondaryColor: data.text_secondary_color,
            footerBackgroundColor: data.footer_background_color,
            footerTextColor: data.footer_text_color,
          }
        }
      });
    } else {
      res.json({ data: null });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Site Theme - PUT
app.put('/api/site-theme', (req, res) => {
  try {
    const data = req.body;
    const now = new Date().toISOString();
    
    const fieldMap = {
      primaryColor: 'primary_color',
      secondaryColor: 'secondary_color',
      textPrimaryColor: 'text_primary_color',
      textSecondaryColor: 'text_secondary_color',
      footerBackgroundColor: 'footer_background_color',
      footerTextColor: 'footer_text_color',
    };
    
    const fields = [];
    const values = [];
    
    for (const [key, dbField] of Object.entries(fieldMap)) {
      if (data[key] !== undefined) {
        fields.push(`${dbField} = ?`);
        values.push(data[key]);
      }
    }
    
    if (fields.length > 0) {
      fields.push('updated_at = ?');
      values.push(now);
      db.run(`UPDATE site_themes SET ${fields.join(', ')} WHERE id = 1`, values);
      saveDb();
    }
    
    const result = db.exec('SELECT * FROM site_themes LIMIT 1');
    const row = rowToObject(result[0].columns, result[0].values[0]);
    res.json({ data: { id: row.id, attributes: row } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Contact Submission - POST
app.post('/api/contact-submissions', (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }
    const now = new Date().toISOString();
    db.run(`INSERT INTO contact_submissions (name, email, message, created_at) VALUES (?, ?, ?, ?)`,
      [name, email, message, now]);
    saveDb();
    const result = db.exec('SELECT * FROM contact_submissions ORDER BY id DESC LIMIT 1');
    const r = rowToObject(result[0].columns, result[0].values[0]);
    res.status(201).json({ data: { id: r.id, attributes: r } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Contact Submissions - GET all
app.get('/api/contact-submissions', (req, res) => {
  try {
    const result = db.exec('SELECT * FROM contact_submissions ORDER BY id DESC');
    if (result[0]) {
      const data = result[0].values.map(row => {
        const r = rowToObject(result[0].columns, row);
        return { id: r.id, attributes: r };
      });
      res.json({ data });
    } else {
      res.json({ data: [] });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Start server
const PORT = 1337;
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`  Business Website API`);
    console.log(`  Running at http://localhost:${PORT}`);
    console.log(`========================================\n`);
    console.log(`  Endpoints:`);
    console.log(`  - GET    /api/homepage`);
    console.log(`  - PUT    /api/homepage`);
    console.log(`  - GET    /api/services`);
    console.log(`  - GET    /api/services/:id`);
    console.log(`  - POST   /api/services`);
    console.log(`  - PUT    /api/services/:id`);
    console.log(`  - DELETE /api/services/:id`);
    console.log(`  - GET    /api/testimonials`);
    console.log(`  - POST   /api/testimonials`);
    console.log(`  - DELETE /api/testimonials/:id`);
    console.log(`  - GET    /api/global`);
    console.log(`  - PUT    /api/global`);
    console.log(`  - GET    /api/site-theme`);
    console.log(`  - PUT    /api/site-theme`);
    console.log(`  - POST   /api/contact-submissions`);
    console.log(`  - GET    /api/contact-submissions`);
    console.log(`\n========================================\n`);
  });
}).catch(console.error);