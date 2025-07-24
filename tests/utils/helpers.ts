// Utility functions for Playwright tests

import { Page } from '@playwright/test';

export async function navigateToHomepage(page: Page) {
  const baseUrl = process.env.FUR4_MAIN_URL;
  if (!baseUrl) throw new Error('FUR4_MAIN_URL is not set in environment variables!');
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('body', { state: 'visible', timeout: 15000 });
}

export function randomEmail(domain = 'example.com') {
  return `user_${Date.now()}_${Math.floor(Math.random() * 10000)}@${domain}`;
}

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
} 