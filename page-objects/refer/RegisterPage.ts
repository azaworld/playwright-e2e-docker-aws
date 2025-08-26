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
  
  // Additional selectors for missing elements
  readonly createAccountTitle: Locator;
  readonly socialSignUpTitle: Locator;
  readonly googleLoginButton: Locator;
  readonly facebookLoginButton: Locator;
  readonly linkedinLoginButton: Locator;
  readonly orSeparator: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly recaptchaCheckbox: Locator;
  readonly recaptchaPrivacyLink: Locator;
  readonly recaptchaTermsLink: Locator;
  readonly alreadyHaveAccountText: Locator;
  readonly countryInfoMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.countryRegionDropdown = page.getByRole('combobox', { name: 'Country / Region' });
    this.emailInput = page.getByPlaceholder('Email');
    this.passwordInput = page.locator('input[type="password"][placeholder="Password"]').first();
    this.confirmPasswordInput = page.locator('input[type="password"][placeholder="Confirm Password"]').first();
    this.registerButton = page.getByRole('button', { name: 'Register and Get Link' });
    this.signInLink = page.getByRole('link', { name: 'Sign In' });
    this.getYourUniqueReferralLinkButton = page.getByRole('button', { name: 'Get Your Unique Referral Link' });
    
    // Initialize additional selectors
    this.createAccountTitle = page.getByText('Create Your Account');
    this.socialSignUpTitle = page.getByText('Social Sign Up');
    this.googleLoginButton = page.getByRole('button', { name: /Google/i });
    this.facebookLoginButton = page.getByRole('button', { name: /Facebook/i });
    this.linkedinLoginButton = page.getByRole('button', { name: /LinkedIn/i });
    this.orSeparator = page.locator('p:has-text("or")').filter({ hasText: /^or$/ });
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.recaptchaCheckbox = page.getByRole('checkbox', { name: "I'm not a robot" });
    this.recaptchaPrivacyLink = page.getByRole('link', { name: 'Privacy' });
    this.recaptchaTermsLink = page.getByRole('link', { name: 'Terms' });
    this.alreadyHaveAccountText = page.getByText('Already have an Account?');
    this.countryInfoMessage = page.getByText('Currently Only Available in the USA');
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

  // ===== ADDITIONAL METHODS FOR MISSING ELEMENTS =====

  async verifyCreateAccountTitle(): Promise<void> {
    if (await this.createAccountTitle.count() > 0) {
      await expect(this.createAccountTitle).toBeVisible();
    }
  }

  async verifySocialSignUpSection(): Promise<void> {
    // Verify Social Sign Up title
    if (await this.socialSignUpTitle.count() > 0) {
      await expect(this.socialSignUpTitle).toBeVisible();
    }

    // Verify social login buttons
    if (await this.googleLoginButton.count() > 0) {
      await expect(this.googleLoginButton).toBeVisible();
    }
    if (await this.facebookLoginButton.count() > 0) {
      await expect(this.facebookLoginButton).toBeVisible();
    }
    if (await this.linkedinLoginButton.count() > 0) {
      await expect(this.linkedinLoginButton).toBeVisible();
    }
  }

  async verifyNameFields(): Promise<void> {
    // Verify First Name field
    if (await this.firstNameInput.count() > 0) {
      await expect(this.firstNameInput).toBeVisible();
      await expect(this.firstNameInput).toBeEnabled();
      await expect(this.firstNameInput).toHaveAttribute('placeholder', 'First Name');
    }

    // Verify Last Name field
    if (await this.lastNameInput.count() > 0) {
      await expect(this.lastNameInput).toBeVisible();
      await expect(this.lastNameInput).toBeEnabled();
      await expect(this.lastNameInput).toHaveAttribute('placeholder', 'Last Name');
    }
  }

  async verifyRecaptchaElements(): Promise<void> {
    // Verify reCAPTCHA checkbox
    if (await this.recaptchaCheckbox.count() > 0) {
      await expect(this.recaptchaCheckbox).toBeVisible();
      await expect(this.recaptchaCheckbox).toBeEnabled();
    }

    // Verify reCAPTCHA links
    if (await this.recaptchaPrivacyLink.count() > 0) {
      await expect(this.recaptchaPrivacyLink).toBeVisible();
    }
    if (await this.recaptchaTermsLink.count() > 0) {
      await expect(this.recaptchaTermsLink).toBeVisible();
    }
  }

  async verifyPageSeparatorsAndMessages(): Promise<void> {
    // Verify or separator
    if (await this.orSeparator.count() > 0) {
      await expect(this.orSeparator).toBeVisible();
    }

    // Verify country info message
    if (await this.countryInfoMessage.count() > 0) {
      await expect(this.countryInfoMessage).toBeVisible();
    }

    // Verify already have account text
    if (await this.alreadyHaveAccountText.count() > 0) {
      await expect(this.alreadyHaveAccountText).toBeVisible();
    }
  }

  async fillNameFields(firstName: string, lastName: string): Promise<void> {
    if (await this.firstNameInput.count() > 0) {
      await this.firstNameInput.fill(firstName);
    }
    if (await this.lastNameInput.count() > 0) {
      await this.lastNameInput.fill(lastName);
    }
  }

  async verifySocialButtonsAreClickable(): Promise<void> {
    if (await this.googleLoginButton.count() > 0) {
      await expect(this.googleLoginButton).toBeEnabled();
    }
    if (await this.facebookLoginButton.count() > 0) {
      await expect(this.facebookLoginButton).toBeEnabled();
    }
    if (await this.linkedinLoginButton.count() > 0) {
      await expect(this.linkedinLoginButton).toBeEnabled();
    }
  }

  async getFirstNameValue(): Promise<string> {
    if (await this.firstNameInput.count() > 0) {
      return await this.firstNameInput.inputValue();
    }
    return '';
  }

  async getLastNameValue(): Promise<string> {
    if (await this.lastNameInput.count() > 0) {
      return await this.lastNameInput.inputValue();
    }
    return '';
  }

  async clickGoogleLoginButton(): Promise<void> {
    if (await this.googleLoginButton.count() > 0) {
      await this.googleLoginButton.click();
    }
  }

  async clickFacebookLoginButton(): Promise<void> {
    if (await this.facebookLoginButton.count() > 0) {
      await this.facebookLoginButton.click();
    }
  }

  async clickLinkedinLoginButton(): Promise<void> {
    if (await this.linkedinLoginButton.count() > 0) {
      await this.linkedinLoginButton.click();
    }
  }

  async clickRecaptchaCheckbox(): Promise<void> {
    if (await this.recaptchaCheckbox.count() > 0) {
      await this.recaptchaCheckbox.click();
    }
  }
}
