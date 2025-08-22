# 🚀 Deploying to Vercel

This guide will walk you through deploying your Virtual Event Management API to Vercel.

## 📋 Prerequisites

- [Vercel Account](https://vercel.com/signup) (free)
- [Git](https://git-scm.com/) installed
- [Node.js](https://nodejs.org/) (v14 or higher)
- [Vercel CLI](https://vercel.com/docs/cli) (optional but recommended)

## 🚀 Quick Deployment

### Option 1: Deploy via Vercel Dashboard (Recommended for beginners)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect it's a Node.js project

3. **Configure Environment Variables**
   - In your Vercel project dashboard, go to Settings → Environment Variables
   - Add the following variables:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   JWT_SECRET=your-super-secure-secret
   NODE_ENV=production
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your API

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? `Y`
   - Which scope? `Select your account`
   - Link to existing project? `N`
   - Project name: `virtual-event-management-api`
   - Directory: `./` (current directory)
   - Override settings? `N`

5. **Set Environment Variables**
   ```bash
   vercel env add EMAIL_USER
   vercel env add EMAIL_PASS
   vercel env add JWT_SECRET
   vercel env add NODE_ENV
   ```

6. **Redeploy with environment variables**
   ```bash
   vercel --prod
   ```

## 🔧 Configuration Files

### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "app.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "app.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### package.json Updates
```json
{
  "scripts": {
    "start": "node app.js",
    "build": "echo 'No build step required'"
  }
}
```

## 🌍 Environment Variables

Set these in your Vercel dashboard:

| Variable | Description | Example |
|----------|-------------|---------|
| `EMAIL_USER` | Your Gmail address | `yourname@gmail.com` |
| `EMAIL_PASS` | Gmail app password | `abcd efgh ijkl mnop` |
| `JWT_SECRET` | Strong secret for JWT | `your-super-secure-secret-here` |
| `NODE_ENV` | Environment | `production` |

## 📱 Testing Your Deployed API

### 1. **Get Your API URL**
After deployment, Vercel will provide you with a URL like:
```
https://your-project-name.vercel.app
```

### 2. **Test the Endpoints**
```bash
# Test the root endpoint
curl https://your-project-name.vercel.app/

# Test user registration
curl -X POST https://your-project-name.vercel.app/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "participant"
  }'
```

### 3. **Update Your Frontend**
Replace `http://localhost:3000` with your Vercel URL in your frontend code.

## 🔍 Troubleshooting

### Common Issues

#### 1. **Build Failures**
- Check that all dependencies are in `package.json`
- Ensure `vercel.json` is properly configured
- Check Vercel build logs for specific errors

#### 2. **Environment Variables Not Working**
- Verify variables are set in Vercel dashboard
- Check variable names match exactly
- Redeploy after setting environment variables

#### 3. **API Endpoints Not Found**
- Ensure `vercel.json` routes are correct
- Check that `app.js` is properly exported
- Verify the build output

#### 4. **Email Not Working**
- Check Gmail app password is correct
- Verify 2FA is enabled on Gmail
- Check Vercel function logs for email errors

### Debugging Steps

1. **Check Vercel Function Logs**
   - Go to your project dashboard
   - Click on Functions tab
   - Check for error logs

2. **Test Locally with Production Environment**
   ```bash
   NODE_ENV=production node app.js
   ```

3. **Verify Environment Variables**
   ```bash
   vercel env ls
   ```

## 🚀 Production Considerations

### 1. **Custom Domain**
- Add custom domain in Vercel dashboard
- Configure DNS settings
- Enable HTTPS (automatic with Vercel)

### 2. **Monitoring**
- Use Vercel Analytics
- Monitor function execution times
- Set up alerts for errors

### 3. **Scaling**
- Vercel automatically scales
- Monitor usage limits
- Consider upgrading plan if needed

### 4. **Security**
- Use strong JWT secrets
- Implement rate limiting
- Monitor API usage

## 📊 Performance Optimization

### 1. **Cold Start Optimization**
- Keep dependencies minimal
- Use efficient imports
- Optimize database queries

### 2. **Caching**
- Implement response caching
- Use Vercel's edge caching
- Cache frequently accessed data

### 3. **Bundle Optimization**
- Remove unused dependencies
- Use tree shaking
- Minimize bundle size

## 🔄 Continuous Deployment

### 1. **Automatic Deployments**
- Vercel automatically deploys on git push
- Configure deployment branches
- Set up preview deployments

### 2. **Environment-Specific Deployments**
- Use different environment variables per branch
- Set up staging environments
- Test before production deployment

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Node.js on Vercel](https://vercel.com/docs/runtimes#official-runtimes/node-js)
- [Environment Variables](https://vercel.com/docs/environment-variables)
- [Vercel CLI](https://vercel.com/docs/cli)

## 🆘 Support

If you encounter issues:

1. Check Vercel function logs
2. Verify environment variables
3. Test locally with production settings
4. Check Vercel status page
5. Contact Vercel support

---

**Happy Deploying! 🚀**

Your API will be available at: `https://your-project-name.vercel.app`
