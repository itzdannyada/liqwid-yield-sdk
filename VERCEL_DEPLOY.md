# Vercel Deployment Guide

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel CLI (Recommended)

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from your project directory:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Choose your account
   - Link to existing project? **N** 
   - Project name: **liqwid-sdk-demo** (or your preference)
   - Directory: **./** (current directory)
   - Want to override settings? **N**

### Option 2: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

### Option 3: Deploy via GitHub Integration

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Vercel will auto-deploy on every push to main/master

## Environment Variables

If you need environment variables, add them in:
- Vercel Dashboard → Project Settings → Environment Variables
- Or use the `.env.production` file (already created)

## Custom Domain (Optional)

After deployment, you can add a custom domain:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

## Build Configuration

The `vercel.json` file is already configured with:
- Build command: `npm run build:demo` 
- Output directory: `build`
- SPA routing support

## Troubleshooting

- **Build fails**: Check that all dependencies are in `package.json`
- **404 on refresh**: The `vercel.json` rewrites handle SPA routing
- **Assets not loading**: Check the homepage URL in `package.json`