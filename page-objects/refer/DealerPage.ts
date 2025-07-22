import { BasePage } from '../BasePage';
import { Page, expect } from '@playwright/test';

export class DealerPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoDealer(url: string) {
    await this.goto(url);
  }

  async verifyDealerCTA() {
    const dealerCTASelectors = [
      'button:has-text("Become a Dealer")',
      'button:has-text("Partner")',
      'button:has-text("Join")',
      'button:has-text("Apply")',
      'a[href*="dealer"]',
      'a[href*="partner"]',
      'a[href*="business"]',
      '[class*="cta"]',
      '[class*="button"]'
    ];
    let foundDealerCTA = false;
    for (const selector of dealerCTASelectors) {
      if (await this.page.locator(selector).count() > 0) {
        foundDealerCTA = true;
        break;
      }
    }
    expect(foundDealerCTA).toBe(true);
  }
} 