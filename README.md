# Wedding AI Planner - Foundation Structure

A mobile-first Arabic wedding planning platform built with Next.js 14, Supabase, and modern web technologies.

## Project Structure

```
wedding-ai-planner/
├── .env.example                 # Environment variables template
├── package.json                 # Dependencies and scripts
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── next.config.mjs             # Next.js configuration
├── postcss.config.mjs          # PostCSS configuration
│
├── public/                     # Static assets
│
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql    # Complete database schema
│   └── seed/                   # Seed data files
│
└── src/
    ├── app/                    # Next.js App Router
    │   ├── layout.tsx          # Root layout with RTL & Tajawal font
    │   ├── page.tsx            # Home page
    │   ├── globals.css         # Global styles
    │   ├── login/              # Login page
    │   ├── register/           # Registration page
    │   ├── dashboard/          # Bride dashboard (protected)
    │   ├── vendor/             # Vendor dashboard (protected)
    │   ├── admin/              # Admin dashboard (protected)
    │   └── vendors/            # Public vendor directory
    │
    ├── components/
    │   ├── ui/                 # Reusable UI components
    │   ├── layout/             # Layout components
    │   │   └── BottomNav.tsx   # Mobile bottom navigation
    │   ├── forms/              # Form components
    │   ├── vendor/             # Vendor-specific components
    │   ├── bride/              # Bride-specific components
    │   ├── admin/              # Admin-specific components
    │   └── providers/
    │       └── SupabaseSessionProvider.tsx
    │
    ├── lib/
    │   ├── supabase/
    │   │   ├── client.ts       # Browser Supabase client
    │   │   ├── server.ts       # Server Supabase client
    │   │   └── middleware.ts   # Auth middleware
    │   ├── utils/              # Utility functions
    │   └── env.ts              # Environment validation
    │
    ├── hooks/                  # Custom React hooks
    │
    ├── types/
    │   ├── index.ts            # TypeScript interfaces
    │   └── database.types.ts   # Supabase generated types
    │
    └── middleware.ts           # Root middleware for route protection
```

## Database Tables

The following tables are created in Supabase:

1. **users** - User accounts with role (bride/vendor/admin)
2. **bride_profiles** - Bride/wedding details
3. **vendor_profiles** - Vendor business information
4. **vendor_photos** - Vendor portfolio images
5. **bride_purchases** - Service purchases by brides
6. **vendor_subscriptions** - Vendor subscription plans
7. **ai_conversations** - AI chat history
8. **tasks** - Wedding planning tasks
9. **budget_items** - Budget tracking
10. **vendor_inquiries** - Messages between brides and vendors
11. **reviews** - Vendor reviews

## Environment Variables

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
# Edit .env.local with your actual values
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `OPENAI_API_KEY` - OpenAI API key for GPT-4o
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY` - Moyasar publishable key
- `MOYASAR_SECRET_KEY` - Moyasar secret key
- `WHATSAPP_BUSINESS_TOKEN` - WhatsApp Business API token
- `NEXTAUTH_SECRET` - NextAuth secret key
- `NEXTAUTH_URL` - NextAuth URL
- `LOCAL_APP_URL` - Local development URL
- `PRODUCTION_APP_URL` - Production URL

## Setup Commands

Run these commands in order to set up the project:

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env.local
# Edit .env.local with your actual values
```

### 3. Set Up Supabase

#### Option A: Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your existing project (get project ID from Supabase dashboard)
supabase link --project-ref YOUR_PROJECT_ID

# Run migrations
supabase db push

# Generate TypeScript types
npm run db:generate-types
```

#### Option B: Manual Setup via Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select existing one
3. Go to SQL Editor
4. Copy contents of `supabase/migrations/001_initial_schema.sql`
5. Paste and run in SQL Editor

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase
- **Image Storage**: Cloudinary
- **AI**: OpenAI GPT-4o API
- **Payment**: Moyasar
- **Hosting**: Vercel
- **RTL Support**: Built-in with next-intl ready
- **Font**: Tajawal (Google Fonts)

## Features (Foundation Only)

This is the foundational structure only. The following features will be built on top of this foundation:

- User authentication (bride, vendor, admin roles)
- Bride profile management
- Vendor profile management with photo galleries
- AI-powered wedding planning assistant
- Task management
- Budget tracking
- Vendor directory with search and filtering
- Vendor inquiries and messaging
- Review system
- Payment integration (Moyasar)
- Subscription management for vendors
- WhatsApp notifications

## Route Protection

The middleware protects the following routes:
- `/dashboard` - Requires authentication (bride role)
- `/vendor` - Requires authentication (vendor role)
- `/admin` - Requires authentication (admin role)

Public routes:
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/vendors` - Public vendor directory

## Mobile-First Design

The application is designed mobile-first with:
- Bottom navigation bar for mobile devices (hidden on desktop)
- RTL support for Arabic language
- Tajawal font optimized for Arabic text
- Responsive Tailwind CSS utilities

## Next Steps

After setting up the foundation, you can start building features by:

1. Creating authentication flows in `/app/login` and `/app/register`
2. Building the bride dashboard in `/app/dashboard`
3. Implementing vendor management in `/app/vendor`
4. Adding AI conversation functionality
5. Integrating payment systems
6. Building the vendor directory

## License

Private - All rights reserved
