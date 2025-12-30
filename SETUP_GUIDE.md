# Syndic Manager - Quick Setup Guide

## Step-by-Step Setup Instructions

### 1. Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js 18 or higher installed
- ✅ npm or yarn package manager
- ✅ A modern web browser (Chrome, Firefox, Safari, Edge)
- ✅ Internet connection for Supabase setup

### 2. Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required packages including:
- React & React Router
- Tailwind CSS
- Supabase client
- React Query
- jsPDF for reports
- Lucide icons

### 3. Create Supabase Project

1. **Go to Supabase**
   - Visit https://supabase.com
   - Sign up or log in to your account
   - Click "New Project"

2. **Configure Your Project**
   - Choose an organization (or create one)
   - Enter project name: `syndic-manager` (or your choice)
   - Enter a strong database password (save it securely!)
   - Choose a region close to your location
   - Click "Create new project"
   - Wait 2-3 minutes for provisioning

3. **Get Your API Credentials**
   - Once ready, go to Project Settings (gear icon)
   - Click on "API" in the left sidebar
   - You'll see:
     - **Project URL** (looks like: https://xxxxx.supabase.co)
     - **anon/public key** (long string starting with eyJ...)
   - Keep this page open, you'll need these values

### 4. Configure Environment Variables

1. **Create Environment File**
   - In the project root, create a file named `.env.local`
   - Add the following content:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

2. **Replace with Your Values**
   - Replace `https://your-project-id.supabase.co` with your Project URL
   - Replace `your-anon-key-here` with your anon/public key
   - Save the file

⚠️ **Important**: Never commit this file to version control!

### 5. Set Up Database Schema

1. **Open SQL Editor**
   - In your Supabase dashboard
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

2. **Run the Schema**
   - Open the `supabase-schema.sql` file from this project
   - Copy ALL the content (Ctrl+A, Ctrl+C)
   - Paste it into the Supabase SQL Editor
   - Click "Run" (or press Ctrl+Enter)
   - Wait for "Success" message

3. **Verify Tables Created**
   - Click "Table Editor" in the left sidebar
   - You should see these tables:
     - settings
     - apartments
     - payments
     - expense_categories
     - expenses

### 6. Start the Application

1. **Run Development Server**
   ```bash
   npm run dev
   ```

2. **Open in Browser**
   - The terminal will show: `Local: http://localhost:5173`
   - Open this URL in your browser
   - You should see the Syndic Manager application!

### 7. Initial Configuration

1. **Go to Settings Page**
   - Click "Settings" in the sidebar
   - Set your monthly subscription fee (e.g., 100)
   - Verify the financial year (current year by default)
   - Confirm apartment count (default is 31)
   - Click "Save Settings"

2. **Add Your First Apartment**
   - Click "Apartments" in the sidebar
   - Click "Add Apartment" button
   - Fill in the form:
     - Apartment Number: 101
     - Floor: 1
     - Owner Name: John Doe
     - Phone Number: +1234567890 (optional)
   - Click "Create"

3. **Track Payments**
   - Click "Payments" in the sidebar
   - You'll see a grid with all months
   - Click on any cell to toggle payment status
   - Green checkmark = Paid
   - Red X = Not Paid

4. **Add an Expense**
   - Click "Expenses" in the sidebar
   - Click "Add Expense" button
   - Select a category
   - Enter description and amount
   - Choose date
   - Click "Create"

5. **View Dashboard**
   - Click "Dashboard" in the sidebar
   - See your financial overview
   - Export reports as PDF

## Troubleshooting

### Application won't start
- Check if Node.js is installed: `node --version`
- Delete `node_modules` and run `npm install` again
- Make sure port 5173 is not in use

### "Invalid API key" error
- Verify your `.env.local` file exists
- Check that the Supabase URL and key are correct
- Restart the development server after creating `.env.local`

### Database errors
- Ensure you ran the complete SQL schema
- Check Supabase project is active (not paused)
- Verify RLS policies are created

### No data showing
- Open browser console (F12) to check for errors
- Verify Supabase connection in Network tab
- Check if tables have data in Supabase Table Editor

### Styling looks broken
- Clear browser cache
- Check if Tailwind CSS is properly configured
- Restart development server

## Common Issues

**Q: Can I use a different database?**
A: The app is built for Supabase, but you can adapt it to use any PostgreSQL database by modifying the connection settings.

**Q: How do I backup my data?**
A: In Supabase dashboard, go to Database → Backups. You can also export tables as CSV.

**Q: Can I change the currency?**
A: Currently uses $ symbol. You can modify the code to use your preferred currency symbol.

**Q: How many apartments can I manage?**
A: No hard limit. The system is designed to scale from 1 to 1000+ apartments.

**Q: Is my data secure?**
A: Yes, Supabase uses industry-standard security. Enable RLS policies and use authentication for production.

## Next Steps

1. **Add all your apartments** - Complete your building roster
2. **Set up payment tracking** - Mark historical payments
3. **Record expenses** - Add past expenses for accurate reports
4. **Explore dashboard** - Monitor financial health
5. **Export reports** - Generate PDF reports for meetings

## Need Help?

- Check the main README.md for detailed documentation
- Review Supabase documentation: https://supabase.com/docs
- Check browser console for error messages
- Verify all setup steps were completed

## Production Deployment

When ready to deploy:

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to hosting platform**
   - Vercel (recommended)
   - Netlify
   - Any static hosting service

3. **Set environment variables** in your hosting platform

4. **Enable authentication** in Supabase for security

---

🎉 **Congratulations!** Your Syndic Manager is ready to use!

