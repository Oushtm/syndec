# Syndic Manager - Building Management System

A professional web application for managing building homeowners associations (Syndic) for residential buildings. Built with modern technologies for efficient financial management, payment tracking, and expense monitoring.

## 🌟 Features

### 1. Apartment Management
- Add, edit, and delete apartment units
- Store apartment details: number, floor, owner name, phone number
- Default support for 31 apartments (scalable to more)
- Clean grid view with quick access to apartment information

### 2. Monthly Subscription Management
- Configure monthly fee from settings panel
- Automatic calculation of yearly fees per apartment
- Automatic calculation of total yearly income for all apartments
- Real-time financial projections

### 3. Payment Tracking System
- Interactive monthly payment grid (12 months) for each apartment
- Visual payment status: Paid (✓) / Not Paid (✗)
- One-click payment status toggle
- Automatic yearly total calculation per apartment
- Export payment tracking sheet to PDF
- Year-by-year payment history

### 4. Expenses Management
- Add expenses with category, description, amount, and date
- Multiple expense categories:
  - Maintenance
  - Cleaning
  - Electricity
  - Water
  - Repairs
  - Security Guard
  - Elevator Maintenance
  - Garden/Landscaping
  - Insurance
  - Administrative
  - Other
- Automatic calculation of monthly and yearly expenses
- Category-based expense breakdown with visual charts
- Edit and delete expense records

### 5. Financial Dashboard & Reports
- Comprehensive financial overview with key statistics
- Real-time calculations:
  - Total payments collected
  - Total expenses
  - Net balance (Income - Expenses)
  - Surplus/Deficit status
- Monthly financial breakdown table
- Recent expenses overview
- Export complete financial reports to PDF
- Year-over-year comparison

### 6. Settings & Configuration
- Change monthly subscription amount
- Change financial year
- Configure total apartment count
- Real-time calculation preview
- Database setup instructions
- System information display

### 7. User Experience
- Clean, modern UI with professional design
- Fully responsive (mobile, tablet, desktop)
- Intuitive navigation with sidebar menu
- Dynamic updates without page reloads
- Loading states and error handling
- Confirmation dialogs for destructive actions

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom design system
- **Backend & Database**: Supabase (PostgreSQL)
- **State Management**: React Query (@tanstack/react-query)
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **PDF Export**: jsPDF with jspdf-autotable
- **Forms**: Native HTML5 with Tailwind Forms

## 📋 Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier available)
- Modern web browser

## 🚀 Installation & Setup

### 1. Clone or Download the Project

```bash
cd syndec
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the database to be provisioned
3. Go to Project Settings → API
4. Copy your Project URL and anon/public key

### 4. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Set Up Database Schema

1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Open the `supabase-schema.sql` file from this project
4. Copy and paste the entire SQL content into the SQL Editor
5. Click "Run" to execute the schema

This will create:
- `settings` table for configuration
- `apartments` table for apartment data
- `payments` table for payment tracking
- `expense_categories` table for expense types
- `expenses` table for expense records
- All necessary indexes, triggers, and policies

### 6. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📱 Usage Guide

### Initial Setup

1. **Configure Settings**
   - Navigate to Settings page
   - Set your monthly subscription fee
   - Verify the financial year
   - Confirm apartment count

2. **Add Apartments**
   - Go to Apartments page
   - Click "Add Apartment"
   - Enter apartment details
   - Repeat for all units

3. **Track Payments**
   - Navigate to Payments page
   - Click on payment status cells to toggle paid/unpaid
   - Payment grid automatically saves changes
   - Export payment sheet as needed

4. **Record Expenses**
   - Go to Expenses page
   - Click "Add Expense"
   - Select category, enter details
   - View expense breakdown by category

5. **Monitor Dashboard**
   - View real-time financial overview
   - Check monthly breakdown
   - Export comprehensive reports

## 📊 Database Schema

### Tables

- **settings**: System configuration (monthly fee, financial year, apartment count)
- **apartments**: Apartment units and owner information
- **payments**: Monthly payment records with status tracking
- **expense_categories**: Predefined expense categories
- **expenses**: Expense transactions with categorization

### Key Features

- Row Level Security (RLS) enabled on all tables
- Automatic timestamp tracking with triggers
- Cascading deletes for data integrity
- Optimized indexes for fast queries
- UUID primary keys for scalability

## 🎨 Design System

### Colors

- **Primary**: Blue (#2563eb)
- **Success**: Green
- **Danger**: Red
- **Warning**: Orange
- **Info**: Purple

### Components

- Reusable button styles (btn-primary, btn-secondary, btn-danger)
- Consistent card layouts
- Standardized form inputs
- Responsive tables and grids

## 📦 Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist` folder.

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
4. Deploy

### Deploy to Netlify

1. Push your code to GitHub
2. Import project in Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables
6. Deploy

## 🔒 Security Notes

- Never commit your `.env.local` file
- Keep your Supabase keys secure
- Review and adjust Row Level Security policies for production
- Consider implementing authentication for multi-user access
- Regularly backup your database

## 🎯 Future Enhancements

- User authentication and role-based access control
- Email notifications for payment reminders
- Automated recurring expense tracking
- Budget planning and forecasting
- Multi-building management
- Mobile app (React Native)
- Document storage and management
- Meeting minutes and voting system

## 📄 License

This project is provided as-is for building management purposes.

## 🤝 Support

For issues or questions:
1. Check the database setup in Supabase
2. Verify environment variables are correct
3. Review browser console for errors
4. Check Supabase logs for database issues

## 📝 Version History

- **v1.0.0** (2025) - Initial release
  - Complete apartment management
  - Payment tracking system
  - Expense management
  - Financial dashboard
  - PDF export functionality
  - Responsive design

---

Built with ❤️ for efficient building management
"# syndec" 
