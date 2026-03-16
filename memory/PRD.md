# Kylemore Sports Ground Fixtures - Product Requirements Document

## Original Problem Statement
Build a production-ready web app called "Kylemore Sports Ground Fixtures" - a full-stack Next.js/Supabase application for displaying and managing sports fixtures at Kylemore Sports Ground.

## Core Requirements

### Public Features
- **Calendar Views**: List, Week, and Month views for fixtures
- **Filtering**: By sport, date range, field, time of day, status
- **Search**: Search games, teams, or fields
- **Mobile Optimization**: Bottom navigation bar for view switching on mobile
- **Event Details**: Popup modals for fixture details

### Admin Features  
- **Authentication**: Supabase Auth protected admin area
- **CSV/XLSX Upload**: Bulk upload fixtures via spreadsheet
- **CSV Template**: Downloadable template for proper formatting

### Sport Types
- Rugby, Soccer, and "Events" (special type with description instead of teams)

## Tech Stack
- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL database + Auth)
- **Libraries**: SheetJS (xlsx), date-fns, lucide-react

## Database Schema

### sports table
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary Key |
| name | text | Unique |
| slug | text | Unique |
| color | text | Hex color |
| icon | text | Emoji or icon |
| is_active | boolean | |
| created_at | timestamp | |

### fixtures table
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary Key |
| sport_id | uuid | FK → sports.id |
| title | text | |
| home_team | text | Nullable for Events |
| away_team | text | Nullable for Events |
| start_time | timestamptz | |
| end_time | timestamptz | |
| field | text | |
| location_name | text | |
| status | text | scheduled/postponed/cancelled |
| notes | text | Description for Events |
| created_at | timestamp | |

## Implementation Status

### ✅ Completed (December 2025)
- [x] Full-stack Next.js application with all calendar views
- [x] Mobile bottom navigation bar
- [x] React Portal-based overlays (filters, popups) - fixes clipping issues
- [x] Events sport type with description display
- [x] CSV template download on admin upload page
- [x] **Supabase integration with live database** (December 2025)

### 🟡 Pending
- [ ] Add admin user in Supabase Auth for login testing
- [ ] Add "Events" sport to sports table
- [ ] Upload initial fixtures data

## File Structure
```
/app/
├── app/
│   ├── admin/login/page.tsx, upload/page.tsx
│   ├── fixtures/page.tsx, embed/page.tsx
│   ├── globals.css, layout.tsx, page.tsx
├── components/
│   ├── FixturesClient.tsx (main container)
│   ├── ListView.tsx, WeeklyCalendar.tsx, MonthCalendar.tsx
│   ├── FilterSheet.tsx, DayEventsSheet.tsx (Portal-based)
│   ├── FixtureModal.tsx, ViewToggle.tsx, etc.
├── lib/
│   ├── supabase/client.ts, server.ts, middleware.ts
│   ├── types.ts, date-utils.ts, utils.ts
├── .env.local (Supabase credentials)
```

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
```

## Key Technical Decisions
1. **React Portals** for all overlay components (FilterSheet, DayEventsSheet) to avoid CSS stacking context issues
2. **Graceful fallback** to mock data when Supabase not configured (for development)
3. **Conditional UI** for Events vs regular fixtures (description vs team names)
