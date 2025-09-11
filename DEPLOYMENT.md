# Deployment Guide for TenthProject

This guide will help you deploy your TenthProject to various platforms.

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended for Next.js)

1. **Create a GitHub Repository:**
   - Go to [GitHub](https://github.com) and create a new repository
   - Name it `tenthproject` or your preferred name
   - Don't initialize with README (we already have one)

2. **Push your code to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/tenthproject.git
   git branch -M main
   git push -u origin main
   ```

3. **Deploy to Vercel:**
   - Go to [Vercel](https://vercel.com)
   - Sign up/Login with your GitHub account
   - Click "New Project"
   - Import your `tenthproject` repository
   - Configure environment variables (see below)
   - Click "Deploy"

### Option 2: Netlify

1. **Push to GitHub** (same as above)

2. **Deploy to Netlify:**
   - Go to [Netlify](https://netlify.com)
   - Sign up/Login with your GitHub account
   - Click "New site from Git"
   - Choose your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Configure environment variables
   - Click "Deploy site"

### Option 3: Railway

1. **Push to GitHub** (same as above)

2. **Deploy to Railway:**
   - Go to [Railway](https://railway.app)
   - Sign up/Login with your GitHub account
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your repository
   - Configure environment variables
   - Deploy

## 🔧 Environment Variables Setup

You'll need to configure these environment variables in your deployment platform:

### Required Variables:
```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# NextAuth.js
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key-here

# Stripe (for payments)
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Optional Variables:
```env
# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Email (for notifications)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@your-domain.com
```

## 🗄️ Database Setup

### Option 1: Vercel Postgres (Recommended)
1. In your Vercel dashboard, go to Storage
2. Create a new Postgres database
3. Copy the connection string to `DATABASE_URL`

### Option 2: Supabase
1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string to `DATABASE_URL`

### Option 3: Railway Postgres
1. In Railway, add a Postgres service
2. Copy the connection string to `DATABASE_URL`

### Option 4: PlanetScale
1. Go to [PlanetScale](https://planetscale.com)
2. Create a new database
3. Copy the connection string to `DATABASE_URL`

## 🚀 Post-Deployment Steps

1. **Run Database Migrations:**
   ```bash
   npx prisma db push
   ```

2. **Seed the Database (Optional):**
   ```bash
   npm run db:seed
   ```

3. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

## 🔐 Security Checklist

- [ ] Set strong `NEXTAUTH_SECRET`
- [ ] Use HTTPS in production
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable database SSL
- [ ] Use environment variables for all secrets
- [ ] Set up monitoring and logging

## 📊 Monitoring & Analytics

Consider adding:
- **Vercel Analytics** for performance monitoring
- **Sentry** for error tracking
- **Google Analytics** for user analytics
- **Uptime monitoring** (UptimeRobot, Pingdom)

## 🔄 CI/CD Pipeline

The project includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that:
- Runs tests and linting on every push
- Builds the application
- Deploys to Vercel on main branch pushes

To enable:
1. Add these secrets to your GitHub repository:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

## 🆘 Troubleshooting

### Common Issues:

1. **Build Fails:**
   - Check environment variables are set
   - Ensure all dependencies are in package.json
   - Check Node.js version compatibility

2. **Database Connection Issues:**
   - Verify DATABASE_URL format
   - Check database is accessible from deployment platform
   - Ensure SSL is configured if required

3. **Authentication Issues:**
   - Verify NEXTAUTH_URL matches your domain
   - Check OAuth provider configurations
   - Ensure callback URLs are correct

4. **Static Assets Not Loading:**
   - Check public folder is included
   - Verify asset paths in code
   - Check CDN configuration

## 📞 Support

If you encounter issues:
1. Check the deployment platform logs
2. Review environment variable configuration
3. Test locally with production environment variables
4. Check GitHub Issues for similar problems

---

**Happy Deploying! 🚀**
