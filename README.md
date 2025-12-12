# Insightt Todo App 📝

A modern, full-stack todo application built with Next.js 16, AWS Amplify (Cognito), MongoDB, and Material-UI. Features user authentication, real-time task management, and comprehensive testing.

## 🚀 Tech Stack

### Frontend
- **Next.js 16.0.8** - React framework with App Router
- **React 19.2.1** - UI library
- **Material-UI v7** - Component library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Zustand** - State management

### Backend
- **Next.js API Routes** - REST API
- **MongoDB** - Database
- **AWS Amplify** - Backend infrastructure
- **AWS Cognito** - Authentication
- **Zod** - Schema validation
- **JWT Verify** - Token verification

### Testing
- **Jest** - Unit testing
- **Playwright** - E2E testing
- **Testing Library** - React component testing

## ✨ Features

- ✅ **User Authentication** - Sign up, login, logout with AWS Cognito
- ✅ **Email Verification** - Secure email confirmation flow
- ✅ **CRUD Operations** - Create, read, update, delete tasks
- ✅ **Mark as Done** - Toggle task completion status via API
- ✅ **Task Sorting** - Incomplete tasks first, completed at bottom
- ✅ **Visual Feedback** - Green titles for completed tasks
- ✅ **Confirmation Dialogs** - Safe delete with confirmation
- ✅ **Loading States** - Disabled buttons during operations
- ✅ **Toast Notifications** - Success/error feedback
- ✅ **Responsive Design** - Mobile-friendly Material-UI
- ✅ **Form Validation** - Zod schema validation
- ✅ **Optimistic Updates** - Instant UI feedback
- ✅ **Protected Routes** - Server-side authentication checks

## 📁 Project Structure

```
insightt-todo/
├── app/                          # Next.js App Router
│   ├── (root)/                   # Public routes
│   │   ├── page.tsx              # Login page
│   │   └── components/           # Login components
│   ├── [user]/                   # Protected user routes (dynamic)
│   │   ├── page.tsx              # Tasks dashboard
│   │   ├── layout.tsx            # User layout with navbar
│   │   └── components/           # Task components
│   │       ├── tasks/            # Task CRUD components
│   │       └── ui/               # UI components (navbar, logout)
│   ├── signup/                   # Sign up page
│   ├── verify-email/             # Email verification page
│   ├── api/                      # API routes
│   │   ├── tasks/                # Task endpoints
│   │   └── _lib/                 # Shared utilities
│   │       ├── auth.ts           # JWT verification
│   │       ├── mongodb.ts        # MongoDB connection
│   │       └── models/           # Data models
│   ├── lib/                      # Shared libraries
│   │   ├── hooks/                # Custom React hooks
│   │   ├── schemas/              # Zod validation schemas
│   │   ├── stores/               # Zustand stores
│   │   ├── types/                # TypeScript types
│   │   └── utils/                # Utility functions
│   ├── components/               # Global components
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── amplify/                      # AWS Amplify backend
│   ├── backend.ts                # Backend definition
│   ├── auth/                     # Cognito configuration
│   └── data/                     # Data resources
├── __tests__/                    # Test suite
│   ├── unit/                     # Unit tests
│   │   ├── api/                  # API validation tests
│   │   └── lib/                  # Store tests
│   └── e2e/                      # End-to-end tests
│       ├── auth.spec.ts          # Authentication flows
│       └── tasks.spec.ts         # CRUD workflows
├── public/                       # Static assets
└── coverage/                     # Test coverage reports
```

## 🛠️ Getting Started

### Prerequisites

- **Node.js** 18+ (20.x recommended)
- **pnpm** 9+ (or npm/yarn)
- **MongoDB** database (local or MongoDB Atlas)
- **AWS Account** (for Amplify/Cognito)

### 1. Clone the Repository

```bash
git clone https://github.com/manuelarmasme/insightt-todo.git
cd insightt-todo
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .example.env.local .env.local
```

Edit `.env.local` with your credentials:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB_NAME=insightt-todo

# AWS Cognito Configuration
DATABASE_AWS_COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
DATABASE_AWS_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx

# Testing (Optional)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_TEST_USER_EMAIL=test@example.com
NEXT_PUBLIC_TEST_USER_PASSWORD=TestPassword123!
```

### 4. Set Up AWS Amplify

```bash
# Configure AWS credentials
aws configure

# Start Amplify sandbox (creates Cognito User Pool)
pnpm sandbox
```

This will:
- Create an AWS Cognito User Pool
- Generate `amplify_outputs.json` with your auth config
- Set up the backend infrastructure

### 5. Update Environment Variables

After running `pnpm sandbox`, copy the Cognito details from `amplify_outputs.json` to your `.env.local`:

```json
{
  "auth": {
    "user_pool_id": "us-east-1_xxxxxxxxx",  // Copy this
    "aws_region": "us-east-1",
    "user_pool_client_id": "xxxxxxxxxx"     // Copy this
  }
}
```

### 6. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🧪 Testing

### Unit Tests

```bash
# Run all unit tests
pnpm test

# Watch mode (re-run on file changes)
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

**Test Coverage:**
- ✅ 17 API validation tests (Zod schemas)
- ✅ 11 Zustand store tests (CRUD operations)
- ✅ 28 total passing tests

### E2E Tests

```bash
# Run all E2E tests
pnpm test:e2e

# Run with UI (interactive mode)
pnpm test:e2e:ui

# Run with visible browser
pnpm test:e2e:headed

# View test report
pnpm test:report
```

**Note:** E2E tests require valid test credentials in `.env.local`.

### Test Documentation

See comprehensive testing guides:
- [`__tests__/README.md`](./__tests__/README.md) - Test structure and overview
- [`TESTING_SUMMARY.md`](./TESTING_SUMMARY.md) - Complete testing guide
- [`TESTING_EXPLAINED.md`](./TESTING_EXPLAINED.md) - Beginner-friendly explanations

## 🚢 Deployment to AWS Amplify

### Prerequisites Checklist

Before deploying, ensure you have:

- ✅ MongoDB database accessible from the internet (MongoDB Atlas recommended)
- ✅ All environment variables ready
- ✅ AWS account with Amplify access
- ✅ Repository on GitHub
- ✅ Clean build locally (`pnpm build` succeeds)

### Deployment Steps

#### 1. Prepare Environment Variables

Create a list of all environment variables needed in production:

```env
MONGODB_URI=mongodb+srv://...
MONGODB_DB_NAME=insightt-todo-prod
DATABASE_AWS_COGNITO_USER_POOL_ID=us-east-1_xxxxx
DATABASE_AWS_COGNITO_CLIENT_ID=xxxxxxxxxxxx
```

**⚠️ Important:** Do NOT include test credentials in production.

#### 2. Deploy via Amplify Console

1. **Go to AWS Amplify Console**
   - Visit https://console.aws.amazon.com/amplify/
   - Click "New app" → "Host web app"

2. **Connect Repository**
   - Select "GitHub"
   - Authorize AWS Amplify
   - Choose your repository: `manuelarmasme/insightt-todo`
   - Select branch: `main` (or your production branch)

3. **Configure Build Settings**
   
   Amplify will auto-detect Next.js. Verify the build settings:

   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install -g pnpm
           - pnpm install
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
   ```

4. **Add Environment Variables**
   - In "Advanced settings" → "Environment variables"
   - Add each variable from your `.env.local`
   - **Critical:** Set these before deploying:
     ```
     MONGODB_URI
     MONGODB_DB_NAME
     DATABASE_AWS_COGNITO_USER_POOL_ID
     DATABASE_AWS_COGNITO_CLIENT_ID
     ```

5. **Deploy**
   - Click "Save and deploy"
   - Wait for build to complete (~5-10 minutes)

#### 3. Set Up Custom Domain (Optional)

1. In Amplify Console → "Domain management"
2. Add your custom domain
3. Follow DNS configuration instructions

### Post-Deployment Checklist

After deployment, verify:

- ✅ App loads at the Amplify URL
- ✅ Login/signup functionality works
- ✅ Can create/edit/delete tasks
- ✅ MongoDB connection is working
- ✅ Authentication redirects properly
- ✅ No console errors

### Common Deployment Issues & Fixes

#### Issue: Build Fails with "Module not found"
**Fix:** Ensure all dependencies are in `package.json` (not just devDependencies)

#### Issue: MongoDB Connection Error
**Fix:** 
- Whitelist Amplify's IP in MongoDB Atlas (or allow all: `0.0.0.0/0`)
- Verify `MONGODB_URI` in environment variables

#### Issue: Cognito Authentication Fails
**Fix:**
- Update Cognito callback URLs to include Amplify domain
- Go to Cognito Console → App client → Add Amplify URL to "Allowed callback URLs"

#### Issue: Environment Variables Not Working
**Fix:**
- Ensure variables don't have quotes in Amplify Console
- Redeploy after adding/changing variables

#### Issue: 404 on Dynamic Routes
**Fix:**
- Verify Next.js config is correct
- Ensure dynamic routes use proper folder structure `[user]`

### Monitoring & Logs

View logs in Amplify Console:
1. Select your app
2. Click on the deployment
3. View "Build logs" and "Deploy logs"

For runtime errors:
- Check CloudWatch Logs (linked from Amplify Console)
- Enable error monitoring in your Next.js app

## 📊 API Endpoints

### Authentication
- Protected by JWT token verification
- User ID extracted from Cognito token

### Tasks API

**Base URL:** `/api/tasks`

#### GET /api/tasks
Get all tasks for authenticated user
```typescript
Response: Task[]
```

#### POST /api/tasks
Create a new task
```typescript
Body: { title: string, completed: boolean }
Response: Task
```

#### PUT /api/tasks?id={taskId}
Update task title
```typescript
Body: { title: string }
Response: Task
```

#### PATCH /api/tasks?id={taskId}
Toggle task completion status
```typescript
Body: { completed: boolean }
Response: Task
```

#### DELETE /api/tasks?id={taskId}
Delete a task
```typescript
Response: { message: string }
```

## 🎨 Key Components

### Task Management
- **CreateTaskForm** - Add new tasks with validation
- **ListTasks** - Display sorted task list
- **EditTaskDialog** - Edit task titles with form validation
- **ToggleTaskComplete** - Mark tasks complete/incomplete
- **DeleteTaskDialog** - Delete with confirmation

### Authentication
- **LoginContainer** - Email/password login with Cognito
- **SignupContainer** - User registration
- **VerifyEmailContainer** - Email verification flow
- **LogoutButton** - Secure logout with store reset

### UI Components
- **Navbar** - Server component with Material-UI AppBar
- **Loading** - Loading spinner states
- **Error** - Error boundary component

## 🔒 Security Features

- ✅ JWT token verification on all API routes
- ✅ Server-side authentication checks
- ✅ Protected dynamic routes `[user]`
- ✅ Email verification required
- ✅ Input validation with Zod schemas
- ✅ MongoDB parameterized queries (prevents injection)
- ✅ Environment variable validation
- ✅ CORS and security headers

## 🎯 Technical Requirements Met

This project fulfills all technical test requirements:

- ✅ **Authentication System** - AWS Cognito with email verification
- ✅ **CRUD Operations** - Complete task management
- ✅ **Mark as Done** - PATCH endpoint for task completion
- ✅ **Cloud Function/Web Service** - Next.js API routes
- ✅ **Database** - MongoDB with connection pooling
- ✅ **Unit Tests** - Jest with 28 passing tests
- ✅ **E2E Tests** - Playwright test suite
- ✅ **Material UI** - Complete MUI integration
- ✅ **TypeScript** - Full type safety
- ✅ **Modern Framework** - Next.js 16 with App Router

## 📚 Documentation

- [`__tests__/README.md`](./__tests__/README.md) - Test suite overview
- [`TESTING_SUMMARY.md`](./TESTING_SUMMARY.md) - Complete testing guide
- [`TESTING_EXPLAINED.md`](./TESTING_EXPLAINED.md) - Testing concepts for beginners

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Scripts Reference

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm sandbox          # Start Amplify sandbox
pnpm test             # Run unit tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Generate coverage report
pnpm test:e2e         # Run E2E tests
pnpm test:e2e:ui      # Run E2E tests with UI
pnpm test:e2e:headed  # Run E2E tests with visible browser
pnpm test:report      # View Playwright test report
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB URI format
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# Verify network access in MongoDB Atlas
# Go to Security → Network Access → Add IP Address
```

### Amplify Sandbox Won't Start
```bash
# Ensure AWS credentials are configured
aws configure

# Check AWS region matches
echo $AWS_REGION
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## 📄 License

This project is private and proprietary.

## 👤 Author

**Manuel Armas**
- GitHub: [@manuelarmasme](https://github.com/manuelarmasme)
- Email: hola@manuelarmas.me

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- AWS Amplify for seamless backend integration
- Material-UI for beautiful components
- MongoDB for reliable data storage

---

**Built with ❤️ for Insightt Technical Test**

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
