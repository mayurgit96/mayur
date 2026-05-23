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
