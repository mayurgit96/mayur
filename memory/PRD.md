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

## Prioritized Backlog

### P0 (Must Have - Next)
- [ ] Generate actual hero video using Sora 2
- [ ] Add real product images
- [ ] Upload actual PDF catalogs

### P1 (Should Have)
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
