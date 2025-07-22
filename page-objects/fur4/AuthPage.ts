import { BasePage } from '../BasePage';
import { Page, expect } from '@playwright/test';

export class AuthPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async gotoRegistration(url: string) {
    await this.goto(url);
  }

  async verifyRegistrationForm() {
    await expect(this.page.locator('form')).toBeVisible();
    const formFields = await this.page.locator('input[type="text"], input[type="email"], input[type="password"]').all();
    expect(formFields.length).toBeGreaterThan(0);
  }

  async gotoLogin(url: string) {
    await this.goto(url);
  }

  async verifySocialLoginButtons() {
    const socialLoginSelectors = [
      'button:has-text("Google")',
      'button:has-text("Facebook")',
      'button:has-text("LinkedIn")',
      'a[href*="google"]',
      'a[href*="facebook"]',
      'a[href*="linkedin"]',
      '[class*="google"]',
      '[class*="facebook"]',
      '[class*="linkedin"]'
    ];
    let foundSocialLogin = false;
    for (const selector of socialLoginSelectors) {
      if (await this.page.locator(selector).count() > 0) {
        foundSocialLogin = true;
        break;
      }
    }
    expect(foundSocialLogin).toBe(true);
  }

  async navigateToReferralPage() {
    const url = process.env.FUR4_REFERRAL_URL;
    if (!url) throw new Error('FUR4_REFERRAL_URL is not set in environment variables');
    await this.goto(url);
  }
} 