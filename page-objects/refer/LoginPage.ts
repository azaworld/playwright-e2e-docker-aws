import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailButton: Locator;
  readonly phoneButton: Locator;
  readonly emailOrPhoneInput: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly continueButton: Locator;
  readonly signUpLink: Locator;

  constructor(page: Page) {
    this.page = page;
    // Note: These are buttons, not tabs, and they toggle the input mode
    this.emailButton = page.getByRole('button', { name: 'Enter your Email' });
    this.phoneButton = page.getByRole('button', { name: 'Enter your Phone' });
    this.emailOrPhoneInput = page.getByPlaceholder('Enter your Email');
    this.rememberMeCheckbox = page.locator('input[type="checkbox"]');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.signUpLink = page.getByRole('link', { name: 'Sign Up' });
  }

  async navigateToLoginPage(): Promise<void> {
    const baseUrl = process.env.FUR4_REFERRAL_URL || 'https://refer.fur4.com/';
    await this.page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' });
    await this.page.waitForSelector('body', { state: 'visible', timeout: 15000 });
  }

  async verifyPageLoad(): Promise<void> {
    await expect(this.page).toHaveURL(/login/);
    await expect(this.page).toHaveTitle(/FUR4 REFERRAL/i);
  }

  async verifyAllLoginElements(): Promise<void> {
    // Verify mode toggle buttons
    await expect(this.emailButton).toBeVisible();
    await expect(this.phoneButton).toBeVisible();
    
    // Verify form elements
    await expect(this.emailOrPhoneInput).toBeVisible();
    await expect(this.rememberMeCheckbox).toBeVisible();
    await expect(this.continueButton).toBeVisible();
    await expect(this.signUpLink).toBeVisible();
  }

  async clickEmailButton(): Promise<void> {
    await this.emailButton.click();
  }

  async clickPhoneButton(): Promise<void> {
    await this.phoneButton.click();
  }

  async enterEmailOrPhone(value: string): Promise<void> {
    await this.emailOrPhoneInput.fill(value);
  }

  async toggleRememberMe(): Promise<void> {
    await this.rememberMeCheckbox.click();
  }

  async isRememberMeChecked(): Promise<boolean> {
    return await this.rememberMeCheckbox.isChecked();
  }

  async clickContinueButton(): Promise<void> {
    await this.continueButton.click();
  }

  async clickSignUpLink(): Promise<void> {
    await this.signUpLink.click();
  }

  async getEmailOrPhoneValue(): Promise<string> {
    return await this.emailOrPhoneInput.inputValue();
  }

  async clearEmailOrPhoneInput(): Promise<void> {
    await this.emailOrPhoneInput.clear();
  }

  async isEmailModeActive(): Promise<boolean> {
    try {
      // Check if email input is visible and phone input is not
      const emailInputVisible = await this.emailOrPhoneInput.isVisible();
      const placeholder = await this.emailOrPhoneInput.getAttribute('placeholder');
      return emailInputVisible && placeholder === 'Enter your Email';
    } catch {
      return false;
    }
  }

  async isPhoneModeActive(): Promise<boolean> {
    try {
      // Check if phone input is visible
      const placeholder = await this.emailOrPhoneInput.getAttribute('placeholder');
      return placeholder === 'Enter your Phone';
    } catch {
      return false;
    }
  }

  async isContinueButtonEnabled(): Promise<boolean> {
    try {
      await expect(this.continueButton).toBeEnabled();
      return true;
    } catch {
      return false;
    }
  }

  async isContinueButtonDisabled(): Promise<boolean> {
    try {
      await expect(this.continueButton).toBeDisabled();
      return true;
    } catch {
      return false;
    }
  }

  async verifyModeToggleButtonsAreClickable(): Promise<void> {
    // Verify all mode toggle buttons are enabled and clickable
    await expect(this.emailButton).toBeEnabled();
    await expect(this.phoneButton).toBeEnabled();
  }

  async switchToEmailMode(): Promise<void> {
    if (!(await this.isEmailModeActive())) {
      await this.clickEmailButton();
    }
  }

  async switchToPhoneMode(): Promise<void> {
    if (!(await this.isPhoneModeActive())) {
      await this.clickPhoneButton();
    }
  }

  async enterValidEmail(email: string): Promise<void> {
    await this.switchToEmailMode();
    await this.enterEmailOrPhone(email);
  }

  async enterValidPhone(phone: string): Promise<void> {
    await this.switchToPhoneMode();
    await this.enterEmailOrPhone(phone);
  }


}
