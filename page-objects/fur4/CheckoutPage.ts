import { BasePage } from '../BasePage';
import { Page, expect } from '@playwright/test';

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoCheckout(url: string) {
    await this.goto(url);
  }

  async verifyCheckoutElements() {
    await expect(this.page.locator('form')).toBeVisible();
    const formFields = await this.page.locator('input[type="text"], input[type="email"], input[type="password"]').all();
    expect(formFields.length).toBeGreaterThan(0);
  }
}
