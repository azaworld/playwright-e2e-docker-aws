import { chromium, FullConfig } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();
console.log('DEBUG: Loaded TEAMS_WEBHOOK_URL:', process.env.TEAMS_WEBHOOK_URL);

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting FUR4 automated test suite...');
  
  // Set environment variables for test tracking
  process.env.TEST_START_TIME = new Date().toISOString();
  process.env.TEST_RUN_ID = `fur4-${Date.now()}`;
  
  console.log(`📅 Test run started at: ${process.env.TEST_START_TIME}`);
  console.log(`🆔 Test run ID: ${process.env.TEST_RUN_ID}`);
  
  // Validate that required environment variables are set
  if (!process.env.TEAMS_WEBHOOK_URL) {
    console.warn('⚠️  TEAMS_WEBHOOK_URL not set - Teams notifications will be disabled');
  }
  
  const FUR4_MAIN_URL = process.env.FUR4_MAIN_URL;
  const FUR4_REFERRAL_URL = process.env.FUR4_REFERRAL_URL;
  if (!FUR4_MAIN_URL) throw new Error('FUR4_MAIN_URL is not set in environment variables');
  if (!FUR4_REFERRAL_URL) throw new Error('FUR4_REFERRAL_URL is not set in environment variables');
  
  // Test connectivity to both sites before running tests
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('🔍 Testing connectivity to fur4.com...');
    await page.goto(FUR4_MAIN_URL, { timeout: 30000 });
    const fur4Title = await page.title();
    console.log(`✅ fur4.com accessible - Title: ${fur4Title}`);
  } catch (error) {
    console.error('❌ fur4.com connectivity test failed:', error);
  }
  
  try {
    console.log('🔍 Testing connectivity to refer.fur4.com...');
    await page.goto(FUR4_REFERRAL_URL, { timeout: 30000 });
    const referTitle = await page.title();
    console.log(`✅ refer.fur4.com accessible - Title: ${referTitle}`);
  } catch (error) {
    console.error('❌ refer.fur4.com connectivity test failed:', error);
  }
  
  await browser.close();
  console.log('✅ Global setup completed');
}

export default globalSetup; 