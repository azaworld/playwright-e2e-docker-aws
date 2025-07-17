import { BasePage } from '../BasePage';
import { Page, expect } from '@playwright/test';

export class SignupPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoSignup(url: string) {
    await this.goto(url);
  }

  async verifySignupForm() {
    await expect(this.page.locator('form')).toBeVisible();
    const formFields = await this.page.locator('input[type="text"], input[type="email"], input[type="password"]').all();
    expect(formFields.length).toBeGreaterThan(0);
  }
}
