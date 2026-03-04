# Kylemore Sports Ground Fixtures - Setup Guide

Complete setup instructions for deploying the Kylemore Sports Ground Fixtures application.

---

## 1. Supabase Project Setup

### Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create a free account
3. Click **"New Project"**
4. Fill in the project details:
   - **Name**: `kylemore-fixtures` (or your preferred name)
   - **Database Password**: Create a strong password (save this securely)
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Select "Free" tier (sufficient for this application)
5. Click **"Create new project"**
6. Wait 1-2 minutes for the project to be provisioned

### Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, click **"Settings"** (gear icon in left sidebar)
2. Click **"API"** in the settings menu
3. You'll see two important values:
   - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")
4. **Copy these values** - you'll need them for environment variables

### Step 3: Run the Database Schema

1. In your Supabase project, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Open the file `/database/schema.sql` from this project
4. Copy the entire SQL content
5. Paste it into the Supabase SQL Editor
6. Click **"Run"** (or press Cmd/Ctrl + Enter)
7. You should see a success message

**What this does:**
- Creates the `sports` and `fixtures` tables
- Sets up indexes for performance
- Enables Row Level Security (RLS)
- Creates RLS policies for public read access
- Creates RLS policies for authenticated admin write access
- Inserts seed data (Rugby and Soccer sports)
- Inserts sample fixtures for testing

### Step 4: Create an Admin User

1. In your Supabase project, click **"Authentication"** in the left sidebar
2. Click **"Users"** tab
3. Click **"Add user"** → **"Create new user"**
4. Enter:
   - **Email**: Your admin email (e.g., `admin@kylemore.com`)
   - **Password**: Create a strong password
   - **Auto Confirm User**: Enable this toggle (so you don't need email confirmation)
5. Click **"Create user"**
6. Save these credentials securely - you'll use them to log in to the admin panel

---

## 2. Local Development Setup

### Step 1: Install Dependencies

```bash
cd /app
yarn install
```

### Step 2: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   ```

   Replace:
   - `your-project-id` with your actual Supabase project URL
   - `your-anon-public-key` with your actual anon key

### Step 3: Run the Development Server

```bash
yarn dev
```

The application will be available at `http://localhost:3000`

### Step 4: Test the Application

1. **Public Fixtures Page**: Visit `http://localhost:3000/fixtures`
2. **Embed Version**: Visit `http://localhost:3000/fixtures/embed`
3. **Admin Login**: Visit `http://localhost:3000/admin/login`
4. Log in with the admin credentials you created in Supabase
5. **Admin Upload**: After logging in, visit `http://localhost:3000/admin/upload`

---

## 3. Vercel Deployment

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [https://vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your Git repository (GitHub, GitLab, or Bitbucket)
4. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (or leave blank)
   - **Build Command**: `yarn build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
5. Click **"Environment Variables"**
6. Add the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-public-key
   ```
7. Click **"Deploy"**
8. Wait 2-3 minutes for deployment to complete
9. Your app will be live at `https://your-project-name.vercel.app`

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   cd /app
   vercel
   ```

4. Follow the prompts and add environment variables when asked

5. For production deployment:
   ```bash
   vercel --prod
   ```

### Add Environment Variables in Vercel (Post-Deployment)

If you need to add or update environment variables after deployment:

1. Go to your project in the Vercel dashboard
2. Click **"Settings"**
3. Click **"Environment Variables"** in the left menu
4. Click **"Add New"**
5. Enter the variable name and value:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Select which environments (Production, Preview, Development)
7. Click **"Save"**
8. Redeploy your application for changes to take effect

---

## 4. Using the Application

### Public Fixtures Page

**URL**: `https://your-domain.com/fixtures`

- View all scheduled fixtures in a weekly calendar
- Filter by sport using the filter chips
- Search for teams, titles, or fields
- Filter by date range, field, time of day
- See upcoming fixtures in the right sidebar
- Click any fixture to view full details

### Embed Version

**URL**: `https://your-domain.com/fixtures/embed`

Embed this page in an iframe on your website:

```html
<iframe 
  src="https://your-domain.com/fixtures/embed" 
  width="100%" 
  height="800" 
  frameborder="0"
></iframe>
```

**Query Parameters:**
- `sport=rugby` - Filter by sport slug
- `field=Field 1` - Filter by field name
- `view=list` - Show list view instead of calendar
- `days=14` - Show fixtures for next 14 days

**Examples:**
- Rugby fixtures only: `/fixtures/embed?sport=rugby`
- Field 1 fixtures: `/fixtures/embed?field=Field%201`
- List view for 14 days: `/fixtures/embed?view=list&days=14`
- Combined: `/fixtures/embed?sport=soccer&view=list&days=7`

### Admin Upload

**URL**: `https://your-domain.com/admin/upload`

1. Log in with your admin credentials
2. Click **"Choose File"** or drag-and-drop a CSV/XLSX file
3. Review the preview table
4. Check for validation errors (highlighted in red)
5. Review clash warnings (fixtures with same field and overlapping times)
6. Click **"Import Fixtures"** to confirm
7. New sports will be automatically created if they don't exist

**Required Spreadsheet Columns:**
- `sport` - Sport name (e.g., Rugby, Soccer, Cricket)
- `title` - Fixture title (e.g., U18 Rugby)
- `home_team` - Home team name
- `away_team` - Away team name  
- `date` - Date in YYYY-MM-DD format (e.g., 2025-05-12)
- `start_time` - Start time in HH:MM format (e.g., 10:00)
- `end_time` - End time in HH:MM format (e.g., 11:30)
- `field` - Field name (e.g., Field 1, Field 2)

**Optional Columns:**
- `location_name` - Location (defaults to "Kylemore Sports Ground")
- `status` - Status: scheduled, postponed, cancelled (defaults to "scheduled")
- `notes` - Additional notes

**Example CSV:**
```csv
sport,title,home_team,away_team,date,start_time,end_time,field
Rugby,U18,Kylemore,Oakwood,2025-05-12,10:00,11:30,Field 1
Soccer,Premier,City FC,Rovers,2025-05-13,14:00,15:30,Field 2
Cricket,T20,Eagles,Hawks,2025-05-14,16:00,18:00,Field 3
```

---

## 5. Database Management

### Viewing Data

1. Go to your Supabase project
2. Click **"Table Editor"** in the left sidebar
3. Select `sports` or `fixtures` table
4. View, edit, or delete records directly

### Backing Up Data

1. In Supabase, click **"SQL Editor"**
2. Run: `SELECT * FROM fixtures;` or `SELECT * FROM sports;`
3. Click **"Download as CSV"**

### Managing Sports

You can add new sports directly in Supabase:

1. Go to **"Table Editor"** → **"sports"**
2. Click **"Insert row"**
3. Fill in:
   - `name`: Sport name (e.g., "Cricket")
   - `slug`: URL-friendly version (e.g., "cricket")
   - `color`: Hex color code (e.g., "#3B82F6")
   - `icon`: Icon identifier (e.g., "cricket")
   - `is_active`: true
4. Click **"Save"**

The new sport will immediately appear in the fixtures page filter chips.

---

## 6. Troubleshooting

### "Failed to fetch fixtures"
- Check that your Supabase credentials in `.env.local` are correct
- Verify RLS policies are enabled (run the schema.sql again if needed)
- Check browser console for specific error messages

### "Not authenticated" errors in admin
- Clear browser cookies and log in again
- Verify the admin user exists in Supabase (Authentication → Users)
- Check that the email/password are correct

### Fixtures not showing in calendar
- Check that fixtures exist in the database (Table Editor → fixtures)
- Verify the `start_time` is within the selected date range
- Check that the sport's `is_active` is set to true

### Clash detection not working
- Ensure fixtures have the same `field` value (case-sensitive)
- Verify times are overlapping (start_time of one is before end_time of other)

---

## 7. Support

For questions or issues:
- Check the Supabase documentation: https://supabase.com/docs
- Check the Next.js documentation: https://nextjs.org/docs
- Review the code comments in the project files

---

## Quick Reference

**Environment Variables:**
- Local: `.env.local`
- Vercel: Project Settings → Environment Variables

**URLs:**
- Public Fixtures: `/fixtures`
- Embed: `/fixtures/embed`
- Admin Login: `/admin/login`
- Admin Upload: `/admin/upload`

**Database Tables:**
- `public.sports` - Sports configuration
- `public.fixtures` - Fixture schedule

**Admin Credentials:**
- Created in: Supabase Dashboard → Authentication → Users
- Used for: Admin login and fixture uploads