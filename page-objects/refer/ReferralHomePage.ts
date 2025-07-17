import { BasePage } from '../BasePage';
import { Page, expect } from '@playwright/test';

export class ReferralHomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoHome(url: string) {
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
      'button:has-text("Refer")',
      'button:has-text("Join")',
      'button:has-text("Sign Up")',
      'button:has-text("Register")',
      'a[href*="register"]',
      'a[href*="signup"]',
      'a[href*="join"]',
      '[class*="cta"]',
      '[class*="button"]',
      'button'
    ];
    for (const selector of ctaSelectors) {
      if (await this.page.locator(selector).count() > 0) {
        return true;
      }
    }
    return false;
  }
}
