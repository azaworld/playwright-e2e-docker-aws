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
    if (/404|not found|error|unavailable|forbidden|blocked/i.test(content)) {
      await this.page.screenshot({ path: 'playwright-report/homepage-error.png', fullPage: true });
      throw new Error('Homepage returned error/404 content');
    }
    const textContent = await this.page.textContent('body');
    expect((textContent?.length || 0)).toBeGreaterThan(50);
  }

  async hasCTA() {
    const ctaSelectors = [
      'button:has-text("Shop")',
      'button:has-text("Add to Cart")',
      'button:has-text("Buy Now")',
      'button:has-text("Sign Up")',
      'button:has-text("Register")',
      'a[href*="register"]',
      'a[href*="login"]',
      'a[href*="shop"]',
      'a[href*="product"]',
      '[class*="cta"]',
      '[class*="button"]',
      'button',
      'a.button',
      'a.cta',
    ];
    for (const selector of ctaSelectors) {
      if (await this.page.locator(selector).count() > 0) {
        return true;
      }
    }
    await this.page.screenshot({ path: 'playwright-report/homepage-no-cta.png', fullPage: true });
    return false;
  }
}
