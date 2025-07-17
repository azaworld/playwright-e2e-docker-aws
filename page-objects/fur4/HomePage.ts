import { BasePage } from '../BasePage';
import { Page, expect } from '@playwright/test';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoHome(url: string) {
    await this.goto(url);
  }

  async navigateToHome() {
    const url = process.env.FUR4_MAIN_URL;
    if (!url) throw new Error('FUR4_MAIN_URL is not set in environment variables');
    await this.goto(url);
  }

  async verifyLoaded() {
    await expect(this.page.locator('body')).toBeVisible();
    const content = await this.page.content();
    expect(content).not.toMatch(/404|not found|error|unavailable|forbidden|blocked/i);
    const textContent = await this.page.textContent('body');
    expect((textContent?.length || 0)).toBeGreaterThan(50);
  }

  async hasCTA() {
    const ctaSelectors = [
      'button',
      'a[href*="register"]',
      'a[href*="login"]',
      'a[href*="shop"]',
      'a[href*="product"]',
      '[class*="cta"]',
      '[class*="button"]'
    ];
    for (const selector of ctaSelectors) {
      if (await this.page.locator(selector).count() > 0) {
        return true;
      }
    }
    return false;
  }
}
