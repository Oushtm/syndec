# Frequently Asked Questions (FAQ)

## General Questions

### What is Syndic Manager?
Syndic Manager is a web-based application designed to help building homeowners associations manage their finances, track payments, monitor expenses, and generate reports. It's specifically built for residential buildings with multiple apartment units.

### Who should use this application?
- Building managers
- Homeowners association boards
- Property management companies
- Syndic administrators
- Building treasurers

### How much does it cost?
The application itself is free and open-source. However, you'll need:
- Supabase account (free tier available, supports up to 500MB database)
- Hosting (Vercel/Netlify free tiers available)
- Total cost: $0 for small buildings, ~$25/month for larger buildings

### What languages is it available in?
Currently, the application is in English. The modular design makes it easy to add translations in the future.

---

## Technical Questions

### What technologies are used?
- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **State Management**: React Query
- **Routing**: React Router
- **PDF Generation**: jsPDF
- **Icons**: Lucide React

### Do I need coding knowledge to use it?
No! The application is designed for non-technical users. However, initial setup requires following instructions to configure Supabase and deploy the application.

### Can I use it offline?
No, the application requires an internet connection to sync with the Supabase database. However, once loaded, basic navigation works offline until you try to save data.

### What browsers are supported?
All modern browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

Minimum versions: Released within the last 2 years.

### Is it mobile-friendly?
Yes! The application is fully responsive and works on:
- Smartphones (iOS, Android)
- Tablets
- Desktop computers
- Laptops

---

## Setup & Installation

### How long does setup take?
- First-time setup: 10-15 minutes
- If you already have Supabase: 5 minutes
- Subsequent deployments: 2 minutes

### Do I need to install anything on my computer?
For development:
- Node.js 18 or higher
- A code editor (optional)

For usage:
- Just a web browser!

### Can I use a different database?
The application is built specifically for Supabase. While you could adapt it to use another PostgreSQL database, it would require code modifications.

### What if I don't want to use Supabase?
Supabase is integral to the application's architecture. Alternative options would require significant code changes. We recommend using Supabase's generous free tier.

---

## Features & Usage

### How many apartments can I manage?
The system is designed to scale from 1 to 1000+ apartments. The default is 31, but you can adjust this in Settings.

### Can I manage multiple buildings?
Currently, the application is designed for single-building management. Multi-building support would require database schema modifications.

### Can I track partial payments?
Currently, the system tracks full monthly payments only (paid/not paid). Partial payment tracking would require customization.

### Can I set different fees for different apartments?
Not currently. All apartments use the same monthly fee. This feature could be added with custom development.

### How do I handle late fees?
You can add late fees as expenses in the Expenses section, or manually adjust payment amounts.

### Can I track utility bills separately?
Yes! Add them as expenses with the appropriate category (Electricity, Water, etc.).

### Can residents view their own payment history?
Not in the current version. The system is designed for administrator use. Resident portals could be added with authentication.

### How do I handle move-ins and move-outs?
Simply update the apartment owner information in the Apartments section when ownership changes.

---

## Data & Security

### Where is my data stored?
Your data is stored in your Supabase PostgreSQL database, which is hosted on AWS in the region you selected during setup.

### Is my data secure?
Yes! Supabase provides:
- Encrypted connections (HTTPS)
- Row Level Security (RLS)
- Regular backups
- Industry-standard security practices

### Who can access my data?
Only people with:
1. Your Supabase credentials
2. Access to your deployed application URL

For production, implement authentication to restrict access.

### How do I backup my data?
- **Automatic**: Supabase provides automatic backups (paid plans)
- **Manual**: Export tables as CSV from Supabase dashboard
- **Database dump**: Use pg_dump for complete backups

### Can I export my data?
Yes! You can:
- Export financial reports as PDF
- Export payment sheets as PDF
- Export database tables as CSV from Supabase
- Use the Supabase API to extract data

### What happens if I delete something by mistake?
Deletions are permanent. The system asks for confirmation before deleting, but there's no undo feature. Regular backups are recommended.

---

## Payments & Financial

### How do I record a payment?
Go to the Payments page and click on the cell for the apartment and month. A green checkmark means paid.

### Can I see payment history?
Yes! Use the year selector to view payment history for previous years.

### How are balances calculated?
- **Income**: Sum of all payments marked as "paid"
- **Expenses**: Sum of all recorded expenses
- **Balance**: Income - Expenses

### Can I handle multiple payment methods?
The system tracks payment status (paid/not paid) but doesn't track payment methods. You could add this information in apartment notes or as an expense category.

### How do I handle refunds?
Record refunds as negative expenses or add a note in the expense description.

### Can I set up recurring expenses?
Not automatically. You need to manually add recurring expenses each month. This could be automated with custom development.

### How do I track reserve funds?
The balance shown includes all funds. You could create a separate expense category for "Reserve Fund Allocation" to track this.

---

## Reports & Export

### What reports can I generate?
1. **Financial Report**: Complete overview with income, expenses, and balance
2. **Payment Tracking Sheet**: Grid showing payment status for all apartments

### Can I customize reports?
The PDF reports have a standard format. Customization requires code modifications in `src/utils/pdfExport.js`.

### Can I export to Excel?
Currently, only PDF export is supported. Excel export could be added with additional libraries.

### Can I print reports?
Yes! The PDF reports are print-ready. You can also print directly from the browser.

### How often should I generate reports?
- Monthly: For board meetings
- Quarterly: For detailed reviews
- Yearly: For annual reports and audits

---

## Troubleshooting

### The application won't start
1. Check Node.js is installed: `node --version`
2. Delete `node_modules` folder
3. Run `npm install` again
4. Run `npm run dev`

### I get "Invalid API key" error
1. Check `.env.local` file exists
2. Verify Supabase URL and key are correct
3. Ensure no extra spaces in credentials
4. Restart the development server

### Data isn't saving
1. Check browser console (F12) for errors
2. Verify Supabase project is active (not paused)
3. Check internet connection
4. Verify database tables were created

### PDF export isn't working
1. Check browser console for errors
2. Ensure jsPDF library is installed
3. Try a different browser
4. Check for popup blockers

### The page is blank
1. Check browser console for errors
2. Verify all dependencies are installed
3. Check `.env.local` file is configured
4. Clear browser cache

### Payments aren't toggling
1. Check internet connection
2. Verify Supabase connection
3. Check browser console for errors
4. Refresh the page

---

## Customization

### Can I change the currency?
Yes, but requires code modification. Search for "$" in the codebase and replace with your currency symbol.

### Can I change the color scheme?
Yes! Modify `tailwind.config.js` to change the primary color. The current theme uses blue (#2563eb).

### Can I add more expense categories?
Yes! Add them directly in Supabase:
1. Go to Table Editor → expense_categories
2. Insert new row with category name

### Can I change the number of months?
The system is designed for 12-month tracking. Changing this would require significant code modifications.

### Can I add custom fields to apartments?
Yes, but requires database schema changes:
1. Add column in Supabase
2. Update React components
3. Update forms and displays

---

## Performance

### How fast is the application?
- Initial load: 1-3 seconds
- Page navigation: Instant
- Data updates: < 1 second
- PDF generation: 2-5 seconds

### Can it handle 100+ apartments?
Yes! The database is optimized with indexes. Performance should remain good up to 500+ apartments.

### What if the application is slow?
1. Check internet connection
2. Verify Supabase region (choose closest to you)
3. Consider upgrading Supabase plan
4. Check browser performance (close other tabs)

### Does it work on slow internet?
The application works on 3G connections, but may be slower. 4G or WiFi recommended for best experience.

---

## Updates & Maintenance

### How do I update the application?
1. Pull latest code from repository
2. Run `npm install` for new dependencies
3. Run `npm run build`
4. Deploy updated version

### Do I need to update the database?
Only if the schema changes. Check release notes for migration instructions.

### How often should I backup data?
- Daily: For active buildings
- Weekly: For smaller buildings
- Before major changes: Always

### What maintenance is required?
- Update dependencies: Monthly
- Review logs: Weekly
- Backup data: Daily/Weekly
- Test critical features: After updates

---

## Support & Community

### Where can I get help?
1. Read the documentation (README.md, SETUP_GUIDE.md)
2. Check this FAQ
3. Review browser console errors
4. Check Supabase logs

### Can I request features?
Yes! The application is designed to be extensible. Feature requests can be implemented with custom development.

### Is there a user manual?
This documentation serves as the user manual. Key files:
- README.md: Overview and features
- SETUP_GUIDE.md: Detailed setup
- QUICK_START.md: Fast setup
- FEATURES.md: Complete feature list

### Can I contribute to the project?
The codebase is modular and well-documented, making it easy to add features or improvements.

---

## Best Practices

### How should I organize expenses?
- Use appropriate categories
- Add detailed descriptions
- Record expenses promptly
- Review monthly for accuracy

### How often should I update payment status?
- Update as payments are received
- Review monthly for accuracy
- Export reports before board meetings

### What should I backup?
- Database (via Supabase)
- Environment variables (securely)
- Exported reports (PDFs)
- Custom code modifications

### Security recommendations
1. Use strong Supabase password
2. Don't share credentials
3. Implement authentication for production
4. Regular security audits
5. Keep dependencies updated

---

## Future Plans

### Planned Features
- User authentication
- Email notifications
- Automated recurring expenses
- Budget forecasting
- Mobile app
- Multi-building support
- Document storage
- Advanced analytics

### Timeline
These features can be added based on needs and resources. The modular architecture makes additions straightforward.

---

## Still Have Questions?

If your question isn't answered here:
1. Check the README.md for technical details
2. Review the code comments
3. Check Supabase documentation
4. Review React and Vite documentation

---

**Last Updated**: December 2025
**Version**: 1.0.0

