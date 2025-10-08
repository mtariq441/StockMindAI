# Design Guidelines: AI-Based Inventory Management System

## Design Approach

**Selected Approach**: Design System with Enterprise SaaS References

**Justification**: This is a utility-focused, information-dense enterprise application where efficiency, data clarity, and consistency are paramount. Drawing inspiration from **Linear** (clean enterprise UI), **Notion** (data-dense layouts), and **Material Design** principles for a polished, professional dashboard experience.

**Core Principles**:
- Data clarity over decoration
- Consistent interaction patterns across all modules
- Efficient information hierarchy
- Professional, trustworthy aesthetic suitable for business environments

---

## Color Palette

### Dark Mode (Primary)
- **Background**: 222 14% 8% (deep charcoal)
- **Surface**: 222 14% 12% (elevated panels)
- **Border**: 217 10% 20% (subtle dividers)
- **Primary**: 217 91% 60% (vibrant blue for CTAs and active states)
- **Success**: 142 71% 45% (AI predictions, stock healthy)
- **Warning**: 38 92% 50% (low stock alerts)
- **Danger**: 0 72% 51% (critical stock, errors)
- **Text Primary**: 210 20% 98%
- **Text Secondary**: 215 16% 65%
- **Text Muted**: 215 10% 45%

### Light Mode (Secondary)
- **Background**: 0 0% 100%
- **Surface**: 210 20% 98%
- **Border**: 214 15% 91%
- **Primary**: Same blue 217 91% 60%
- **Text Primary**: 222 47% 11%
- **Text Secondary**: 215 16% 35%

### Accent Colors (Sparingly)
- **AI Gradient**: Subtle gradient from primary blue to 250 70% 60% (purple tint) for AI-specific features
- **Chart Colors**: Use a consistent palette - primary blue, 142 71% 45% (green), 38 92% 50% (amber), 280 65% 60% (purple), 340 75% 55% (pink)

---

## Typography

**Font Families**:
- **Primary (UI)**: 'Inter', system-ui, sans-serif via Google Fonts
- **Data/Numbers**: 'JetBrains Mono', monospace for tables, metrics, and data values
- **Headings**: Inter with tighter tracking (-0.02em)

**Scale**:
- **Hero/Dashboard Title**: text-4xl (36px), font-bold, tracking-tight
- **Section Headers**: text-2xl (24px), font-semibold
- **Card Titles**: text-lg (18px), font-medium
- **Body Text**: text-sm (14px), font-normal
- **Labels/Captions**: text-xs (12px), font-medium, uppercase tracking-wide
- **Data Values**: text-base or text-lg with JetBrains Mono

**Line Heights**: Use tailwind defaults (relaxed for body, tight for headings)

---

## Layout System

**Spacing Primitives**: Consistent use of **4, 6, 8, 12, 16** as primary units
- Micro spacing: `gap-2, p-4` (cards, buttons)
- Component spacing: `gap-6, p-6` (sections within cards)
- Section spacing: `gap-8, p-8` (between major sections)
- Page margins: `p-6` (mobile), `p-8` (desktop)

**Grid System**:
- **Dashboard**: 12-column grid with `gap-6`
- **Responsive Cards**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- **Tables**: Full-width with horizontal scroll on mobile

**Container Widths**:
- **Max Width**: `max-w-screen-2xl mx-auto` for main content
- **Sidebar**: Fixed 256px (desktop), collapsible to 64px icons-only
- **Content Area**: `flex-1` with proper padding

---

## Component Library

### Navigation
- **Sidebar**: Fixed left, dark surface, icons + labels, active state with primary color + subtle bg
- **Top Bar**: User profile, notifications (badge indicators), search, theme toggle
- **Breadcrumbs**: Current path with chevron separators, text-sm muted

### Dashboard Cards
- **Stat Cards**: Rounded-lg, surface bg, border, p-6, icon + label + large value + trend indicator
- **Chart Cards**: Same styling, p-6, with proper chart padding and axis labels
- **Quick Action Cards**: Hover effect with subtle elevation, cursor-pointer

### Data Display
- **Tables**: Striped rows (zebra), sticky header, hover row highlight, monospace for numbers, right-align numerical columns
- **Status Badges**: Rounded-full, px-3 py-1, text-xs font-medium with semantic colors
- **Progress Bars**: Rounded-full, h-2, with gradient fill for visual interest

### Forms & Inputs
- **Text Fields**: Rounded-md, border, bg-surface, focus ring with primary color, proper label spacing
- **Select Dropdowns**: Native styling enhanced with chevron icon
- **Buttons**: 
  - Primary: bg-primary, white text, rounded-md, px-4 py-2, font-medium
  - Secondary: border, bg-transparent, rounded-md
  - Ghost: hover:bg-surface/50
- **Search**: Icon prefix, rounded-lg, w-full max-w-md

### AI-Specific Components
- **Forecast Graph**: Line chart with dual axes, shaded prediction area, confidence intervals
- **Restock Suggestions**: Card list with product thumbnail, current stock, predicted demand, CTA button
- **AI Badge**: Gradient background, "AI Powered" micro-label on relevant features

### Modals & Overlays
- **Modal**: Centered, max-w-2xl, rounded-lg, backdrop blur
- **Notifications**: Top-right toast, slide-in animation, auto-dismiss
- **Confirmation Dialogs**: Compact, clear action buttons

---

## Images

**Hero Section (Landing/Login)**: 
- Full-width background image showing a modern warehouse or inventory scene with subtle overlay (opacity-20 dark gradient)
- Dimensions: 1920x800px, high-quality, professional photography
- Alternative: Abstract data visualization or futuristic dashboard mockup

**Dashboard Icons**: Use **Heroicons** (outline for inactive, solid for active states) via CDN

**Product Images**: 
- Placeholder grid for product catalog
- 1:1 aspect ratio thumbnails, rounded-md, object-cover

**Empty States**: 
- Illustrative SVG for empty tables/lists (e.g., "No products found")
- Centered with descriptive text and CTA

---

## Animations

**Minimal & Purposeful Only**:
- **Page Transitions**: None (instant for enterprise speed)
- **Hover States**: Subtle background color shift, 150ms transition
- **Loading States**: Spinner on primary color, or skeleton screens for tables
- **Chart Animations**: Subtle draw-in on load (500ms ease-out)
- **Notifications**: Slide-in from top-right (300ms)

**Avoid**: Parallax, complex scroll animations, decorative effects

---

## Accessibility & Dark Mode

- Maintain **WCAG AA contrast ratios** (4.5:1 for text)
- Dark mode as default for dashboard (reduces eye strain during long sessions)
- All interactive elements have visible focus states (ring-2 ring-primary)
- Form inputs maintain consistent dark styling with proper labels
- Color is never the only indicator (use icons + text for status)

---

## Page-Specific Guidelines

**Login Page**: Clean, centered card (max-w-md), logo top, form fields with proper spacing, "Remember me" checkbox, forgot password link, subtle background pattern or hero image

**Dashboard**: 4-column stat cards top, 2-column chart section (sales trends + AI forecast), notification panel sidebar, quick actions bottom

**Products Table**: Advanced filters (search, category dropdown, stock status), sortable columns, bulk actions toolbar, "Add Product" primary button top-right, image thumbnails in first column

**AI Forecast Page**: Large prediction graph (full width), time range selector (tabs: 7d, 30d, 90d), restock suggestions grid below, export button

**Reports Page**: Card-based report types (Sales, Inventory, Forecast), date range pickers, preview thumbnails, download buttons

This design system ensures a cohesive, professional, and highly functional inventory management platform optimized for daily business operations.