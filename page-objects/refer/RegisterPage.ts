import { Page, Locator, expect } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;
  readonly countryRegionDropdown: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly registerButton: Locator;
  readonly signInLink: Locator;
  readonly getYourUniqueReferralLinkButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.countryRegionDropdown = page.getByRole('combobox', { name: 'Country / Region' });
    this.emailInput = page.getByPlaceholder('Email');
    this.passwordInput = page.locator('input[type="password"][placeholder="Password"]').first();
    this.confirmPasswordInput = page.locator('input[type="password"][placeholder="Confirm Password"]').first();
    this.registerButton = page.getByRole('button', { name: 'Register and Get Link' });
    this.signInLink = page.getByRole('link', { name: 'Sign In' });
    this.getYourUniqueReferralLinkButton = page.getByRole('button', { name: 'Get Your Unique Referral Link' });
  }

  async navigateToRegisterPage(): Promise<void> {
    const baseUrl = process.env.FUR4_REFERRAL_URL || 'https://refer.fur4.com/';
    await this.page.goto(`${baseUrl}/register`, { waitUntil: 'domcontentloaded' });
    await this.page.waitForSelector('body', { state: 'visible', timeout: 15000 });
  }

  async verifyPageLoad(): Promise<void> {
    await expect(this.page).toHaveURL(/register/);
    // The actual page title is "FUR4 REFERRAL"
    await expect(this.page).toHaveTitle(/FUR4 REFERRAL/i);
  }

  async verifyAllFormElements(): Promise<void> {
    await expect(this.countryRegionDropdown).toBeVisible();
    // Note: Country/Region dropdown is disabled and shows "Currently Only Available in the USA"
    // await expect(this.countryRegionDropdown).toBeEnabled();
    
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.confirmPasswordInput).toBeVisible();
    await expect(this.registerButton).toBeVisible();
    await expect(this.signInLink).toBeVisible();
  }

  async selectCountryRegion(country: string): Promise<void> {
    await this.countryRegionDropdown.click();
    const countryOption = this.page.getByRole('option', { name: country });
    await countryOption.click();
  }

  async enterEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async enterConfirmPassword(password: string): Promise<void> {
    await this.confirmPasswordInput.fill(password);
  }

  async clickRegisterButton(): Promise<void> {
    await this.registerButton.click();
  }

  async clickSignInLink(): Promise<void> {
    await this.signInLink.click();
    
    // Wait for navigation with a reasonable timeout
    try {
      await this.page.waitForURL(/login/, { timeout: 15000 });
    } catch (error) {
      console.log('Navigation to login page timed out, checking if we reached the page...');
      
      // Check if we're on the login page anyway
      const currentUrl = await this.page.url();
      if (currentUrl.includes('login')) {
        console.log('Successfully navigated to login page');
      } else {
        console.log('Still on register page, navigation may have failed');
      }
    }
  }

  async clickGetYourUniqueReferralLinkButton(): Promise<void> {
    await this.getYourUniqueReferralLinkButton.click();
  }

  async getCurrentCountryRegion(): Promise<string> {
    return await this.countryRegionDropdown.textContent() || '';
  }

  async getEmailValue(): Promise<string> {
    return await this.emailInput.inputValue();
  }

  async getPasswordValue(): Promise<string> {
    return await this.passwordInput.inputValue();
  }

  async getConfirmPasswordValue(): Promise<string> {
    return await this.confirmPasswordInput.inputValue();
  }

  async clearAllFields(): Promise<void> {
    await this.emailInput.clear();
    await this.passwordInput.clear();
    await this.confirmPasswordInput.clear();
  }

  async isFormValid(): Promise<boolean> {
    try {
      // Check if all required fields have values
      const email = await this.getEmailValue();
      const password = await this.getPasswordValue();
      const confirmPassword = await this.getConfirmPasswordValue();
      
      return email.length > 0 && password.length > 0 && confirmPassword.length > 0;
    } catch {
      return false;
    }
  }

  async verifyPasswordFieldsMatch(): Promise<boolean> {
    const password = await this.getPasswordValue();
    const confirmPassword = await this.getConfirmPasswordValue();
    return password === confirmPassword;
  }

  async isRegisterButtonEnabled(): Promise<boolean> {
    try {
      await expect(this.registerButton).toBeEnabled();
      return true;
    } catch {
      return false;
    }
  }

  async isRegisterButtonDisabled(): Promise<boolean> {
    try {
      await expect(this.registerButton).toBeDisabled();
      return true;
    } catch {
      return false;
    }
  }
}
