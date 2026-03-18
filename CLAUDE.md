# Kylemore Fixtures App — Claude Instructions

## Project
A Progressive Web App (PWA) for Kylemore FC to display fixtures and manage events.
Notion project page: https://www.notion.so/32756144acaa819bab5fda45bdc9040d

## Tech stack
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Icons**: lucide-react
- **Date utils**: date-fns
- **Package manager**: npm (use `npm run dev`, `npm run build`)

## Key routes
| Route | Description |
|---|---|
| `/fixtures` | Public fixtures calendar |
| `/fixtures/embed` | Embeddable iframe version |
| `/admin/login` | Admin login |
| `/admin/upload` | CSV/XLSX fixture upload |
| `/admin/events` | Events admin with inline edit |

## Project structure
```
app/           # Next.js App Router pages + API routes
components/    # React components
lib/           # Supabase clients, types, utilities
database/      # schema.sql, sample CSV
public/        # Static assets
```

## Database tables
- `sports` — sport config (name, slug, color, icon, is_active)
- `fixtures` — fixture schedule (FK to sports)

## Patterns & conventions
- Admin routes are protected by middleware (`middleware.ts`)
- Inline editing uses PATCH API endpoints (e.g. `/api/events/[id]`)
- Supabase client: browser → `lib/supabase/client.ts`, server → `lib/supabase/server.ts`
- Tailwind 4 — no `tailwind.config.js`, configured via CSS
- No separate edit pages — all admin editing is inline for speed

## Notion updates
When a feature is completed, update the checklist on the Notion project page above.
Tick off items in the relevant phase and add new ones if scope grows.
site: 