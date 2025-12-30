# Quick Start - Syndic Manager

Get up and running in 5 minutes!

## 🚀 Super Fast Setup

### 1. Install Dependencies (1 minute)
```bash
npm install
```

### 2. Set Up Supabase (2 minutes)

**Create Project:**
1. Go to https://supabase.com
2. Click "New Project"
3. Wait for provisioning (~2 min)

**Get Credentials:**
1. Go to Settings → API
2. Copy "Project URL" and "anon public" key

### 3. Configure Environment (30 seconds)

Create `.env.local` file:
```env
VITE_SUPABASE_URL=paste_your_url_here
VITE_SUPABASE_ANON_KEY=paste_your_key_here
```

### 4. Set Up Database (1 minute)

1. In Supabase, go to SQL Editor
2. Copy ALL content from `supabase-schema.sql`
3. Paste and click "Run"
4. Wait for "Success" message

### 5. Start Application (30 seconds)
```bash
npm run dev
```

Open http://localhost:5173 in your browser!

## ✅ First Steps

1. **Go to Settings** → Set monthly fee (e.g., 100)
2. **Go to Apartments** → Click "Add Apartment"
3. **Go to Payments** → Click cells to mark as paid
4. **Go to Dashboard** → See your financial overview!

## 🎯 Test Data (Optional)

Want to test with sample data? Add these apartments:

| Apt # | Floor | Owner |
|-------|-------|-------|
| 101 | 1 | John Smith |
| 102 | 1 | Jane Doe |
| 201 | 2 | Bob Wilson |
| 202 | 2 | Alice Brown |

Then add some expenses:
- Cleaning: $200
- Electricity: $150
- Maintenance: $300

Mark a few payments as paid and check the dashboard!

## 🆘 Having Issues?

**App won't start?**
- Make sure Node.js 18+ is installed
- Delete `node_modules` and run `npm install` again

**Can't connect to database?**
- Check `.env.local` file exists
- Verify Supabase credentials are correct
- Restart the dev server

**No data showing?**
- Make sure you ran the SQL schema
- Check browser console (F12) for errors
- Verify Supabase project is active

## 📚 Next Steps

- Read [FEATURES.md](FEATURES.md) for complete feature list
- Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions
- See [DEPLOYMENT.md](DEPLOYMENT.md) when ready to deploy

---

That's it! You're ready to manage your building! 🏢

