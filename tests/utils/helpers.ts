// Utility functions for Playwright tests

import { Page } from '@playwright/test';

export async function navigateToHomepage(page: Page) {
  const baseUrl = process.env.FUR4_MAIN_URL;
  if (!baseUrl) throw new Error('FUR4_MAIN_URL is not set in environment variables!');
  
  try {
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    
    // Wait for page to be ready, but be more flexible
    try {
      await page.waitForSelector('body', { state: 'visible', timeout: 10000 });
    } catch (error) {
      console.log('⚠ Body visibility timeout - checking if page loaded anyway');
      // Check if page has content even if body visibility check failed
      const hasContent = await page.locator('body').textContent();
      if (!hasContent || hasContent.length < 100) {
        throw new Error('Page appears to not have loaded properly');
      }
      console.log('✓ Page loaded with content despite visibility timeout');
    }
    
    // Additional wait for page stability
    await page.waitForTimeout(1000);
  } catch (error) {
    console.error('Navigation to homepage failed:', error);
    throw error;
  }
}

export function randomEmail(domain = 'example.com') {
  return `user_${Date.now()}_${Math.floor(Math.random() * 10000)}@${domain}`;
}

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
} 