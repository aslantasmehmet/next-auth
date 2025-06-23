# Next.js 14 + Auth0 OAuth + JWT Authentication System

A modern, secure authentication system built with Next.js 14 App Router, Auth0 OAuth, and JWT token management. Features role-based authorization with admin/user differentiation and enterprise-grade security.

## Features

- **Secure Authentication**: Auth0 OAuth integration with JWT tokens
- **Role-Based Authorization**: Admin and User roles with different permissions
- **Modern UI**: Clean, responsive design with TailwindCSS
- **Enterprise Ready**: SOLID principles and 12Factor App compliance
- **Production Ready**: Docker support with multi-stage builds
- **Type Safe**: Full TypeScript implementation

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Authentication**: NextAuth.js + Auth0 OAuth
- **Styling**: TailwindCSS
- **Architecture**: SOLID Principles, Clean Architecture
- **Deployment**: Docker, Docker Compose

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Auth0 account

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd next-auth
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Auth0 credentials:
```env
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret
AUTH0_ISSUER=https://your-domain.auth0.com
NEXTAUTH_SECRET=your_32_character_secret_key
NEXTAUTH_URL=http://localhost:3000
```

4. **Run Development Server**
```bash
npm run dev
```

Visit `http://localhost:3000`

## Role-Based Authorization

The system supports two user roles with different capabilities:

### Admin Users
- Full system access
- Admin Panel access (`/admin`)
- User management capabilities
- Analytics and system monitoring
- Distinguished with red role badges and crown icon

### Regular Users  
- Dashboard access (`/dashboard`)
- Profile management (`/profile`)
- Personal data viewing
- Blue role badges

## Admin Configuration

### Default Admin Account

For testing purposes, the following email is pre-configured as admin:
```
kayraexport@testadmin.com
```

### Adding Custom Admin Users

To configure additional admin users, modify the `RoleService` in `src/services/RoleService.ts`:

```typescript
// Add your admin emails to this array
const ADMIN_EMAILS = [
  'kayraexport@testadmin.com',
  'your-admin@company.com',
  'another-admin@domain.com'
];
```

### Role Assignment Logic

- **Admin Role**: Users with emails listed in `ADMIN_EMAILS` array
- **User Role**: All other authenticated users (default)

The role assignment happens automatically during the authentication process and is stored in the JWT token for session management.

## Docker Deployment

### Development
```bash
docker-compose up --build
```

### Production
```bash
docker build -t nextauth-app .
docker run -p 3000:3000 nextauth-app
```

## Project Structure

```
src/
├── app/                 # Next.js 14 App Router
│   ├── api/auth/       # NextAuth API routes
│   ├── dashboard/      # Protected dashboard
│   ├── profile/        # User profile page
│   └── login/          # Login page
├── components/         # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and config
└── services/           # Business logic services
│   └── RoleService.ts  # Role management logic
```

## Security Features

- **JWT Token Management**: Secure session handling
- **Route Protection**: Middleware-based authentication
- **Role Validation**: Server-side permission checks
- **Environment Validation**: Runtime config verification
- **HTTPS Enforcement**: Production security headers

## Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run test` - Run test suite
- `npm run lint` - Run ESLint
- `npm run validate-env` - Validate environment variables

## Project Status

🚀 **Production Ready**

This project is **complete and production-ready** with the following achievements:

- **Enterprise Authentication**: Fully implemented Auth0 OAuth integration
- **Role-Based Security**: Admin/User authorization system deployed
- **Modern Architecture**: SOLID principles and clean code implementation
- **Testing Coverage**: Comprehensive test suite with unit, integration, and E2E tests
- **Docker Support**: Containerized deployment for any environment
- **Type Safety**: Full TypeScript implementation with strict typing
- **Performance Optimized**: Fast rendering with Next.js 14 App Router
- **Documentation**: Complete setup and deployment documentation

### Deployment Status

- **Development Environment**: Fully functional
- **Testing Environment**: All tests passing
- **Production Environment**: Deployment ready
- **Security Audit**: Enterprise-grade security implemented

---

**Built with modern web technologies for scalable, secure authentication.**
