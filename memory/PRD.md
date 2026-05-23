# Mayur Abrasives Industrial Website - PRD

## Original Problem Statement
Design and develop a premium, modern, conversion-focused industrial website for an abrasives manufacturing brand named "Mayur" (also known as Mayur Plus / Mayur Pro). The website must feel like a global industrial brand such as Bosch, Makita, or Dewalt — clean, bold, powerful, and trustworthy.

## User Personas
1. **Industrial Buyers**: B2B customers from construction, fabrication, automotive, and metalworking industries
2. **Potential Dealers**: Business owners looking to become Mayur dealers/distributors
3. **Existing Dealers**: Current dealers checking product catalog and specifications
4. **Admin Users**: Company staff managing products, inquiries, and dealer applications

## Core Requirements (Static)
- Premium industrial design with Deep Green (#0F3D2E) and Vibrant Orange (#FF6A00)
- Hero section with video background (Sora 2 integration)
- Product catalog with filters (category, size, grit)
- Dealer application system with WhatsApp redirect
- Contact/inquiry system with WhatsApp redirect
- Admin panel for full management
- Mobile-first responsive design
- SEO-friendly structure

## What's Been Implemented (v1.0 - March 29, 2026)

### Frontend Pages
- [x] Homepage with hero section, product categories, features, testimonials, CTA
- [x] About page with company story, mission/vision, milestones
- [x] Products page with sidebar filters and product grid
- [x] Product detail page with specifications and inquiry button
- [x] Dealer application page with form and benefits
- [x] Applications page showing industrial use cases
- [x] Catalog page for downloadable PDFs
- [x] Contact page with form, map, and WhatsApp integration
- [x] Admin login page
- [x] Admin dashboard with stats
- [x] Admin products CRUD
- [x] Admin dealer applications management
- [x] Admin inquiries management
- [x] Admin settings (WhatsApp number, company info, video generation)

### Backend APIs
- [x] JWT Authentication for admin
- [x] Products CRUD with filtering
- [x] Categories listing
- [x] Dealer applications CRUD
- [x] Inquiries CRUD
- [x] Settings management
- [x] Sora 2 video generation endpoint
- [x] Stats endpoint for dashboard

### Integrations
- [x] Sora 2 Video Generation (configured, ready to use)
- [x] WhatsApp redirect for all forms
- [x] Google Maps embed

## What's Been Implemented (v1.5 - Feb, 2026 - CMS / Page Management)

### CMS Backend
- [x] New `pages` collection with 7 seeded pages (home, about, contact, privacy, terms, dealer, footer)
- [x] Page document schema: title, enabled, sections[], content_html, seo, meta
- [x] Section schema: key, enabled, heading, subheading, description (HTML), button_text, button_link, image_url, desktop_banner, mobile_banner, meta
- [x] SEO per page: meta_title, meta_description, keywords, og_image
- [x] Endpoints: `GET /api/pages`, `GET /api/pages/{key}`, `PUT /api/pages/{key}` (admin, whitelist-protected, upserts)

### CMS Admin UI
- [x] New sidebar entry "Pages (CMS)" → `/admin/pages` lists all 7 pages
- [x] `/admin/pages/{key}` opens generic page editor with:
  - Page title + enabled toggle
  - Section editors with rich text editor (react-quill-new), images (URL or 5MB upload), button text + link, per-section visibility toggle
  - About/home section has stat1/stat2 value+label custom meta fields
  - SEO card (meta_title, meta_description, keywords, og_image)
  - Long-form content editor for Privacy / Terms / About
  - Footer editor with company description, copyright, dynamic quick_links repeater, 6 social media URL fields
- [x] Save → public site refetches CMS context automatically (no manual refresh needed)

### Public Site (Phase 1 wired)
- [x] HomePage reads CMS — section headings/subheadings/buttons + visibility toggles per section (hero, about, new_products, featured_products, categories, testimonials, cta)
- [x] HomePage about section uses CMS description (rich HTML) + stat1/stat2 values+labels
- [x] Footer reads CMS — company description, quick links list, social media URLs (all 6 networks), copyright text
- [x] `/privacy` and `/terms` routes render CMS content via new `StaticContentPage`
- [x] Document title set from page.seo.meta_title

### Two Small Fixes
- [x] Removed "Admin Login" link from footer bottom bar
- [x] Removed "Applications" link from navbar

### Deferred to Phase 2
- [ ] Wire About / Contact / Dealer public pages to CMS (currently CMS rows exist but pages use hardcoded layouts)

## What's Been Implemented (v1.4 - Feb, 2026 - Logo + Clean Hero)

### Brand Logo
- [x] Real Mayur Plus logo rendered in Navbar (data-testid=navbar-logo-img) — replaces "M" placeholder
- [x] Same logo in Footer with white-tile background for dark-footer legibility
- [x] Admin Settings → Brand Logo card with preview, URL input, file upload (5MB cap), clear button
- [x] Logo URL stored in settings.logo_url; backfilled on startup with user's uploaded Mayur Plus PNG
- [x] If logo_url is empty, the navbar/footer fall back to the "M MAYUR ABRASIVES" placeholder

### Hero Slider Cleanup
- [x] Removed ALL overlay text (PREMIUM ABRASIVE SOLUTIONS / POWER THAT SHAPES METAL / PRECISION TRUST / description / Explore + Become Dealer buttons)
- [x] Hero is now a pure image carousel — only image, prev/next arrows, and dot indicators
- [x] Hero height responsive: 60vh mobile / 70vh tablet / full screen on desktop
- [x] HeroSlider gained a `showOverlay` prop so other pages can reuse it with text overlays if needed
- [x] Navbar background is always solid white (no more transparent-on-homepage state since the dark gradient is gone)

### Backend
- [x] Fixed iter5 carry-over: PUT /api/settings now filters out fully-empty slides server-side
- [x] `logo_url` field added to SettingsUpdate model, GET response, and seed defaults

## What's Been Implemented (v1.3 - Feb, 2026 - Category & Subcategory Navigation)

### Public Product Catalog Drill-Down
- [x] Reseeded with user's example hierarchy: **Abrasives** (Cut Off Wheels, Grinding Wheels, Flap Discs, Non-Woven Wheels, Buffing & Polishing) + Saw Blades (TCT, Diamond, Marble & Granite) + Power Tools Accessories (Drill Bits, Wire Brushes)
- [x] `/products` page completely refactored — Category quick-pick strip at top (when no category selected)
- [x] Clicking a category: title + breadcrumb update, category strip hides, **Subcategory chip strip** appears
- [x] Clicking a subcategory chip: deep-links to `/products?category=X&subcategory=Y`, filters products, updates breadcrumb (All Products → Abrasives → Cut Off Wheels)
- [x] Sidebar shows expandable category tree with nested subcategory radio-style buttons
- [x] All filtering is URL-driven (deep-linkable, shareable)
- [x] Product cards now show category + subcategory + size tags + "NEW" badge
- [x] Mobile flyout filter mirrors the desktop tree

### Backend
- [x] `/api/products` supports `category` + `subcategory` filters (was already supported, now fully utilized)
- [x] Sample products updated with correct category/subcategory slugs

## What's Been Implemented (v1.2 - Feb, 2026 - Categories Module + Footer Redesign)

### Homepage
- [x] Removed "Industries We Serve" section entirely
- [x] Categories section now reads from DB-backed `/api/categories` (admin-managed)

### Footer Redesign
- [x] New 4-column layout: Contact Info | Map (iframe) | For Query (inquiry form) | Follow Us
- [x] Working inquiry form (POSTs to `/api/inquiries`)
- [x] 6 social icons (Facebook, Instagram, LinkedIn, YouTube, X/Twitter, WhatsApp)
- [x] Verified: no App Store / Play Store / mobile app download links anywhere

### Admin Categories Module (NEW)
- [x] `/admin/categories` page with grid of category cards (image, name, slug, subcategory chips)
- [x] Create, edit, delete categories — auto-slugify from name, configurable slug, image_url, description, sort_order
- [x] Manage subcategories per category (add/remove chips inside the modal)
- [x] Backend: `GET/POST/PUT/DELETE /api/categories`, `POST/DELETE /api/categories/{id}/subcategories[/{sub_slug}]`
- [x] 6 default categories seeded on first boot
- [x] Slug uniqueness enforced (400 on duplicate); duplicate subcategory slug also blocked

### Admin Products (UPDATED)
- [x] Category dropdown now populated dynamically from `/api/categories`
- [x] New Subcategory dropdown appears when selected category has subcategories

## What's Been Implemented (v1.1 - Feb, 2026 - Hero Slider & Homepage Restructure)

### Hero Image Slider (replaces hero video)
- [x] Responsive image carousel on homepage with up to 5 images
- [x] Auto-advance with configurable interval (default 3s, range 2–15s)
- [x] Prev / Next manual navigation arrows
- [x] Dot indicators (click to jump to slide)
- [x] Graceful fallback to default image when no slides configured
- [x] Component: `/app/frontend/src/components/HeroSlider.js`

### Admin Slider Management
- [x] 5 image slots with URL input + file upload (max 5MB per image)
- [x] Live preview thumbnail per slot + clear button
- [x] Slide interval input
- [x] `POST /api/upload-image` endpoint (admin-only, base64 data URL response)
- [x] `slider_images` (List[str]) + `slider_interval` (int) on settings model
- [x] Backfill on startup for legacy settings docs

### Homepage Restructure
- [x] New section order: Hero → About → **New Products** → Featured Products → Categories → Why Choose Us → Industries → Testimonials → CTA
- [x] New Products section with "NEW" badge on cards (Sparkles icon)
- [x] Pulls from `/api/products?is_new=true&is_active=true`

### Admin Product Form
- [x] `is_new` toggle alongside existing `is_featured` and `is_active`
- [x] "New" tag on admin product table

### Footer
- [x] Verified: no App Store / Play Store / mobile app download links

## Prioritized Backlog

### P0 (Must Have - Next)
- [ ] Upload final, brand-specific slider images via Admin
- [ ] Add real product images
- [ ] Upload actual PDF catalogs

### P1 (Should Have)
- [ ] Pause-slider-on-hover + prefers-reduced-motion handling (a11y)
- [ ] Move image storage from base64 in DB to filesystem/object storage
- [ ] Split server.py into modules (auth, products, settings, uploads)
- [ ] Product comparison tool
- [ ] Dealer locator with map
- [ ] Advanced analytics dashboard
- [ ] Email notifications (Resend/SendGrid)

### P2 (Nice to Have)
- [ ] Multi-language support (Hindi/English)
- [ ] Bulk product import via CSV
- [ ] Product reviews/ratings
- [ ] Blog/News section

## Tech Stack
- Frontend: React 19, Tailwind CSS, Shadcn/UI
- Backend: FastAPI, Python 3
- Database: MongoDB
- Video Generation: Sora 2 via Emergent Integrations
- Authentication: JWT with bcrypt

## Test Credentials
- Admin Email: admin@mayur.com
- Admin Password: MayurAdmin@2024
