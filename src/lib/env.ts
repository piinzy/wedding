// /lib/env.ts - Environment validation utility

const requiredEnvVars = {
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  
  // OpenAI
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  
  // Cloudinary
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  
  // Moyasar
  NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY,
  MOYASAR_SECRET_KEY: process.env.MOYASAR_SECRET_KEY,
  
  // WhatsApp Business API
  WHATSAPP_BUSINESS_TOKEN: process.env.WHATSAPP_BUSINESS_TOKEN,
  
  // NextAuth
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  
  // App URLs
  LOCAL_APP_URL: process.env.LOCAL_APP_URL,
  PRODUCTION_APP_URL: process.env.PRODUCTION_APP_URL,
};

function validateEnv() {
  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value || value.trim() === '')
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missingVars.join('\n')}\n\n` +
      'Please copy .env.example to .env.local and fill in all values.'
    );
  }
}

// Validate on startup in development
if (process.env.NODE_ENV === 'development') {
  validateEnv();
}

// Export typed constants for use throughout the app
export const env = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY!,
  },
  cloudinary: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    apiSecret: process.env.CLOUDINARY_API_SECRET!,
  },
  moyasar: {
    publishableKey: process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY!,
    secretKey: process.env.MOYASAR_SECRET_KEY!,
  },
  whatsapp: {
    businessToken: process.env.WHATSAPP_BUSINESS_TOKEN!,
  },
  nextAuth: {
    secret: process.env.NEXTAUTH_SECRET!,
    url: process.env.NEXTAUTH_URL!,
  },
  app: {
    localUrl: process.env.LOCAL_APP_URL!,
    productionUrl: process.env.PRODUCTION_APP_URL!,
  },
} as const;

// Helper to get current app URL based on environment
export function getAppUrl(): string {
  return process.env.NODE_ENV === 'production'
    ? env.app.productionUrl
    : env.app.localUrl;
}
