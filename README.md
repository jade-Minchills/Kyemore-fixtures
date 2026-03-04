# Kylemore Sports Ground Fixtures

A production-ready web application for managing and displaying sports ground fixtures with a public calendar interface and admin upload system.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.2-cyan)

## 🏟️ Features

### Public Interface
- **Weekly Calendar View**: Interactive calendar showing fixtures from Monday to Sunday
- **Sport Filtering**: Dynamic filter chips for each sport (Rugby, Soccer, etc.)
- **Advanced Search**: Search by team names, fixture titles, or field locations
- **Multiple Filters**: Filter by date range, field, time of day, and status
- **Upcoming Fixtures Panel**: Quick view of next 6 upcoming games
- **Fixture Details Modal**: Click any fixture for complete information
- **Responsive Design**: Mobile-friendly layout that works on all devices
- **Real-time Updates**: Data fetched from Supabase on every page load

### Embed Version
- **iframe-Ready**: Simplified layout for embedding on external websites
- **Query Parameters**: Customize display with URL parameters
  - `?sport=rugby` - Filter by sport
  - `?field=Field%201` - Filter by field
  - `?view=list` - List view (calendar coming soon)
  - `?days=14` - Show fixtures for next 14 days

### Admin Panel
- **Secure Authentication**: Supabase Auth with email/password
- **CSV/XLSX Upload**: Bulk import fixtures from spreadsheets
- **Data Validation**: Real-time validation of uploaded data
- **Clash Detection**: Automatic detection of scheduling conflicts (same field + overlapping times)
- **Auto-Create Sports**: Automatically creates new sports from uploaded data
- **Preview Before Import**: Review all data before committing to database

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and Yarn
- A Supabase account (free tier works)
- Basic knowledge of Next.js and React

### Installation

1. **Clone and Install**
   ```bash
   cd /app
   yarn install
   ```

2. **Set Up Supabase**
   - Follow the detailed guide in [`SETUP.md`](./SETUP.md)
   - Create a Supabase project
   - Run the SQL schema from `database/schema.sql`
   - Create an admin user

3. **Configure Environment Variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run Development Server**
   ```bash
   yarn dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

## 📚 Project Structure

```
/app
├── app/                      # Next.js App Router
│   ├── fixtures/            # Public fixtures pages
│   │   ├── page.tsx         # Main calendar view
│   │   └── embed/           # Embed version
│   ├── admin/               # Admin panel
│   │   ├── login/           # Login page
│   │   └── upload/          # Upload page
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── WeeklyCalendar.tsx
│   ├── SportFilter.tsx
│   ├── SearchBar.tsx
│   ├── Filters.tsx
│   ├── UpcomingFixtures.tsx
│   ├── FixtureModal.tsx
│   └── FixturesClient.tsx
├── lib/                     # Utilities
│   ├── supabase/            # Supabase clients
│   ├── types.ts             # TypeScript types
│   ├── date-utils.ts        # Date/time utilities
│   └── utils.ts             # General utilities
├── database/                # Database files
│   ├── schema.sql           # Complete schema + RLS
│   └── sample-fixtures.csv  # Example CSV
├── middleware.ts            # Auth middleware
└── SETUP.md                 # Detailed setup guide
```

## 📦 Database Schema

### Sports Table
```sql
sports (
  id UUID PRIMARY KEY,
  name TEXT UNIQUE,
  slug TEXT UNIQUE,
  color TEXT (hex color),
  icon TEXT,
  is_active BOOLEAN,
  created_at TIMESTAMP
)
```

### Fixtures Table
```sql
fixtures (
  id UUID PRIMARY KEY,
  sport_id UUID (FK → sports),
  title TEXT,
  home_team TEXT,
  away_team TEXT,
  start_time TIMESTAMP WITH TIMEZONE,
  end_time TIMESTAMP WITH TIMEZONE,
  field TEXT,
  location_name TEXT,
  status TEXT (scheduled/postponed/cancelled),
  notes TEXT,
  created_at TIMESTAMP
)
```

## 🔐 Security

### Row Level Security (RLS)
- **Public Read Access**: Anyone can view active sports and fixtures
- **Authenticated Write Access**: Only authenticated users can create/update/delete
- **Admin-Only Routes**: `/admin/*` routes protected by middleware

### Authentication Flow
1. Admin navigates to `/admin/login`
2. Signs in with email/password (Supabase Auth)
3. Middleware verifies session on all `/admin/*` routes
4. Unauthenticated users redirected to login

## 📝 CSV Upload Format

### Required Columns
| Column | Format | Example |
|--------|--------|----------|
| sport | Text | Rugby |
| title | Text | U18 Rugby |
| home_team | Text | Kylemore |
| away_team | Text | Oakwood |
| date | YYYY-MM-DD | 2025-08-18 |
| start_time | HH:MM | 10:00 |
| end_time | HH:MM | 11:30 |
| field | Text | Field 1 |

### Optional Columns
- `location_name` (defaults to "Kylemore Sports Ground")
- `status` (defaults to "scheduled")
- `notes`

### Example CSV
See [`database/sample-fixtures.csv`](./database/sample-fixtures.csv)

## 🌐 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Add environment variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL
     NEXT_PUBLIC_SUPABASE_ANON_KEY
     ```
   - Deploy!

3. **Set Up Custom Domain** (Optional)
   - In Vercel project settings
   - Add your custom domain
   - Update DNS records

### Deploy via CLI
```bash
npm i -g vercel
vercel login
vercel
```

## 🛠️ Development

### Available Scripts
```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Run ESLint
```

### Adding New Sports

Two ways to add sports:

1. **Via Upload**: Include new sport name in CSV - it will be auto-created
2. **Via Supabase**: Manually insert in Table Editor

### Customizing Colors

Edit `lib/date-utils.ts`:
```typescript
const sportColors: Record<string, string> = {
  rugby: '#10B981',
  soccer: '#F59E0B',
  cricket: '#3B82F6',  // Add new colors
};
```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (stacked layout, list view)
- **Tablet**: 768px - 1024px (condensed calendar)
- **Desktop**: > 1024px (full layout with sidebar)

## ✅ Testing

### Test the Public Interface
1. Visit `/fixtures`
2. Filter by sport (click chips)
3. Search for teams
4. Change date range
5. Click fixture to view details

### Test the Embed Version
```html
<iframe 
  src="http://localhost:3000/fixtures/embed?sport=rugby&days=7" 
  width="100%" 
  height="800"
></iframe>
```

### Test Admin Upload
1. Login at `/admin/login`
2. Upload `database/sample-fixtures.csv`
3. Review validation and clashes
4. Import fixtures
5. Verify in public interface

## 🐛 Common Issues

### "Failed to fetch fixtures"
- Check Supabase credentials in `.env.local`
- Verify RLS policies are enabled
- Run `database/schema.sql` again if needed

### "Not authenticated" in admin
- Clear browser cookies
- Verify admin user exists (Supabase → Auth → Users)
- Check correct email/password

### Fixtures not showing
- Verify fixtures exist in database
- Check `start_time` is within selected date range
- Ensure sport's `is_active` is true

### Clash detection not working
- Ensure field names match exactly (case-sensitive)
- Verify times are in correct format (HH:MM)
- Check that times actually overlap

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [date-fns Documentation](https://date-fns.org/docs)
- [XLSX Documentation](https://docs.sheetjs.com/)

## 📄 License

MIT License - feel free to use this project for your own sports ground!

## 👥 Support

For questions or issues:
1. Check [`SETUP.md`](./SETUP.md) for detailed setup instructions
2. Review this README
3. Check Supabase logs (Dashboard → Logs)
4. Review browser console for errors

---

**Built with ❤️ using Next.js, TypeScript, Tailwind CSS, and Supabase**