import { BasePage } from '../BasePage';
import { Page, expect } from '@playwright/test';

export class UniqueReferralPage extends BasePage {
  // Page title and main elements
  readonly pageTitle: any;
  readonly socialSignUpTitle: any;
  
  // Social login buttons
  readonly googleButton: any;
  readonly facebookButton: any;
  readonly linkedinButton: any;
  
  // Separator
  readonly separatorText: any;
  
  // Form fields
  readonly firstNameInput: any;
  readonly lastNameInput: any;
  readonly countryRegionLabel: any;
  readonly countrySelector: any;
  readonly availabilityMessage: any;
  readonly emailInput: any;
  readonly passwordInput: any;
  readonly confirmPasswordInput: any;
  
  // Form elements
  readonly recaptchaCheckbox: any;
  readonly registerButton: any;
  readonly signInLink: any;
  
  // Navigation elements
  readonly fur4HomeButton: any;
  readonly registerNavButton: any;
  readonly hamburgerMenuButton: any;
  
  // Utility elements
  readonly chatWidget: any;
  readonly eyeIcon: any;

  constructor(page: Page) {
    super(page);
    
    // Page title and main elements
    this.pageTitle = page.getByText('Create Your Account');
    this.socialSignUpTitle = page.getByText('Social Sign Up');
    
    // Social login buttons
    this.googleButton = page.locator('[class*="google"], [aria-label*="Google"], img[alt*="Google"]');
    this.facebookButton = page.locator('[class*="facebook"], [aria-label*="Facebook"], img[alt*="Facebook"]');
    this.linkedinButton = page.locator('[class*="linkedin"], [aria-label*="LinkedIn"], img[alt*="LinkedIn"]');
    
    // Separator
    this.separatorText = page.getByText('or');
    
    // Form fields
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.countryRegionLabel = page.getByText('Country / Region');
    this.countrySelector = page.locator('text=United States, [role="combobox"], select');
    this.availabilityMessage = page.getByText('Currently Only Available in the USA (check back soon as we expand our referral portal globally)');
    this.emailInput = page.getByPlaceholder('Email');
    this.passwordInput = page.getByPlaceholder('Password');
    this.confirmPasswordInput = page.getByPlaceholder('Confirm Password');
    
    // Form elements
    this.recaptchaCheckbox = page.getByText("I'm not a robot");
    this.registerButton = page.getByRole('button', { name: 'Register and Get Link' });
    this.signInLink = page.getByRole('link', { name: 'Sign In' });
    
    // Navigation elements
    this.fur4HomeButton = page.getByRole('button', { name: 'FUR4 HOME' });
    this.registerNavButton = page.getByRole('button', { name: 'REGISTER' });
    this.hamburgerMenuButton = page.locator('button[aria-label="Open menu"], button:has-text("☰"), [class*="hamburger"]');
    
    // Utility elements
    this.chatWidget = page.getByText('Chat with us');
    this.eyeIcon = page.locator('[class*="eye"], [aria-label*="password"], [class*="visibility"]');
  }

  async navigateToUniqueReferralPage() {
    await this.page.goto('https://refer.fur4.com/uniquereferral');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyPageLoad() {
    await expect(this.page.locator('body')).toBeVisible();
    
    // Verify we're on the right page
    const currentUrl = await this.page.url();
    expect(currentUrl).toContain('uniquereferral');
    
    // Verify page has content
    const bodyText = await this.page.locator('body').textContent();
    expect((bodyText?.length || 0)).toBeGreaterThan(100);
  }

  async verifyPageTitle() {
    if (await this.pageTitle.count() > 0) {
      await expect(this.pageTitle).toBeVisible();
      return true;
    }
    return false;
  }

  async verifySocialSignUpSection() {
    if (await this.socialSignUpTitle.count() > 0) {
      await expect(this.socialSignUpTitle).toBeVisible();
      return true;
    }
    return false;
  }

  async verifySocialButtons() {
    const results = {
      google: false,
      facebook: false,
      linkedin: false
    };
    
    if (await this.googleButton.count() > 0) {
      await expect(this.googleButton.first()).toBeVisible();
      results.google = true;
    }
    
    if (await this.facebookButton.count() > 0) {
      await expect(this.facebookButton.first()).toBeVisible();
      results.facebook = true;
    }
    
    if (await this.linkedinButton.count() > 0) {
      await expect(this.linkedinButton.first()).toBeVisible();
      results.linkedin = true;
    }
    
    return results;
  }

  async verifyFormFields() {
    const results = {
      firstName: false,
      lastName: false,
      countryRegion: false,
      email: false,
      password: false,
      confirmPassword: false
    };
    
    if (await this.firstNameInput.count() > 0) {
      await expect(this.firstNameInput).toBeVisible();
      await expect(this.firstNameInput).toBeEnabled();
      results.firstName = true;
    }
    
    if (await this.lastNameInput.count() > 0) {
      await expect(this.lastNameInput).toBeVisible();
      await expect(this.lastNameInput).toBeEnabled();
      results.lastName = true;
    }
    
    if (await this.countryRegionLabel.count() > 0) {
      await expect(this.countryRegionLabel).toBeVisible();
      results.countryRegion = true;
    }
    
    if (await this.emailInput.count() > 0) {
      await expect(this.emailInput).toBeVisible();
      await expect(this.emailInput).toBeEnabled();
      results.email = true;
    }
    
    if (await this.passwordInput.count() > 0) {
      await expect(this.passwordInput).toBeVisible();
      await expect(this.passwordInput).toBeEnabled();
      results.password = true;
    }
    
    if (await this.confirmPasswordInput.count() > 0) {
      await expect(this.confirmPasswordInput).toBeVisible();
      await expect(this.confirmPasswordInput).toBeEnabled();
      results.confirmPassword = true;
    }
    
    return results;
  }

  async verifyAvailabilityMessage() {
    if (await this.availabilityMessage.count() > 0) {
      await expect(this.availabilityMessage).toBeVisible();
      return true;
    }
    return false;
  }

  async verifyRecaptcha() {
    if (await this.recaptchaCheckbox.count() > 0) {
      await expect(this.recaptchaCheckbox).toBeVisible();
      return true;
    }
    return false;
  }

  async verifyRegisterButton() {
    if (await this.registerButton.count() > 0) {
      await expect(this.registerButton).toBeVisible();
      await expect(this.registerButton).toBeEnabled();
      return true;
    }
    return false;
  }

  async verifySignInLink() {
    if (await this.signInLink.count() > 0) {
      await expect(this.signInLink).toBeVisible();
      await expect(this.signInLink).toBeEnabled();
      return true;
    }
    return false;
  }

  async verifyNavigationElements() {
    const results = {
      fur4Home: false,
      register: false,
      hamburger: false
    };
    
    if (await this.fur4HomeButton.count() > 0) {
      await expect(this.fur4HomeButton).toBeVisible();
      await expect(this.fur4HomeButton).toBeEnabled();
      results.fur4Home = true;
    }
    
    if (await this.registerNavButton.count() > 0) {
      await expect(this.registerNavButton).toBeVisible();
      await expect(this.registerNavButton).toBeEnabled();
      results.register = true;
    }
    
    if (await this.hamburgerMenuButton.count() > 0) {
      await expect(this.hamburgerMenuButton.first()).toBeVisible();
      await expect(this.hamburgerMenuButton.first()).toBeEnabled();
      results.hamburger = true;
    }
    
    return results;
  }

  async verifyChatWidget() {
    if (await this.chatWidget.count() > 0) {
      await expect(this.chatWidget).toBeVisible();
      return true;
    }
    return false;
  }

  async verifyEyeIcon() {
    if (await this.eyeIcon.count() > 0) {
      await expect(this.eyeIcon.first()).toBeVisible();
      return true;
    }
    return false;
  }

  async fillFormData(firstName: string, lastName: string, email: string, password: string) {
    if (await this.firstNameInput.count() > 0) {
      await this.firstNameInput.fill(firstName);
    }
    
    if (await this.lastNameInput.count() > 0) {
      await this.lastNameInput.fill(lastName);
    }
    
    if (await this.emailInput.count() > 0) {
      await this.emailInput.fill(email);
    }
    
    if (await this.passwordInput.count() > 0) {
      await this.passwordInput.fill(password);
    }
    
    if (await this.confirmPasswordInput.count() > 0) {
      await this.confirmPasswordInput.fill(password);
    }
  }

  async clearFormData() {
    if (await this.firstNameInput.count() > 0) {
      await this.firstNameInput.clear();
    }
    
    if (await this.lastNameInput.count() > 0) {
      await this.lastNameInput.clear();
    }
    
    if (await this.emailInput.count() > 0) {
      await this.emailInput.clear();
    }
    
    if (await this.passwordInput.count() > 0) {
      await this.passwordInput.clear();
    }
    
    if (await this.confirmPasswordInput.count() > 0) {
      await this.confirmPasswordInput.clear();
    }
  }

  async isFormValid(): Promise<boolean> {
    // Check if all required fields have values
    const firstNameValue = await this.firstNameInput.inputValue();
    const lastNameValue = await this.lastNameInput.inputValue();
    const emailValue = await this.emailInput.inputValue();
    const passwordValue = await this.passwordInput.inputValue();
    const confirmPasswordValue = await this.confirmPasswordInput.inputValue();
    
    return firstNameValue.length > 0 && 
           lastNameValue.length > 0 && 
           emailValue.length > 0 && 
           passwordValue.length > 0 && 
           confirmPasswordValue.length > 0;
  }

  async verifyPasswordFieldsMatch(): Promise<boolean> {
    const passwordValue = await this.passwordInput.inputValue();
    const confirmPasswordValue = await this.confirmPasswordInput.inputValue();
    
    return passwordValue === confirmPasswordValue;
  }
}
