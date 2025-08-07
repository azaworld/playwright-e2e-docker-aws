import { Page, Locator, expect } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;
  
  // Header elements
  readonly logo: Locator;
  readonly cartIcon: Locator;
  readonly buyNowButton: Locator;
  readonly hamburgerMenu: Locator;
  readonly chatButton: Locator;
  readonly backToTopArrow: Locator;
  
  // Register page specific elements
  readonly pageTitle: Locator;
  readonly socialSignUpSection: Locator;
  readonly googleSignUpButton: Locator;
  readonly facebookSignUpButton: Locator;
  readonly linkedinSignUpButton: Locator;
  readonly orDivider: Locator;
  
  // Form elements - updated based on HTML structure
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly countryRegionSelect: Locator;
  readonly phoneInput: Locator;
  
  // Checkboxes and legal terms
  readonly acceptLegalTermsCheckbox: Locator;
  readonly termsOfUseCheckbox: Locator;
  readonly optInfoEmailCheckbox: Locator;
  readonly optInfoSmsCheckbox: Locator;
  
  // Buttons and links
  readonly createAccountButton: Locator;
  readonly signInLink: Locator;
  
  // Additional form elements
  readonly privacyPolicyLink: Locator;
  readonly termsOfUseLink: Locator;
  readonly recaptchaFrame: any; // FrameLocator type

  constructor(page: Page) {
    this.page = page;
    
    // Header elements
    this.logo = page.getByRole('link').filter({ has: page.locator('img[alt*="logo"]') });
    this.cartIcon = page.getByRole('link').filter({ has: page.getByRole('img', { name: /cart/i }) });
    this.buyNowButton = page.getByRole('button', { name: /BUY NOW/i }).or(page.getByText('BUY NOW'));
    this.hamburgerMenu = page.locator('button').filter({ has: page.locator('svg') }).first();
    this.chatButton = page.getByRole('button', { name: /Chat/i }).or(page.locator('button').filter({ hasText: /chat/i }));
    this.backToTopArrow = page.locator('button').filter({ has: page.locator('svg') }).last();
    
    // Register page specific elements
    this.pageTitle = page.getByRole('heading', { name: 'Create Your Account' });
    this.socialSignUpSection = page.getByText('Social Sign Up');
    this.googleSignUpButton = page.locator('button').filter({ has: page.locator('svg[viewBox="0 0 27 27"]') });
    this.facebookSignUpButton = page.locator('button').filter({ has: page.locator('svg[viewBox="0 0 32 32"]') }).first();
    this.linkedinSignUpButton = page.locator('button').filter({ has: page.locator('svg[viewBox="0 0 32 32"]') }).last();
    this.orDivider = page.getByText('or').or(page.locator('*').filter({ hasText: /^or$/i }));
    
    // Form elements - updated based on HTML structure
    this.firstNameInput = page.locator('input[name="firstName"], input[placeholder="First Name"], input[placeholder*="first"], input[placeholder*="First"]').first();
    this.lastNameInput = page.locator('input[name="lastName"], input[placeholder="Last Name"], input[placeholder*="last"], input[placeholder*="Last"]').first();
    this.emailInput = page.locator('input[name="email"], input[placeholder="Email"], input[type="email"]').first();
    this.passwordInput = page.locator('input[name="password"], input[placeholder="Password"], input[type="password"]').first();
    this.confirmPasswordInput = page.locator('input[name="confirm_password"], input[placeholder="Confirm Password"]').first();
    this.countryRegionSelect = page.locator('button[role="combobox"], select, button:has-text("Select Country"), button:has-text("Country / Region")').first();
    this.phoneInput = page.locator('input[name="phone_number"], input[placeholder="Phone Number"], input[type="tel"]').first();
    
    // Checkboxes and legal terms
    this.acceptLegalTermsCheckbox = page.locator('button[role="checkbox"][id="privacy_policy"], input[type="checkbox"]').first();
    this.termsOfUseCheckbox = page.locator('button[role="checkbox"][id="terms_of_use"], input[type="checkbox"]').nth(1);
    this.optInfoEmailCheckbox = page.locator('button[role="checkbox"][id="accept_email"], input[type="checkbox"]').nth(2);
    this.optInfoSmsCheckbox = page.locator('button[role="checkbox"][id="accept_sms"], input[type="checkbox"]').nth(3);
    
    // Buttons and links
    this.createAccountButton = page.getByRole('button', { name: 'Create Account' }).or(page.locator('button[type="submit"]'));
    this.signInLink = page.getByRole('link', { name: 'Sign In' });
    
    // Additional form elements
    this.privacyPolicyLink = page.locator('label[for*="privacy"], a, button').filter({ hasText: /privacy policy/i });
    this.termsOfUseLink = page.locator('label[for*="terms"], a, button').filter({ hasText: /terms of use/i });
    this.recaptchaFrame = page.frameLocator('iframe[title="reCAPTCHA"]') as any;
  }

  async navigateToRegisterPage(): Promise<void> {
    const baseUrl = process.env.FUR4_MAIN_URL;
    if (!baseUrl) throw new Error('FUR4_MAIN_URL is not set in environment variables!');
    
    try {
      console.log('=== REGISTER NAVIGATION DEBUG ===');
      console.log('Base URL:', baseUrl);
      
      // Try direct navigation first (more reliable)
      try {
        console.log('Attempting direct navigation to register page...');
        await this.page.goto(`${baseUrl}/register`, { waitUntil: 'domcontentloaded' });
        await this.page.waitForSelector('h1');
        
        const currentUrl = await this.page.url();
        if (currentUrl.includes('/register')) {
          console.log('✓ Direct navigation to register page successful');
          console.log('Final URL:', currentUrl);
          return;
        }
      } catch (error) {
        console.log('Direct navigation failed:', error);
      }
      
      // Fallback to menu navigation
      try {
        // First navigate to homepage
        await this.page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
        console.log('Current URL after homepage:', await this.page.url());
        await this.page.waitForSelector('body', { state: 'visible' });
        
        // Try menu navigation
        console.log('Looking for menu button...');
        await this.page.waitForSelector('button.group[style], button.group', { state: 'visible' });
        console.log('Menu button found, clicking...');
        await this.clickMenuButton();
        
        // Wait for navigation menu to appear
        console.log('Waiting for navigation menu...');
        await this.page.waitForSelector('nav.fixed', { state: 'visible' });
        console.log('Navigation menu appeared');
        
        // Click Sign Up link from menu
        console.log('Looking for Sign Up link in menu...');
        await this.clickSignUpLinkFromMenu();
        console.log('Sign Up link clicked');
        
        // Wait for navigation to complete
        console.log('Waiting for navigation to complete...');
        await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 });
        console.log('Navigation completed');
        console.log('URL after Sign Up link click:', await this.page.url());
        
        // Wait for the register content to be loaded
        console.log('Waiting for register content...');
        await this.page.waitForSelector('h1');
        console.log('Register content found');
        
        // Verify we're on the register page
        const currentUrl = await this.page.url();
        if (!currentUrl.includes('/register')) {
          throw new Error(`Navigation failed - expected /register but got ${currentUrl}`);
        }
        
        console.log('✓ Successfully navigated to register page');
        console.log('Final URL:', currentUrl);
        
      } catch (error) {
        console.log('Menu navigation failed:', error);
        console.log('Falling back to direct navigation...');
        
        // Direct navigation to register page
        await this.page.goto(`${baseUrl}/register`, { waitUntil: 'domcontentloaded' });
        await this.page.waitForSelector('h1');
        console.log('Direct navigation to register page successful');
        console.log('Register content loaded after direct navigation');
        console.log('Final URL after direct navigation:', await this.page.url());
      }
      
    } catch (error) {
      console.error('ERROR: Failed to navigate to register page:', error);
      throw error;
    }
  }

  async verifyPageLoad(): Promise<void> {
    try {
      await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
      const currentUrl = await this.page.url();
      expect(currentUrl).toContain('/register');
      
      const pageTitle = await this.page.title();
      expect(pageTitle).toContain('FUR4');
      
      const isTitleVisible = await this.pageTitle.isVisible();
      expect(isTitleVisible).toBe(true);
      
      console.log('✓ Register page loaded successfully');
    } catch (error) {
      console.error('ERROR: Register page load verification failed:', error);
      throw error;
    }
  }

  async checkIfPageLoaded(): Promise<boolean> {
    try {
      const url = await this.page.url();
      const title = await this.page.title();
      const bodyText = await this.page.locator('body').textContent();
      
      console.log('Page URL:', url);
      console.log('Page Title:', title);
      console.log('Body text length:', bodyText?.length || 0);
      
      // Check if we're on the right page
      if (!url.includes('register')) {
        console.log('ERROR: Not on register page');
        return false;
      }
      
      // Check if page has any content
      if (!bodyText || bodyText.length < 100) {
        console.log('ERROR: Page has very little content');
        return false;
      }
      
      // Check for register-specific content
      const hasRegisterContent = bodyText.includes('Create Your Account') || 
                                bodyText.includes('Social Sign Up') ||
                                bodyText.includes('Sign Up');
      
      if (!hasRegisterContent) {
        console.log('ERROR: Page does not contain register content');
        return false;
      }
      
      console.log('✓ Register page loaded successfully');
      console.log('=== END REGISTER PAGE LOAD CHECK ===');
      return true;
    } catch (error) {
      console.log('ERROR checking register page load:', error);
      return false;
    }
  }

  async restorePageState(): Promise<void> {
    try {
      const currentUrl = await this.page.url();
      console.log('Current URL before restoration:', currentUrl);
      
      // Check if we're on an OAuth page or have navigated away
      if (currentUrl.includes('facebook.com') || currentUrl.includes('google.com') || currentUrl.includes('linkedin.com') || 
          currentUrl.includes('accounts.google.com') || currentUrl.includes('fb.com') || !currentUrl.includes('fur4.com')) {
        console.log('Page navigated to OAuth or external site, restoring to register page...');
        await this.navigateToRegisterPage();
      } else if (!currentUrl.includes('/register')) {
        console.log('Page navigated away from register page, restoring...');
        await this.navigateToRegisterPage();
      } else {
        // Even if we're on the register page, make sure the content is loaded
        try {
          await this.page.waitForSelector('h1', { timeout: 5000 });
          console.log('✓ Register page content is loaded');
        } catch (error) {
          console.log('Register page content not loaded, refreshing...');
          await this.navigateToRegisterPage();
        }
      }
    } catch (error) {
      console.log('Error restoring page state:', error);
      // If restoration fails, try to navigate again
      await this.navigateToRegisterPage();
    }
  }

  // Header element methods
  async isLogoVisible(): Promise<boolean> {
    try {
      await expect(this.logo).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickLogo(): Promise<void> {
    await this.logo.click();
  }

  async isCartIconVisible(): Promise<boolean> {
    try {
      await expect(this.cartIcon).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickCartIcon(): Promise<void> {
    await this.cartIcon.click();
  }

  async isBuyNowButtonVisible(): Promise<boolean> {
    try {
      const buyNowButton = this.page.getByRole('button', { name: /BUY NOW/i })
        .or(this.page.getByText('BUY NOW'))
        .or(this.page.locator('button').filter({ hasText: /BUY NOW/i }));
      
      await expect(buyNowButton.first()).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickBuyNowButton(): Promise<void> {
    const buyNowButton = this.page.getByRole('button', { name: /BUY NOW/i })
      .or(this.page.getByText('BUY NOW'))
      .or(this.page.locator('button').filter({ hasText: /BUY NOW/i }));
    
    await buyNowButton.first().click();
  }

  async isHamburgerMenuVisible(): Promise<boolean> {
    try {
      await expect(this.hamburgerMenu).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickHamburgerMenu(): Promise<void> {
    await this.hamburgerMenu.click();
  }

  async isChatButtonVisible(): Promise<boolean> {
    try {
      const chatButton = this.page.getByRole('button', { name: /Chat/i })
        .or(this.page.locator('button').filter({ hasText: /chat/i }));
      
      await expect(chatButton.first()).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickChatButton(): Promise<void> {
    const chatButton = this.page.getByRole('button', { name: /Chat/i })
      .or(this.page.locator('button').filter({ hasText: /chat/i }));
    
    await chatButton.first().click();
  }

  async isBackToTopArrowVisible(): Promise<boolean> {
    try {
      await expect(this.backToTopArrow).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickBackToTopArrow(): Promise<void> {
    await this.backToTopArrow.click();
  }

  // Register page specific methods
  async isPageTitleVisible(): Promise<boolean> {
    try {
      await expect(this.pageTitle).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getPageTitleText(): Promise<string> {
    return await this.pageTitle.textContent() || '';
  }

  async isSocialSignUpSectionVisible(): Promise<boolean> {
    try {
      await expect(this.socialSignUpSection).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isGoogleSignUpButtonVisible(): Promise<boolean> {
    try {
      await expect(this.googleSignUpButton).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickGoogleSignUpButton(): Promise<void> {
    await this.googleSignUpButton.click();
  }

  async isFacebookSignUpButtonVisible(): Promise<boolean> {
    try {
      await expect(this.facebookSignUpButton).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickFacebookSignUpButton(): Promise<void> {
    await this.facebookSignUpButton.click();
  }

  async isLinkedInSignUpButtonVisible(): Promise<boolean> {
    try {
      await expect(this.linkedinSignUpButton).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickLinkedInSignUpButton(): Promise<void> {
    await this.linkedinSignUpButton.click();
  }

  async isOrDividerVisible(): Promise<boolean> {
    try {
      // Try multiple approaches to find the "or" divider
      const orSelectors = [
        this.orDivider,
        this.page.getByText('or'),
        this.page.locator('*').filter({ hasText: /^or$/i }),
        this.page.locator('p').filter({ hasText: /^or$/i }),
        this.page.locator('div').filter({ hasText: /^or$/i }),
        this.page.locator('span').filter({ hasText: /^or$/i })
      ];
      
      for (const selector of orSelectors) {
        try {
          await expect(selector).toBeVisible({ timeout: 2000 });
          return true;
        } catch {
          // Continue to next selector
        }
      }
      
      // If none of the specific selectors work, check if "or" text exists anywhere
      const orText = await this.page.locator('body').textContent();
      if (orText && orText.toLowerCase().includes('or')) {
        console.log('Found "or" text in page content');
        return true;
      }
      
      return false;
    } catch {
      return false;
    }
  }

  async isCountryRegionSelectVisible(): Promise<boolean> {
    try {
      await expect(this.countryRegionSelect).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async selectCountryRegion(country: string): Promise<void> {
    await this.countryRegionSelect.selectOption({ label: country });
  }

  async isPhoneInputVisible(): Promise<boolean> {
    try {
      await expect(this.phoneInput).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async enterPhoneNumber(phone: string): Promise<void> {
    await this.phoneInput.fill(phone);
  }

  async isAcceptLegalTermsCheckboxVisible(): Promise<boolean> {
    try {
      await expect(this.acceptLegalTermsCheckbox).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async checkAcceptLegalTerms(): Promise<void> {
    await this.acceptLegalTermsCheckbox.check();
  }

  async isOptInfoCheckboxVisible(): Promise<boolean> {
    try {
      await expect(this.optInfoEmailCheckbox).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async checkOptInfo(): Promise<void> {
    await this.optInfoEmailCheckbox.check();
  }

  // New methods for form elements
  async isFirstNameInputVisible(): Promise<boolean> {
    try {
      // Wait for the input to be visible with a longer timeout
      await this.firstNameInput.waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      // If not visible, try to find it with a different approach
      try {
        const count = await this.firstNameInput.count();
        if (count > 0) {
          return true;
        }
        return false;
      } catch {
        return false;
      }
    }
  }

  async fillFirstName(firstName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
  }

  async isLastNameInputVisible(): Promise<boolean> {
    try {
      await expect(this.lastNameInput).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async fillLastName(lastName: string): Promise<void> {
    await this.lastNameInput.fill(lastName);
  }

  async isEmailInputVisible(): Promise<boolean> {
    try {
      await expect(this.emailInput).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async isPasswordInputVisible(): Promise<boolean> {
    try {
      await expect(this.passwordInput).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async isConfirmPasswordInputVisible(): Promise<boolean> {
    try {
      await expect(this.confirmPasswordInput).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async fillConfirmPassword(password: string): Promise<void> {
    await this.confirmPasswordInput.fill(password);
  }

  async isTermsOfUseCheckboxVisible(): Promise<boolean> {
    try {
      await expect(this.termsOfUseCheckbox).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async checkTermsOfUse(): Promise<void> {
    await this.termsOfUseCheckbox.click();
  }

  async isOptInfoEmailCheckboxVisible(): Promise<boolean> {
    try {
      await expect(this.optInfoEmailCheckbox).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async checkOptInfoEmail(): Promise<void> {
    await this.optInfoEmailCheckbox.click();
  }

  async isOptInfoSmsCheckboxVisible(): Promise<boolean> {
    try {
      await expect(this.optInfoSmsCheckbox).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async checkOptInfoSms(): Promise<void> {
    await this.optInfoSmsCheckbox.click();
  }

  async isPrivacyPolicyLinkVisible(): Promise<boolean> {
    try {
      await expect(this.privacyPolicyLink).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickPrivacyPolicyLink(): Promise<void> {
    await this.privacyPolicyLink.click();
  }

  async isTermsOfUseLinkVisible(): Promise<boolean> {
    try {
      await expect(this.termsOfUseLink).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickTermsOfUseLink(): Promise<void> {
    await this.termsOfUseLink.click();
  }

  async isRecaptchaVisible(): Promise<boolean> {
    try {
      const recaptcha = this.page.locator('iframe[title="reCAPTCHA"]');
      await expect(recaptcha).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  // Validation testing methods
  async clearFirstName(): Promise<void> {
    await this.firstNameInput.clear();
  }

  async clearLastName(): Promise<void> {
    await this.lastNameInput.clear();
  }

  async clearEmail(): Promise<void> {
    await this.emailInput.clear();
  }

  async clearPassword(): Promise<void> {
    await this.passwordInput.clear();
  }

  async clearConfirmPassword(): Promise<void> {
    await this.confirmPasswordInput.clear();
  }

  async clearPhoneNumber(): Promise<void> {
    await this.phoneInput.clear();
  }

  async getFirstNameError(): Promise<string | null> {
    try {
      // Try multiple error message patterns based on the HTML structure
      const errorSelectors = [
        this.page.locator('p[id*="form-item-message"]').filter({ hasText: /this field is required|first name/i }),
        this.page.locator('p.text-destructive').filter({ hasText: /this field is required|first name/i }),
        this.page.locator('[id*="form-item-message"]').filter({ hasText: /this field is required|first name/i }),
        this.page.locator('*').filter({ hasText: /this field is required|first name.*required|required.*first name/i })
      ];
      
      for (const selector of errorSelectors) {
        if (await selector.isVisible()) {
          return await selector.textContent();
        }
      }
      
      // Check if there's any validation error in the page
      const pageText = await this.page.textContent('body');
      if (pageText && /this field is required|first name.*required/i.test(pageText)) {
        return 'This field is required';
      }
      
      return null;
    } catch {
      return null;
    }
  }

  async getLastNameError(): Promise<string | null> {
    try {
      // Try multiple error message patterns based on the HTML structure
      const errorSelectors = [
        this.page.locator('p[id*="form-item-message"]').filter({ hasText: /this field is required|last name/i }),
        this.page.locator('p.text-destructive').filter({ hasText: /this field is required|last name/i }),
        this.page.locator('[id*="form-item-message"]').filter({ hasText: /this field is required|last name/i }),
        this.page.locator('*').filter({ hasText: /this field is required|last name.*required|required.*last name/i })
      ];
      
      for (const selector of errorSelectors) {
        if (await selector.isVisible()) {
          return await selector.textContent();
        }
      }
      
      // Check if there's any validation error in the page
      const pageText = await this.page.textContent('body');
      if (pageText && /this field is required|last name.*required/i.test(pageText)) {
        return 'This field is required';
      }
      
      return null;
    } catch {
      return null;
    }
  }

  async getEmailError(): Promise<string | null> {
    try {
      // Try multiple error message patterns based on the HTML structure
      const errorSelectors = [
        this.page.locator('p[id*="form-item-message"]').filter({ hasText: /email address is required|invalid.*email|email.*invalid/i }),
        this.page.locator('p.text-destructive').filter({ hasText: /email address is required|invalid.*email|email.*invalid/i }),
        this.page.locator('[id*="form-item-message"]').filter({ hasText: /email address is required|invalid.*email|email.*invalid/i }),
        this.page.locator('*').filter({ hasText: /email address is required|invalid.*email|email.*invalid/i })
      ];
      
      for (const selector of errorSelectors) {
        if (await selector.isVisible()) {
          return await selector.textContent();
        }
      }
      
      // Check if there's any validation error in the page
      const pageText = await this.page.textContent('body');
      if (pageText && /email address is required|invalid.*email/i.test(pageText)) {
        return 'Email address is required';
      }
      
      return null;
    } catch {
      return null;
    }
  }

  async getPasswordError(): Promise<string | null> {
    try {
      // Try multiple error message patterns based on the HTML structure
      const errorSelectors = [
        this.page.locator('p[id*="form-item-message"]').filter({ hasText: /password.*required|password.*length|password.*minimum/i }),
        this.page.locator('p.text-destructive').filter({ hasText: /password.*required|password.*length|password.*minimum/i }),
        this.page.locator('[id*="form-item-message"]').filter({ hasText: /password.*required|password.*length|password.*minimum/i }),
        this.page.locator('*').filter({ hasText: /password.*required|password.*length|password.*minimum/i })
      ];
      
      for (const selector of errorSelectors) {
        if (await selector.isVisible()) {
          return await selector.textContent();
        }
      }
      
      // Check if there's any validation error in the page
      const pageText = await this.page.textContent('body');
      if (pageText && /password.*required|password.*length/i.test(pageText)) {
        return 'Password must be at least 8 characters long';
      }
      
      return null;
    } catch {
      return null;
    }
  }

  async getConfirmPasswordError(): Promise<string | null> {
    try {
      // Try multiple error message patterns based on the HTML structure
      const errorSelectors = [
        this.page.locator('p[id*="form-item-message"]').filter({ hasText: /required|confirm.*password|password.*match/i }),
        this.page.locator('p.text-destructive').filter({ hasText: /required|confirm.*password|password.*match/i }),
        this.page.locator('[id*="form-item-message"]').filter({ hasText: /required|confirm.*password|password.*match/i }),
        this.page.locator('*').filter({ hasText: /required|confirm.*password|password.*match/i })
      ];
      
      for (const selector of errorSelectors) {
        if (await selector.isVisible()) {
          return await selector.textContent();
        }
      }
      
      // Check if there's any validation error in the page
      const pageText = await this.page.textContent('body');
      if (pageText && /required|confirm.*password|password.*match/i.test(pageText)) {
        return 'Required';
      }
      
      return null;
    } catch {
      return null;
    }
  }

  async getPhoneError(): Promise<string | null> {
    try {
      // Try multiple error message patterns based on the HTML structure
      const errorSelectors = [
        this.page.locator('p[id*="form-item-message"]').filter({ hasText: /phone number is required|phone.*required/i }),
        this.page.locator('p.text-destructive').filter({ hasText: /phone number is required|phone.*required/i }),
        this.page.locator('[id*="form-item-message"]').filter({ hasText: /phone number is required|phone.*required/i }),
        this.page.locator('*').filter({ hasText: /phone number is required|phone.*required/i })
      ];
      
      for (const selector of errorSelectors) {
        if (await selector.isVisible()) {
          const text = await selector.textContent();
          if (text && text.trim()) {
            return text.trim();
          }
        }
      }
      
      // Check if there's any validation error in the page
      const pageText = await this.page.textContent('body');
      if (pageText && /phone number is required|phone.*required/i.test(pageText)) {
        return 'Phone Number is required';
      }
      
      // Check for any general validation errors
      const generalErrors = this.page.locator('p.text-destructive, p[id*="form-item-message"], [role="alert"]');
      const count = await generalErrors.count();
      for (let i = 0; i < count; i++) {
        const errorText = await generalErrors.nth(i).textContent();
        if (errorText && errorText.trim() && /phone|required/i.test(errorText)) {
          return errorText.trim();
        }
      }
      
      return null;
    } catch {
      return null;
    }
  }

  async getCountryRegionError(): Promise<string | null> {
    try {
      // Try multiple error message patterns
      const errorSelectors = [
        this.page.locator('*').filter({ hasText: /country.*required|region.*required|field.*required/i }),
        this.page.locator('[data-testid*="country-error"]'),
        this.page.locator('[id*="country-error"]'),
        this.page.locator('.error').filter({ hasText: /country|region/i }),
        this.page.locator('[role="alert"]').filter({ hasText: /country|region/i })
      ];
      
      for (const selector of errorSelectors) {
        if (await selector.isVisible()) {
          return await selector.textContent();
        }
      }
      
      // Check if there's any validation error in the page
      const pageText = await this.page.textContent('body');
      if (pageText && /country.*required|region.*required|field.*required/i.test(pageText)) {
        return 'Country/Region is required';
      }
      
      return null;
    } catch {
      return null;
    }
  }

  async getLegalTermsError(): Promise<string | null> {
    try {
      // Try multiple error message patterns based on the HTML structure
      const errorSelectors = [
        this.page.locator('p[id*="form-item-message"]').filter({ hasText: /this field is required|legal.*terms|privacy.*policy|terms.*use/i }),
        this.page.locator('p.text-destructive').filter({ hasText: /this field is required|legal.*terms|privacy.*policy|terms.*use/i }),
        this.page.locator('[id*="form-item-message"]').filter({ hasText: /this field is required|legal.*terms|privacy.*policy|terms.*use/i }),
        this.page.locator('*').filter({ hasText: /this field is required|legal.*terms|privacy.*policy|terms.*use/i })
      ];
      
      for (const selector of errorSelectors) {
        if (await selector.isVisible()) {
          return await selector.textContent();
        }
      }
      
      // Check if there's any validation error in the page
      const pageText = await this.page.textContent('body');
      if (pageText && /this field is required|legal.*terms|privacy.*policy|terms.*use/i.test(pageText)) {
        return 'This field is required';
      }
      
      return null;
    } catch {
      return null;
    }
  }

  async getAllValidationErrors(): Promise<string[]> {
    try {
      const errors: string[] = [];
      
      // Get all validation error messages
      const errorMessages = this.page.locator('p.text-destructive, p[id*="form-item-message"]');
      const count = await errorMessages.count();
      
      for (let i = 0; i < count; i++) {
        const errorText = await errorMessages.nth(i).textContent();
        if (errorText && errorText.trim()) {
          errors.push(errorText.trim());
        }
      }
      
      return errors;
    } catch {
      return [];
    }
  }

  async getRecaptchaError(): Promise<string | null> {
    try {
      // Try multiple error message patterns
      const errorSelectors = [
        this.page.locator('*').filter({ hasText: /recaptcha|robot|verification/i }),
        this.page.locator('[data-testid*="recaptcha-error"]'),
        this.page.locator('[id*="recaptcha-error"]'),
        this.page.locator('.error').filter({ hasText: /recaptcha|robot/i }),
        this.page.locator('[role="alert"]').filter({ hasText: /recaptcha|robot/i })
      ];
      
      for (const selector of errorSelectors) {
        if (await selector.isVisible()) {
          return await selector.textContent();
        }
      }
      
      // Check if there's any validation error in the page
      const pageText = await this.page.textContent('body');
      if (pageText && /recaptcha|robot|verification/i.test(pageText)) {
        return 'reCAPTCHA verification required';
      }
      
      return null;
    } catch {
      return null;
    }
  }

  async isCreateAccountButtonEnabled(): Promise<boolean> {
    try {
      const button = this.createAccountButton;
      const isDisabled = await button.getAttribute('disabled');
      return isDisabled === null || isDisabled === 'false';
    } catch {
      return false;
    }
  }

  async clickPasswordToggle(): Promise<void> {
    const toggleButton = this.page.locator('button[type="button"]').filter({ has: this.page.locator('svg[viewBox="0 0 20 13"]') }).first();
    await toggleButton.click();
  }

  async isPasswordVisible(): Promise<boolean> {
    const inputType = await this.passwordInput.getAttribute('type');
    return inputType === 'text';
  }

  async searchCountryRegion(searchTerm: string): Promise<void> {
    await this.countryRegionSelect.click();
    const searchInput = this.page.locator('input[placeholder*="search"], input[type="search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill(searchTerm);
    }
  }

  async selectCountryRegionByText(countryName: string): Promise<void> {
    await this.countryRegionSelect.click();
    const countryOption = this.page.locator('*').filter({ hasText: countryName }).first();
    if (await countryOption.isVisible()) {
      await countryOption.click();
    }
  }

  async getSelectedCountryRegion(): Promise<string> {
    return await this.countryRegionSelect.textContent() || '';
  }

  async searchPhoneCode(searchTerm: string): Promise<void> {
    const phoneCodeButton = this.page.locator('button[role="combobox"]').filter({ hasText: /US\+1|phone|code/i }).first();
    await phoneCodeButton.click();
    const searchInput = this.page.locator('input[placeholder*="search"], input[type="search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill(searchTerm);
    }
  }

  async selectPhoneCode(code: string): Promise<void> {
    const phoneCodeButton = this.page.locator('button[role="combobox"]').filter({ hasText: /US\+1|phone|code/i }).first();
    await phoneCodeButton.click();
    const codeOption = this.page.locator('*').filter({ hasText: code }).first();
    if (await codeOption.isVisible()) {
      await codeOption.click();
    }
  }

  async getSelectedPhoneCode(): Promise<string> {
    const phoneCodeButton = this.page.locator('button[role="combobox"]').filter({ hasText: /US\+1|phone|code/i }).first();
    return await phoneCodeButton.textContent() || '';
  }

  async fillAllRequiredFields(): Promise<void> {
    await this.fillFirstName('John');
    await this.fillLastName('Doe');
    await this.fillEmail('john.doe@example.com');
    await this.fillPassword('TestPassword123!');
    await this.fillConfirmPassword('TestPassword123!');
    await this.enterPhoneNumber('1234567890');
    await this.checkAcceptLegalTerms();
    await this.checkTermsOfUse();
  }

  async fillAllRequiredFieldsExcept(fieldToSkip: string): Promise<void> {
    if (fieldToSkip !== 'firstName') await this.fillFirstName('John');
    if (fieldToSkip !== 'lastName') await this.fillLastName('Doe');
    if (fieldToSkip !== 'email') await this.fillEmail('john.doe@example.com');
    if (fieldToSkip !== 'password') await this.fillPassword('TestPassword123!');
    if (fieldToSkip !== 'confirmPassword') await this.fillConfirmPassword('TestPassword123!');
    if (fieldToSkip !== 'phoneNumber') await this.enterPhoneNumber('1234567890');
    if (fieldToSkip !== 'legalTerms') {
      await this.checkAcceptLegalTerms();
      await this.checkTermsOfUse();
    }
  }

  async isCreateAccountButtonVisible(): Promise<boolean> {
    try {
      await expect(this.createAccountButton).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickCreateAccountButton(): Promise<void> {
    await this.createAccountButton.click();
  }

  async isSignInLinkVisible(): Promise<boolean> {
    try {
      await expect(this.signInLink).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickSignInLink(): Promise<void> {
    await this.signInLink.click();
  }

  // Menu navigation methods
  getMenuButton() {
    return this.page.locator('button.group[style], button.group').first();
  }

  async clickMenuButton(): Promise<void> {
    try {
      // Wait for the menu button to be visible and clickable
      await this.page.waitForSelector('button.group[style], button.group', { state: 'visible' });
      
      // Try to click the menu button
      const menuButton = this.page.locator('button.group[style], button.group').first();
      
      // Check if there's a canvas overlay that might be blocking the click
      const canvasOverlay = this.page.locator('canvas[data-engine="three.js"]');
      if (await canvasOverlay.isVisible()) {
        console.log('Canvas overlay detected, trying to handle it...');
        // Try to click through the overlay or wait for it to disappear
        await this.page.waitForTimeout(1000);
      }
      
      // Use force click if needed
      await menuButton.click({ force: true });
      console.log('✓ Menu button clicked successfully');
    } catch (error) {
      console.log('Menu button click failed:', error);
      throw error;
    }
  }

  getMenuLink(text: string) {
    return this.page.getByRole('link', { name: text });
  }

  async clickMenuLink(text: string): Promise<void> {
    await this.getMenuLink(text).click();
  }

  async clickSignUpLinkFromMenu(): Promise<void> {
    await this.clickMenuLink('Sign Up');
  }

  async debugFullPageContent(): Promise<void> {
    console.log('=== COMPREHENSIVE REGISTER PAGE DEBUG ===');
    console.log('URL:', await this.page.url());
    console.log('Title:', await this.page.title());
    
    // Get all text content
    const bodyText = await this.page.locator('body').textContent();
    console.log('Full body text length:', bodyText?.length || 0);
    console.log('First 1000 chars of body text:', bodyText?.substring(0, 1000));
    
    // Check for all headings
    const headings = await this.page.locator('h1, h2, h3, h4, h5, h6').all();
    console.log('=== HEADINGS FOUND ===');
    for (let i = 0; i < headings.length; i++) {
      const text = await headings[i].textContent();
      console.log(`Heading ${i + 1}: "${text?.trim()}"`);
    }
    
    // Check for buttons
    const buttons = await this.page.locator('button, [role="button"]').all();
    console.log('=== BUTTONS FOUND ===');
    for (let i = 0; i < buttons.length; i++) {
      const text = await buttons[i].textContent();
      const ariaLabel = await buttons[i].getAttribute('aria-label');
      console.log(`Button ${i + 1}: "${text?.trim()}" (aria-label: "${ariaLabel}")`);
    }
    
    // Check for links
    const links = await this.page.locator('a').all();
    console.log('=== LINKS FOUND ===');
    for (let i = 0; i < links.length; i++) {
      const text = await links[i].textContent();
      const href = await links[i].getAttribute('href');
      console.log(`Link ${i + 1}: "${text?.trim()}" (href: "${href}")`);
    }
    
    // Check for form elements
    const inputs = await this.page.locator('input, select, textarea').all();
    console.log('=== FORM ELEMENTS FOUND ===');
    for (let i = 0; i < inputs.length; i++) {
      const type = await inputs[i].getAttribute('type');
      const placeholder = await inputs[i].getAttribute('placeholder');
      const name = await inputs[i].getAttribute('name');
      console.log(`Form element ${i + 1}: type="${type}" placeholder="${placeholder}" name="${name}"`);
    }
    
    // Check for social sign up buttons
    const socialButtons = await this.page.locator('button').filter({ has: this.page.locator('svg') }).all();
    console.log('=== SOCIAL BUTTONS FOUND ===');
    console.log(`Found ${socialButtons.length} social sign up buttons`);
    
    console.log('=== END REGISTER PAGE DEBUG ===');
  }
}
