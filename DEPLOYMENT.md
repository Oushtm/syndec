# Deployment Guide - Syndic Manager

This guide will help you deploy your Syndic Manager application to production.

## Prerequisites

Before deploying, ensure:
- ✅ Your Supabase database is set up and working
- ✅ You have tested the application locally
- ✅ You have your Supabase credentials ready
- ✅ You have chosen a hosting platform

## Recommended Hosting Platforms

### Option 1: Vercel (Recommended)

**Why Vercel?**
- Free tier available
- Automatic HTTPS
- Global CDN
- Zero configuration for Vite
- Environment variables support
- Automatic deployments from Git

**Deployment Steps:**

1. **Prepare Your Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Push to GitHub**
   - Create a new repository on GitHub
   - Push your code:
   ```bash
   git remote add origin https://github.com/yourusername/syndec.git
   git branch -M main
   git push -u origin main
   ```

3. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your repository
   - Configure project:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Add Environment Variables:
     - `VITE_SUPABASE_URL`: Your Supabase URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app is live! 🎉

4. **Custom Domain (Optional)**
   - In Vercel dashboard, go to Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed
   - Automatic HTTPS certificate

---

### Option 2: Netlify

**Why Netlify?**
- Free tier available
- Easy deployment
- Form handling
- Serverless functions support
- Automatic HTTPS

**Deployment Steps:**

1. **Prepare Your Repository** (same as Vercel)

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/Login
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub
   - Select your repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Add Environment Variables:
     - `VITE_SUPABASE_URL`: Your Supabase URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
   - Click "Deploy site"
   - Your app is live! 🎉

3. **Custom Domain (Optional)**
   - Go to Site settings → Domain management
   - Add custom domain
   - Follow DNS configuration steps

---

### Option 3: GitHub Pages

**Why GitHub Pages?**
- Free hosting
- Integrated with GitHub
- Simple setup

**Deployment Steps:**

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   Add these scripts:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. **Update vite.config.js**
   Add base URL:
   ```javascript
   export default defineConfig({
     base: '/syndec/',
     plugins: [react()],
   })
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

5. **Configure GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from branch
   - Branch: gh-pages
   - Save

6. **Add Environment Variables**
   - GitHub Pages doesn't support environment variables
   - For production, consider using Vercel or Netlify instead
   - Or hardcode values (not recommended for security)

---

### Option 4: Self-Hosted (VPS/Cloud)

**Platforms:** DigitalOcean, AWS, Google Cloud, Azure, Linode

**Deployment Steps:**

1. **Build the Application**
   ```bash
   npm run build
   ```
   This creates a `dist` folder with static files.

2. **Set Up Web Server**

   **Using Nginx:**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       root /var/www/syndec/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

   **Using Apache:**
   ```apache
   <VirtualHost *:80>
       ServerName yourdomain.com
       DocumentRoot /var/www/syndec/dist
       
       <Directory /var/www/syndec/dist>
           Options Indexes FollowSymLinks
           AllowOverride All
           Require all granted
       </Directory>
   </VirtualHost>
   ```

3. **Upload Files**
   ```bash
   scp -r dist/* user@yourserver:/var/www/syndec/dist/
   ```

4. **Configure HTTPS**
   - Use Let's Encrypt (free):
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

5. **Environment Variables**
   - Build with environment variables:
   ```bash
   VITE_SUPABASE_URL=your_url VITE_SUPABASE_ANON_KEY=your_key npm run build
   ```

---

## Docker Deployment

**Dockerfile:**
```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Build and Run:**
```bash
docker build --build-arg VITE_SUPABASE_URL=your_url \
             --build-arg VITE_SUPABASE_ANON_KEY=your_key \
             -t syndec .
docker run -p 80:80 syndec
```

---

## Post-Deployment Checklist

### Security

- [ ] Environment variables are set correctly
- [ ] No sensitive data in code
- [ ] HTTPS is enabled
- [ ] Supabase RLS policies are active
- [ ] API keys are not exposed in frontend code

### Performance

- [ ] Test loading speed
- [ ] Check mobile responsiveness
- [ ] Verify all images load
- [ ] Test on different browsers
- [ ] Check console for errors

### Functionality

- [ ] Test all CRUD operations
- [ ] Verify payment tracking works
- [ ] Test PDF export functionality
- [ ] Check calculations are correct
- [ ] Test year switching

### Database

- [ ] Supabase project is on paid plan (for production)
- [ ] Database backups are enabled
- [ ] Connection pooling is configured
- [ ] Indexes are created (from schema)

### Monitoring

- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Configure analytics (Google Analytics, Plausible)
- [ ] Set up uptime monitoring
- [ ] Enable Supabase logs

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | `eyJhbGc...` |

⚠️ **Never commit these to version control!**

---

## Continuous Deployment

### Automatic Deployments with Vercel/Netlify

Once set up, every push to your main branch will:
1. Trigger a new build
2. Run tests (if configured)
3. Deploy automatically
4. Provide a preview URL

### GitHub Actions (Advanced)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      env:
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      run: npm run build
    
    - name: Deploy
      # Add your deployment steps here
```

---

## Troubleshooting Deployment Issues

### Build Fails

**Error: "Cannot find module"**
- Solution: Run `npm install` locally first
- Check package.json for all dependencies

**Error: "Environment variable not found"**
- Solution: Add environment variables in hosting platform
- Verify variable names start with `VITE_`

### Runtime Errors

**Error: "Failed to fetch"**
- Check Supabase URL is correct
- Verify Supabase project is active
- Check CORS settings in Supabase

**Error: "Invalid API key"**
- Verify anon key is correct
- Check environment variables are set
- Ensure no extra spaces in keys

### Performance Issues

**Slow Loading**
- Enable CDN on hosting platform
- Optimize images
- Check Supabase region (should be close to users)
- Consider upgrading Supabase plan

---

## Scaling Considerations

### For 100+ Apartments

- Upgrade Supabase to paid plan
- Enable connection pooling
- Consider pagination for large lists
- Add search functionality

### For Multiple Buildings

- Add building_id to database schema
- Implement building selection
- Separate data per building
- Consider multi-tenancy

### For High Traffic

- Use CDN for static assets
- Enable caching headers
- Optimize database queries
- Consider serverless functions for heavy operations

---

## Backup Strategy

### Automated Backups

1. **Supabase Backups**
   - Enable in Supabase dashboard
   - Daily automatic backups
   - Point-in-time recovery

2. **Manual Backups**
   ```bash
   # Export from Supabase
   pg_dump -h db.xxxxx.supabase.co -U postgres -d postgres > backup.sql
   ```

3. **Code Backups**
   - Use Git for version control
   - Regular commits
   - Multiple remotes (GitHub + GitLab)

---

## Support & Maintenance

### Regular Maintenance

- Update dependencies monthly
- Review Supabase logs weekly
- Check error reports
- Test critical features
- Update documentation

### User Support

- Provide user manual
- Create video tutorials
- Set up support email
- Document common issues

---

## Success Metrics

Track these after deployment:

- [ ] Uptime percentage (target: 99.9%)
- [ ] Page load time (target: < 3 seconds)
- [ ] User satisfaction
- [ ] Error rate (target: < 0.1%)
- [ ] Database response time

---

🎉 **Congratulations on deploying Syndic Manager!**

For questions or issues, refer to the main README.md or SETUP_GUIDE.md.

