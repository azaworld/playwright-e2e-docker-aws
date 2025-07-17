import { BasePage } from '../BasePage';
import { Page, expect } from '@playwright/test';

export class NavigationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async verifyNavigationLinks() {
    const navSelectors = [
      'nav a',
      'header a',
      'a[href*="/"]',
      '[class*="nav"] a',
      '[class*="menu"] a'
    ];
    let foundNavLinks = false;
    for (const selector of navSelectors) {
      if (await this.page.locator(selector).count() > 0) {
        foundNavLinks = true;
        break;
      }
    }
    expect(foundNavLinks).toBe(true);
  }

  async verifyFooterLinks() {
    const footer = await this.page.locator('footer').all();
    if (footer.length > 0) {
      await expect(footer[0]).toBeVisible();
      const footerLinks = await this.page.locator('footer a').all();
      expect(footerLinks.length).toBeGreaterThan(0);
    } else {
      throw new Error('No footer found on referral site');
    }
  }
} 