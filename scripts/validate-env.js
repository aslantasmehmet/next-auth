#!/usr/bin/env node

/**
 * Environment Validation Script
 * 12Factor app compliance - Environment değişkenlerini kontrol eder
 */

const requiredEnvVars = [
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'AUTH0_CLIENT_ID',
  'AUTH0_CLIENT_SECRET',
  'AUTH0_ISSUER'
];

console.log('🔧 Environment Validation başlatılıyor...\n');

let hasError = false;

for (const envVar of requiredEnvVars) {
  const value = process.env[envVar];
  
  if (!value) {
    console.error(`❌ ${envVar}: Tanımlı değil`);
    hasError = true;
  } else {
    // Sensitive bilgileri gizle
    const displayValue = envVar.includes('SECRET') || envVar.includes('KEY') 
      ? value.substring(0, 8) + '...' 
      : value;
    console.log(`✅ ${envVar}: ${displayValue}`);
  }
}

if (hasError) {
  console.error('\n⚠️ Bazı environment değişkenleri eksik!');
  console.error('📋 .env.local dosyasını kontrol edin veya oluşturun.');
  console.error('\n📖 Gerekli değişkenler:');
  requiredEnvVars.forEach(envVar => {
    console.error(`   - ${envVar}`);
  });
  console.error('\n💡 .env.example dosyasını .env.local olarak kopyalayıp düzenleyin.');
  process.exit(1);
} else {
  console.log('\n✅ Tüm environment değişkenleri doğru tanımlanmış!');
  console.log('🚀 Uygulama başlatılmaya hazır.');
  process.exit(0);
} 