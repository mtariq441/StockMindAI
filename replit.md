# AI-Based Inventory Management System

## Overview

This is an enterprise-grade AI-powered inventory management system built with React, Express, and TypeScript. The application provides real-time stock tracking, AI demand forecasting, automated restocking suggestions, and comprehensive analytics dashboards. It features a modern, data-dense interface inspired by enterprise SaaS applications like Linear, optimized for business users who need efficient access to inventory data and insights.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR and optimized production builds
- Wouter for lightweight client-side routing (no React Router dependency)

**UI Component System**
- Shadcn/ui components built on Radix UI primitives for accessible, composable UI elements
- Tailwind CSS for utility-first styling with custom design tokens
- Design system following "New York" style with enterprise SaaS aesthetics
- Dark mode primary with light mode support via theme provider

**State Management & Data Fetching**
- TanStack Query (React Query) for server state management, caching, and data synchronization
- Custom query client configured with specific refetch and stale time policies
- API request abstraction layer handling authentication via cookies

**Design System Decisions**
- Color palette optimized for data clarity: Deep charcoal backgrounds (222 14% 8%) with vibrant blue primary (217 91% 60%)
- Typography: Inter for UI, JetBrains Mono for data/metrics to enhance number readability
- Consistent interaction patterns across all modules with hover/active states using CSS custom properties (--elevate-1, --elevate-2)
- Border radius standardized: lg=9px, md=6px, sm=3px for visual consistency

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for the REST API server
- ESM (ECMAScript Modules) throughout the codebase for modern JavaScript module support
- Custom middleware for request logging with performance metrics

**Storage Layer**
- Initial implementation uses in-memory storage (MemStorage class) for development
- Storage interface (IStorage) designed for easy database integration
- Schema definitions using Zod for runtime type validation
- Drizzle ORM ready for integration with Neon PostgreSQL (dependencies installed but not yet implemented)

**API Design**
- RESTful API with `/api` prefix for all application routes
- Error handling middleware for consistent error responses
- Request/response logging with JSON payload capture (truncated at 80 chars)

**Development vs Production**
- Vite middleware integration in development for HMR and asset serving
- Static file serving in production from built assets
- Conditional Replit-specific plugins (cartographer, dev banner) only in development

### External Dependencies

**UI Component Libraries**
- Radix UI: Complete set of unstyled, accessible primitives (accordion, dialog, dropdown, select, etc.)
- Recharts: Charting library for sales analytics, forecasting visualizations, and performance metrics
- cmdk: Command palette component for keyboard-driven navigation
- class-variance-authority & clsx: Utility for managing component variants and conditional class names
- Lucide React: Icon library for consistent iconography

**Form & Validation**
- React Hook Form: Form state management with minimal re-renders
- @hookform/resolvers: Integration layer for validation libraries
- Zod: Schema validation for both client and server-side validation
- drizzle-zod: Auto-generate Zod schemas from Drizzle ORM definitions

**Database & ORM (Configured for Future Use)**
- @neondatabase/serverless: Neon PostgreSQL serverless driver
- Drizzle ORM: Type-safe SQL query builder with schema migrations
- connect-pg-simple: PostgreSQL session store (installed but not yet integrated)

**Development Tools**
- tsx: TypeScript execution for development server
- esbuild: Production bundling for server code
- @replit/vite-plugin-runtime-error-modal: Development error overlay
- @replit/vite-plugin-cartographer: Replit-specific code navigation (dev only)

**Utility Libraries**
- date-fns: Date manipulation and formatting
- nanoid: Unique ID generation
- tailwind-merge: Intelligent Tailwind class merging

### Module Structure

**Pages & Routes**
- Home: Landing page with hero section and feature cards
- Login: Role-based authentication (Admin, Manager, Staff)
- Dashboard: Overview with stat cards, sales charts, and low stock alerts
- Products: Product inventory management with search and category filters
- Categories: Product category organization
- Sales: Transaction recording and sales history with daily performance charts
- Forecast: AI-powered demand prediction with confidence intervals
- Reports: Generate downloadable reports (PDF, CSV, Excel formats)
- Suppliers: Supplier relationship management
- Users: User account and permission management
- Settings: System configuration and preferences
- Contact: Support and contact information

**Current Implementation Status**
- ✅ Frontend UI fully implemented
- ✅ Backend API fully functional with complete REST endpoints
- ✅ Authentication system with JWT and bcrypt (Register, Login, User Management)
- ✅ Product Management with auto SKU generation and stock tracking
- ✅ Sales & Purchase Management with automatic inventory updates
- ✅ Stock Alert System with real-time notifications
- ✅ AI Business Intelligence Bot with OpenAI integration (GPT-4o-mini)
- ✅ Dashboard Analytics with comprehensive business metrics
- ✅ In-memory storage with full CRUD operations for all entities
- ✅ Seed data included for immediate testing

**Backend Features Completed (Oct 8, 2025)**
- **Authentication**: JWT-based auth with role-based access control (Admin/Staff/Viewer)
- **Product CRUD**: Full product management with categories and suppliers
- **Inventory Tracking**: Automatic stock updates, low stock alerts, reorder recommendations
- **Sales & Purchases**: Transaction recording with user tracking and stock adjustments
- **AI Intelligence**: Natural language query processing with OpenAI API integration
- **Analytics API**: Real-time stats, monthly metrics, profit calculations
- **Security**: Bcrypt password hashing, JWT tokens, Zod validation

**API Documentation**: See `API_DOCUMENTATION.md` for complete endpoint reference