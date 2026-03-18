# Deployment Checklist

## \u2705 Pre-Deployment Checklist

### 1. Supabase Setup
- [ ] Created Supabase project
- [ ] Ran `database/schema.sql` in SQL Editor
- [ ] Created admin user in Authentication \u2192 Users
- [ ] Copied Project URL and anon key

### 2. Local Testing
- [ ] Created `.env.local` with Supabase credentials
- [ ] Ran `yarn dev` successfully
- [ ] Tested public fixtures page (`/fixtures`)
- [ ] Tested embed version (`/fixtures/embed`)
- [ ] Tested admin login (`/admin/login`)
- [ ] Tested CSV upload (`/admin/upload`)
- [ ] Uploaded `database/sample-fixtures.csv`
- [ ] Verified fixtures appear in calendar

### 3. Vercel Deployment
- [ ] Pushed code to GitHub
- [ ] Connected repository to Vercel
- [ ] Added environment variables in Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Deployed successfully
- [ ] Tested production URL

## \ud83d\ude80 Quick Deploy Commands

```bash
# Build locally to verify
yarn build
d
# Push to GitHub
git add .
git commit -m "Initial deployment"
git push origin main

# Deploy via Vercel CLI (optional)
vercel --prod
```

## \ud83d\udcdd Environment Variables Checklist

### Local Development (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxx...
```

### Vercel Production
Add the same variables in:
- Project Settings \u2192 Environment Variables
- Select "Production" environment
- Redeploy after adding

## \ud83e\uddea Testing Embed URL

Once deployed, test the embed with:

```html
<iframe 
  src="https://your-domain.vercel.app/fixtures/embed?sport=rugby&days=14" 
  width="100%"
  height="800"
  frameborder="0"
></iframe>
```

## \ud83d\udd17 Important URLs

After deployment, bookmark these:

- **Public Fixtures**: `https://your-domain/fixtures`
- **Embed (Rugby)**: `https://your-domain/fixtures/embed?sport=rugby`
- **Embed (Soccer)**: `https://your-domain/fixtures/embed?sport=soccer`
- **Admin Login**: `https://your-domain/admin/login`
- **Admin Upload**: `https://your-domain/admin/upload`

## \ud83d\udcca Post-Deployment Verification

### Test Public Interface
1. Visit `/fixtures`
2. Filter by sport
3. Search for a team
4. Click a fixture to open modal
5. Check responsive design on mobile

### Test Embed
1. Visit `/fixtures/embed`
2. Try different query parameters
3. Test in an iframe on another site

### Test Admin
1. Login at `/admin/login`
2. Upload `database/sample-fixtures.csv`
3. Check for validation
4. Verify clash detection
5. Import fixtures
6. Check they appear in public interface

## \u26a0\ufe0f Common Issues

### Build fails with "Supabase client error"
- **Solution**: Environment variables not set. Add to Vercel or create `.env.local`

### "Failed to fetch fixtures" in production
- **Solution**: Check Supabase URL and key are correct in Vercel environment variables

### Admin login redirects to login
- **Solution**: Clear cookies, check admin user exists in Supabase

### CORS errors
- **Solution**: Supabase automatically handles CORS. Check your Supabase URL is correct.

## \ud83d\udc68\u200d\ud83d\udcbb Support

If you encounter issues:
1. Check Supabase logs (Dashboard \u2192 Logs)
2. Check browser console for errors
3. Review `SETUP.md` for detailed instructions
4. Verify all environment variables are set correctly

## \ud83c\udf89 Success!

Once everything is working:
- Share the public URL with users
- Provide embed URL to website administrators
- Share admin credentials with authorized personnel
- Set up regular fixture uploads

---

**Next Steps:**
- Add more sports via CSV upload
- Customize colors in `lib/date-utils.ts`
- Add custom domain in Vercel
- Set up monitoring and analytics