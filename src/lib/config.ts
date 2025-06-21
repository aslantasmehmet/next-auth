// 12Factor App - III. Config: Store config in environment
const requiredEnvVars = [
  'AUTH0_CLIENT_ID',
  'AUTH0_CLIENT_SECRET', 
  'AUTH0_ISSUER',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL'
] as const;

// Environment validation
function validateEnvironment() {
  const missing: string[] = [];
  
  requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  });

  if (missing.length > 0) {
    throw new Error(`Eksik environment değişkenleri: ${missing.join(', ')}`);
  }
}

// Config object - 12Factor App single source of truth
export const config = {
  auth0: {
    clientId: process.env.AUTH0_CLIENT_ID!,
    clientSecret: process.env.AUTH0_CLIENT_SECRET!,
    issuer: process.env.AUTH0_ISSUER!,
  },
  nextAuth: {
    secret: process.env.NEXTAUTH_SECRET!,
    url: process.env.NEXTAUTH_URL!,
  },
  app: {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || '3000',
  }
};

// Environment helpers
export const isDev = config.app.env === 'development';
export const isProd = config.app.env === 'production';

// Initialize config validation
if (typeof window === 'undefined') {
  // Server-side validation
  validateEnvironment();
  console.log('✅ Environment değişkenleri doğrulandı');
} 