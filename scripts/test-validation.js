#!/usr/bin/env node

/**
 * Test Validation Script
 * Tüm test türlerini çalıştırır ve sonuçları raporlar
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Test & Validation Pipeline Başlatılıyor...\n');

// Test sonuçları
const results = {
  unit: { passed: false, error: null },
  integration: { passed: false, error: null },
  e2e: { passed: false, error: null },
  coverage: { passed: false, error: null }
};

// 1. Unit Tests
console.log('📋 Unit Tests çalıştırılıyor...');
try {
  execSync('npm test -- --passWithNoTests', { stdio: 'inherit' });
  results.unit.passed = true;
  console.log('✅ Unit Tests: BAŞARILI\n');
} catch (error) {
  results.unit.error = error.message;
  console.log('❌ Unit Tests: BAŞARISIZ\n');
}

// 2. Coverage Report
console.log('📊 Coverage raporu oluşturuluyor...');
try {
  execSync('npm run test:coverage -- --passWithNoTests', { stdio: 'inherit' });
  results.coverage.passed = true;
  console.log('✅ Coverage Report: BAŞARILI\n');
} catch (error) {
  results.coverage.error = error.message;
  console.log('❌ Coverage Report: BAŞARISIZ\n');
}

// 3. Build Test
console.log('🏗️ Build testi yapılıyor...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  results.integration.passed = true;
  console.log('✅ Build Test: BAŞARILI\n');
} catch (error) {
  results.integration.error = error.message;
  console.log('❌ Build Test: BAŞARISIZ\n');
}

// 4. Environment Validation
console.log('🔧 Environment validation...');
try {
  execSync('npm run validate-env', { stdio: 'inherit' });
  console.log('✅ Environment Validation: BAŞARILI\n');
} catch (error) {
  console.log('❌ Environment Validation: BAŞARISIZ\n');
}

// Sonuç Raporu
console.log('📈 TEST SONUÇLARI:');
console.log('================');
console.log(`Unit Tests: ${results.unit.passed ? '✅ BAŞARILI' : '❌ BAŞARISIZ'}`);
console.log(`Coverage: ${results.coverage.passed ? '✅ BAŞARILI' : '❌ BAŞARISIZ'}`);
console.log(`Build Test: ${results.integration.passed ? '✅ BAŞARILI' : '❌ BAŞARISIZ'}`);

const totalPassed = Object.values(results).filter(r => r.passed).length;
const totalTests = Object.keys(results).length;

console.log(`\n📊 Genel Başarı Oranı: ${totalPassed}/${totalTests} (${Math.round(totalPassed/totalTests*100)}%)`);

if (totalPassed === totalTests) {
  console.log('\n🎉 Tüm testler başarıyla tamamlandı!');
  process.exit(0);
} else {
  console.log('\n⚠️ Bazı testler başarısız oldu. Lütfen kontrol edin.');
  process.exit(1);
} 