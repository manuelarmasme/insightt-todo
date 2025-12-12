# 🚀 Deployment Guide - AWS Amplify

Complete step-by-step guide for deploying your Next.js Todo App to AWS Amplify.

## 📋 Pre-Deployment Checklist

### 1. Environment Setup ✅

**Required Environment Variables:**
```env
# Production MongoDB (MongoDB Atlas recommended)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=insightt-todo-production

# AWS Cognito (from amplify_outputs.json or Cognito Console)
DATABASE_AWS_COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
DATABASE_AWS_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
```

**⚠️ DO NOT include test credentials in production!**

### 2. MongoDB Atlas Setup ✅

1. **Create Production Database**
   - Log in to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Create a new cluster (or use existing)
   - Create database: `insightt-todo-production`
   - Create collection: `tasks`

2. **Configure Network Access**
   - Go to Security → Network Access
   - Add IP Address: `0.0.0.0/0` (Allow from anywhere)
   - **Why:** AWS Amplify uses dynamic IPs
   
3. **Create Database User**
   - Go to Security → Database Access
   - Add new user with read/write permissions
   - Save credentials for `MONGODB_URI`

4. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with actual password
   - Add database name at the end

   **Example:**
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/insightt-todo-production?retryWrites=true&w=majority
   ```

### 3. AWS Cognito Configuration ✅

**Option A: Use Existing Cognito Pool (Recommended)**

If you already ran `pnpm sandbox`:
1. Get values from `amplify_outputs.json`:
   ```json
   {
     "auth": {
       "user_pool_id": "us-east-1_xxxxxxxxx",
       "user_pool_client_id": "xxxxxxxxxxxxxxxxxx"
     }
   }
   ```
2. Use these values in Amplify environment variables

**Option B: Create New Cognito Pool**

1. Go to [AWS Cognito Console](https://console.aws.amazon.com/cognito/)
2. Create User Pool:
   - Sign-in options: Email
   - Password requirements: Minimum 8 characters
   - MFA: Optional (recommended for production)
   - Email provider: Cognito (or SES for custom)
3. Create App Client:
   - No client secret
   - Enable username/password auth
4. Save User Pool ID and Client ID

### 4. Update Cognito Callback URLs ✅

**After getting your Amplify URL**, add it to Cognito:

1. Go to Cognito Console → Your User Pool → App Integration
2. Find your App Client
3. Edit "Hosted UI" settings
4. Add Amplify URLs to:
   - **Callback URLs:**
     ```
     https://main.xxxxxx.amplifyapp.com
     https://your-custom-domain.com
     ```
   - **Sign-out URLs:**
     ```
     https://main.xxxxxx.amplifyapp.com
     https://your-custom-domain.com
     ```

### 5. Test Local Build ✅

Before deploying, ensure the app builds successfully:

```bash
# Clean build
rm -rf .next node_modules/.cache

# Install dependencies
pnpm install

# Build for production
pnpm build

# Test production build
pnpm start
```

**Check for:**
- ✅ No build errors
- ✅ No TypeScript errors
- ✅ All pages load correctly
- ✅ Authentication works
- ✅ CRUD operations work

### 6. Commit All Changes ✅

```bash
# Check git status
git status

# Add all changes
git add .

# Commit
git commit -m "chore: prepare for deployment"

# Push to GitHub
git push origin main
```

---

## 🌐 Deploy to AWS Amplify

### Step 1: Access Amplify Console

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Sign in with your AWS account
3. Select region (same as your Cognito pool)

### Step 2: Create New App

1. Click **"New app"** → **"Host web app"**
2. Select **GitHub** as source
3. Click **"Continue"**
4. Authorize AWS Amplify to access your GitHub

### Step 3: Select Repository

1. Choose repository: **`manuelarmasme/insightt-todo`**
2. Select branch: **`main`** (or your production branch)
3. Click **"Next"**

### Step 4: Configure Build Settings

Amplify auto-detects Next.js. Verify/update the build settings:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install -g pnpm@latest
        - pnpm install --frozen-lockfile
    build:
      commands:
        - pnpm build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
      - .pnpm-store/**/*
```

**Key Points:**
- ✅ Use `pnpm` for consistency
- ✅ Use `--frozen-lockfile` to ensure exact dependencies
- ✅ Cache `.next/cache` for faster builds

### Step 5: Advanced Settings - Environment Variables

**⚠️ CRITICAL STEP - Add all environment variables:**

Click **"Advanced settings"** → **"Environment variables"**

Add each variable:

| Variable | Value | Example |
|----------|-------|---------|
| `MONGODB_URI` | Your MongoDB connection string | `mongodb+srv://user:pass@...` |
| `MONGODB_DB_NAME` | Database name | `insightt-todo-production` |
| `DATABASE_AWS_COGNITO_USER_POOL_ID` | Cognito User Pool ID | `us-east-1_xxxxxxxxx` |
| `DATABASE_AWS_COGNITO_CLIENT_ID` | Cognito App Client ID | `xxxxxxxxxxxxxxxxx` |

**Tips:**
- ✅ No quotes around values
- ✅ No trailing spaces
- ✅ Copy-paste to avoid typos
- ✅ Use production database (not test DB)

### Step 6: Deploy

1. Click **"Next"**
2. Review all settings
3. Click **"Save and deploy"**

**Deployment Process:**
1. **Provision** (~1 min) - Sets up infrastructure
2. **Build** (~5-8 mins) - Runs `pnpm build`
3. **Deploy** (~1-2 mins) - Deploys to CDN
4. **Verify** (~30 secs) - Health checks

**Total time: ~8-12 minutes**

### Step 7: Post-Deployment Verification

Once deployed, you'll get an Amplify URL like:
```
https://main.d1234567890abc.amplifyapp.com
```

**Test the following:**

#### 1. Homepage Loads
- Visit the Amplify URL
- Should see the login page
- Check browser console for errors

#### 2. Sign Up Flow
- Click "Sign Up"
- Create a test account
- Verify email confirmation works
- Complete sign-up

#### 3. Authentication
- Log in with test account
- Should redirect to task page
- Check for any errors

#### 4. CRUD Operations
- Create a task
- Edit the task
- Mark as done (check green color)
- Delete the task

#### 5. Check Logs
In Amplify Console:
- Click your app
- Click the deployment
- View "Build logs" for build issues
- Check CloudWatch Logs for runtime errors

---

## 🔧 Configuration & Optimization

### Custom Domain Setup

1. In Amplify Console → **"Domain management"**
2. Click **"Add domain"**
3. Enter your domain (e.g., `todo.yourdomain.com`)
4. Amplify provides DNS records
5. Add records to your DNS provider:
   ```
   Type: CNAME
   Name: todo
   Value: xxxxx.cloudfront.net
   ```
6. Wait for SSL certificate (5-10 mins)

### Enable HTTPS (Automatic)
- Amplify automatically provisions SSL certificates
- Forces HTTPS redirect
- No configuration needed!

### Performance Optimization

**1. Enable Compression**
- Already handled by Amplify CDN
- Gzip compression for all assets

**2. Image Optimization**
If you add images later:
```typescript
// next.config.ts
const nextConfig = {
  images: {
    domains: ['your-domain.com'],
    formats: ['image/avif', 'image/webp'],
  },
};
```

**3. Caching Strategy**
Next.js handles caching automatically:
- Static pages: Cached at CDN
- API routes: No caching (always fresh)
- Assets: Immutable caching

### Environment Variables Per Branch

For different environments (staging/production):

1. In Amplify Console → **"Environment variables"**
2. Can set different values per branch:
   - `main` branch → Production DB
   - `staging` branch → Staging DB

---

## 🐛 Troubleshooting Deployment Issues

### Build Fails: "Module not found"

**Problem:** Missing dependencies

**Solution:**
```bash
# Locally, check package.json
pnpm list

# Ensure all imports have corresponding packages
# Rebuild locally to verify
pnpm build
```

### Build Fails: "ENOENT: no such file or directory"

**Problem:** Case-sensitive file paths

**Solution:**
- Check all import statements match actual file names
- Linux is case-sensitive (macOS/Windows are not)
- Example: `./Component.tsx` vs `./component.tsx`

### MongoDB Connection Error

**Problem:** Can't connect to MongoDB

**Solutions:**

1. **Check Network Access in MongoDB Atlas:**
   ```
   Security → Network Access → Add 0.0.0.0/0
   ```

2. **Verify MONGODB_URI format:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
   ```

3. **Check environment variable in Amplify:**
   - No extra spaces
   - No quotes
   - Exact copy from MongoDB Atlas

4. **Test connection locally:**
   ```bash
   # Use same MONGODB_URI from Amplify
   MONGODB_URI="your-uri" pnpm dev
   ```

### Cognito Authentication Fails

**Problem:** Login redirects fail or show errors

**Solutions:**

1. **Update Cognito Callback URLs:**
   - Add your Amplify URL to allowed callbacks
   - Format: `https://main.xxxxx.amplifyapp.com`

2. **Check environment variables:**
   ```bash
   # In Amplify Console
   DATABASE_AWS_COGNITO_USER_POOL_ID=us-east-1_xxxxx
   DATABASE_AWS_COGNITO_CLIENT_ID=xxxxxxxxx
   ```

3. **Verify User Pool region:**
   - Must match Amplify region
   - Check in Cognito Console

### Environment Variables Not Working

**Problem:** App can't read env variables

**Solutions:**

1. **Check variable names match exactly:**
   - `MONGODB_URI` not `MONGO_URI`
   - Case-sensitive!

2. **Redeploy after adding variables:**
   - In Amplify Console → **"Redeploy this version"**
   - Environment changes require redeployment

3. **Verify in build logs:**
   ```
   # Look for: "Environment variables:"
   # Should list your variables (values hidden)
   ```

### 404 on Dynamic Routes

**Problem:** `/[user]` routes return 404

**Solutions:**

1. **Verify folder structure:**
   ```
   app/
   └── [user]/
       ├── page.tsx
       └── layout.tsx
   ```

2. **Check Next.js config:**
   ```typescript
   // next.config.ts should be minimal
   const nextConfig = {};
   export default nextConfig;
   ```

3. **Rebuild and redeploy:**
   ```bash
   git commit --allow-empty -m "trigger rebuild"
   git push
   ```

### Build Takes Too Long / Times Out

**Problem:** Build exceeds 30 minutes

**Solutions:**

1. **Reduce dependencies:**
   ```bash
   # Check bundle size
   pnpm build
   # Look for large packages
   ```

2. **Enable caching:**
   ```yaml
   # In build settings
   cache:
     paths:
       - node_modules/**/*
       - .next/cache/**/*
   ```

3. **Use frozen lockfile:**
   ```yaml
   preBuild:
     commands:
       - pnpm install --frozen-lockfile
   ```

### Memory Errors During Build

**Problem:** "JavaScript heap out of memory"

**Solution:**

Update build command in Amplify settings:
```yaml
build:
  commands:
    - NODE_OPTIONS="--max-old-space-size=4096" pnpm build
```

---

## 📊 Monitoring & Maintenance

### View Build Logs

1. Amplify Console → Your App
2. Click deployment
3. **"Build logs"** shows:
   - npm/pnpm install output
   - Build process
   - Error messages

### View Runtime Logs

1. Amplify Console → Your App
2. **"Monitoring"** tab
3. Click **"View in CloudWatch"**
4. Shows:
   - API errors
   - Server errors
   - Performance metrics

### Set Up Alarms

1. CloudWatch → **"Alarms"**
2. Create alarm for:
   - 4XX errors (client errors)
   - 5XX errors (server errors)
   - Response time
3. Send notifications to email/SNS

### Continuous Deployment

**Already set up!** Amplify automatically:
- Detects commits to `main` branch
- Triggers new build
- Deploys automatically
- Keeps previous versions

**To disable:**
- Amplify Console → App Settings → Branch settings
- Turn off "Auto build"

### Rollback to Previous Version

If deployment breaks:
1. Amplify Console → Your App
2. Click **"Deployments"**
3. Find working version
4. Click **"Redeploy this version"**

---

## 🔐 Security Best Practices

### 1. Environment Variables
- ✅ Never commit `.env.local` to git
- ✅ Use different credentials for dev/prod
- ✅ Rotate credentials periodically

### 2. MongoDB Security
- ✅ Use strong passwords
- ✅ Enable authentication
- ✅ Use connection string with `retryWrites=true`
- ✅ Regular backups in MongoDB Atlas

### 3. Cognito Security
- ✅ Enable MFA for admin users
- ✅ Set strong password policies
- ✅ Monitor user sign-ups
- ✅ Enable account recovery

### 4. HTTPS
- ✅ Amplify forces HTTPS automatically
- ✅ Custom domains get free SSL certificates
- ✅ No HTTP access allowed

### 5. API Security
- ✅ All routes verify JWT tokens
- ✅ User ID from token (not client)
- ✅ Input validation with Zod
- ✅ MongoDB parameterized queries

---

## ✅ Post-Deployment Checklist

After successful deployment:

- [ ] Homepage loads without errors
- [ ] Sign up flow works
- [ ] Email verification works
- [ ] Login redirects correctly
- [ ] Can create tasks
- [ ] Can edit tasks
- [ ] Can mark tasks as done
- [ ] Can delete tasks
- [ ] Tasks persist after refresh
- [ ] Logout works and clears session
- [ ] No console errors
- [ ] Build logs show no warnings
- [ ] CloudWatch shows no errors
- [ ] Update Cognito callback URLs
- [ ] Test on mobile device
- [ ] Test on different browsers

---

## 📞 Support & Resources

### AWS Resources
- [Amplify Documentation](https://docs.amplify.aws/)
- [Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [AWS Support](https://console.aws.amazon.com/support/)

### Next.js Resources
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

### MongoDB Resources
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Connection Troubleshooting](https://www.mongodb.com/docs/atlas/troubleshoot-connection/)

### Community
- [Next.js GitHub Discussions](https://github.com/vercel/next.js/discussions)
- [AWS Amplify Discord](https://discord.gg/amplify)

---

## 🎉 Congratulations!

Your app is now live on AWS Amplify with:
- ✅ Global CDN distribution
- ✅ Automatic HTTPS
- ✅ Continuous deployment
- ✅ Scalable infrastructure
- ✅ Professional hosting

**Share your app:**
```
https://main.xxxxxxxx.amplifyapp.com
```

**Next steps:**
1. Set up custom domain
2. Add monitoring alerts
3. Configure staging environment
4. Set up automated backups
5. Add analytics (optional)

---

**Need help?** Check the troubleshooting section or open an issue on GitHub.
