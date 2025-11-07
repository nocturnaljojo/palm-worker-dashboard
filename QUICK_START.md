# 🚀 DASHBOARD QUICK START GUIDE

## ⚡ 3-MINUTE SETUP

### Step 1: Install Dependencies (1 minute)

```bash
cd dashboard
npm install
```

**Expected output:** Dependencies installed successfully

---

### Step 2: Configure Environment (30 seconds)

Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://otfwnkansibvitjdefje.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<get-from-supabase>
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90Zndua2Fuc2lidml0amRlZmplIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTM4MTA1MSwiZXhwIjoyMDc2OTU3MDUxfQ.g3giUlJotkvqGZAaQwg5hLDUmzYHJmoJ6z3ysCbqMtU
```

**Get anon key:**
1. Go to: https://otfwnkansibvitjdefje.supabase.co
2. Click: Settings → API
3. Copy: "anon public" key
4. Paste in `.env.local`

---

### Step 3: Run Dashboard (30 seconds)

```bash
npm run dev
```

**Open:** http://localhost:3000

---

## ✅ VERIFICATION CHECKLIST

**You should see:**
- ✅ Summary cards with Jacob's test data
- ✅ Fiji in "Workers by Country"
- ✅ VIC 3500 postcode data
- ✅ UNE employer with 3-star rating
- ✅ Aged Care industry data

---

## 🎯 WHAT YOU CAN DO NOW

### View Real-Time Data
- **Total Workers:** See live count from WhatsApp bot
- **Active Users:** 7-day and 30-day activity
- **Survey Responses:** Jacob's survey + future responses
- **Distress Alerts:** Safety monitoring dashboard

### Test the API
```bash
# Test summary endpoint
curl http://localhost:3000/api/dashboard/summary

# Test workers by country
curl http://localhost:3000/api/dashboard/workers?groupBy=country

# Test map data for VIC
curl http://localhost:3000/api/dashboard/map-data?state=VIC
```

---

## 🚨 TROUBLESHOOTING

### Problem: "npm install" fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

### Problem: "Failed to fetch dashboard summary"

**Solution:**
1. Check `.env.local` file exists in `dashboard/` directory
2. Verify Supabase service role key is correct
3. Test Supabase connection:
   ```bash
   # In Supabase SQL Editor
   SELECT * FROM dashboard_summary;
   ```

### Problem: No data showing

**Solution:**
1. Verify SQL views were created (check `database/DASHBOARD_SETUP_INSTRUCTIONS.md`)
2. Run this query in Supabase:
   ```sql
   SELECT COUNT(*) FROM users WHERE name = 'Jacob';
   ```
3. Should return 1 (Jacob's test data)

### Problem: Port 3000 already in use

**Solution:**
```bash
# Run on different port
npm run dev -- -p 3001
```
Then open: http://localhost:3001

---

## 📋 NEXT ACTIONS

Once dashboard is running:

### Option A: Add More Test Data
Send more WhatsApp messages to populate the dashboard with varied data

### Option B: Customize Dashboard
- Edit `src/app/page.tsx` to change layout
- Modify colors in `tailwind.config.ts`
- Add new API routes in `src/app/api/dashboard/`

### Option C: Deploy to Production
```bash
# Build for production
npm run build

# Test production build locally
npm start

# Deploy to Vercel
vercel
```

---

## 🎉 SUCCESS!

Your dashboard is now running and connected to your WhatsApp bot's live data!

**Dashboard URL:** http://localhost:3000

**Next Steps:**
1. Explore the dashboard interface
2. Send more WhatsApp test messages
3. Watch data update in real-time (30s refresh)
4. Consider deploying to production

---

**Need Help?**
- Check `dashboard/README.md` for detailed documentation
- Review `database/DASHBOARD_SETUP_INSTRUCTIONS.md` for SQL issues
- Test API endpoints directly in browser
