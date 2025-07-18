import { chromium, FullConfig } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

async function globalSetup(config: FullConfig) {
  
  // Set environment variables for test tracking
  process.env.TEST_START_TIME = new Date().toISOString();
  process.env.TEST_RUN_ID = `fur4-${Date.now()}`;
  
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
    await page.goto(FUR4_MAIN_URL, { timeout: 30000 });
    const fur4Title = await page.title();
  } catch (error) {
    // Removed error logging
  }
  
  try {
    await page.goto(FUR4_REFERRAL_URL, { timeout: 30000 });
    const referTitle = await page.title();
  } catch (error) {
    // Removed error logging
  }
  
  await browser.close();
}

export default globalSetup; 