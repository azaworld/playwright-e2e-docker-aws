import { Page, Locator, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

export class SignInPage {
  readonly page: Page;
  
  // Header elements
  readonly pageTitle: Locator;
  readonly socialSignInSection: Locator;
  readonly orDivider: Locator;
  
  // Social sign in buttons
  readonly googleSignInButton: Locator;
  readonly facebookSignInButton: Locator;
  readonly linkedinSignInButton: Locator;
  
  // Tab buttons
  readonly emailTab: Locator;
  readonly phoneTab: Locator;
  
  // Form elements
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly passwordInput: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly continueButton: Locator;
  
  // Links
  readonly signUpLink: Locator;
  
  // Error messages
  readonly emailError: Locator;
  readonly phoneError: Locator;
  readonly passwordError: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Header elements
    this.pageTitle = page.locator('h1').filter({ hasText: /Sign In/i });
    this.socialSignInSection = page.locator('p').filter({ hasText: /Social Sign In/i });
    this.orDivider = page.locator('p').filter({ hasText: /^or$/i });
    
    // Social sign in buttons - based on SVG paths and structure
    this.googleSignInButton = page.locator('button:has(svg path[fill="#4285F4"])').first();
    this.facebookSignInButton = page.locator('button:has(svg path[fill="#385997"])').first();
    this.linkedinSignInButton = page.locator('button:has(svg path[fill="#2A7AB9"])').first();
    
    // Tab buttons
    this.emailTab = page.locator('button[aria-label="Enter your Email"]');
    this.phoneTab = page.locator('button[aria-label="Enter your Phone"]');
    
    // Form elements
    this.emailInput = page.locator('input[placeholder="Enter your Email"], input[name="email"]');
    this.phoneInput = page.locator('input[placeholder="Phone Number"], input[name="phone_number"]').first();
    this.passwordInput = page.locator('input[type="password"]');
    this.rememberMeCheckbox = page.locator('button[role="checkbox"]#terms, input[type="checkbox"]#terms');
    this.continueButton = page.locator('button[type="submit"]').filter({ hasText: /Continue/i });
    
    // Links
    this.signUpLink = page.locator('a[href="/register"]').filter({ hasText: /Sign Up/i });
    
    // Error messages
    this.emailError = page.locator('p.text-destructive, p[id*="form-item-message"]').filter({ hasText: /email/i });
    this.phoneError = page.locator('p.text-destructive, p[id*="form-item-message"]').filter({ hasText: /phone/i });
    this.passwordError = page.locator('p.text-destructive, p[id*="form-item-message"]').filter({ hasText: /password/i });
  }

  async navigateToSignInPage(): Promise<void> {
    try {
      // Try direct navigation first
      const baseUrl = process.env.FUR4_MAIN_URL || 'https://fur4.com';
      await this.page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' });
      await this.verifyPageLoad();
    } catch {
      // Fallback: navigate to home and click sign in
      const baseUrl = process.env.FUR4_MAIN_URL || 'https://fur4.com';
      await this.page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
      const signInLink = this.page.locator('a[href*="login"], a[href*="signin"], button:has-text("Sign In")').first();
      if (await signInLink.isVisible()) {
        await signInLink.click();
        await this.verifyPageLoad();
      } else {
        throw new Error('Could not navigate to Sign In page');
      }
    }
  }

  async verifyPageLoad(): Promise<void> {
    await expect(this.page).toHaveTitle(/sign in|login|fur4/i);
    await expect(this.pageTitle).toBeVisible({ timeout: 10000 });
    await expect(this.socialSignInSection).toBeVisible();
  }

  async checkIfPageLoaded(): Promise<boolean> {
    try {
      await this.verifyPageLoad();
      return true;
    } catch {
      return false;
    }
  }

  async isPageTitleVisible(): Promise<boolean> {
    return await this.pageTitle.isVisible();
  }

  async isSocialSignInSectionVisible(): Promise<boolean> {
    return await this.socialSignInSection.isVisible();
  }

  async isOrDividerVisible(): Promise<boolean> {
    try {
      return await this.orDivider.isVisible();
    } catch {
      // Fallback: check for "or" text in page content
      const pageText = await this.page.textContent('body');
      return pageText ? /or/i.test(pageText) : false;
    }
  }

  async isGoogleSignInButtonVisible(): Promise<boolean> {
    return await this.googleSignInButton.isVisible();
  }

  async isFacebookSignInButtonVisible(): Promise<boolean> {
    return await this.facebookSignInButton.isVisible();
  }

  async isLinkedInSignInButtonVisible(): Promise<boolean> {
    return await this.linkedinSignInButton.isVisible();
  }

  async clickGoogleSignInButton(): Promise<void> {
    await this.googleSignInButton.click();
  }

  async clickFacebookSignInButton(): Promise<void> {
    await this.facebookSignInButton.click();
  }

  async clickLinkedInSignInButton(): Promise<void> {
    await this.linkedinSignInButton.click();
  }

  async isEmailTabVisible(): Promise<boolean> {
    return await this.emailTab.isVisible();
  }

  async isPhoneTabVisible(): Promise<boolean> {
    return await this.phoneTab.isVisible();
  }

  async clickEmailTab(): Promise<void> {
    await this.emailTab.click();
  }

  async clickPhoneTab(): Promise<void> {
    await this.phoneTab.click();
  }

  async isEmailInputVisible(): Promise<boolean> {
    return await this.emailInput.isVisible();
  }

  async isPhoneInputVisible(): Promise<boolean> {
    return await this.phoneInput.isVisible();
  }

  async isPasswordInputVisible(): Promise<boolean> {
    return await this.passwordInput.isVisible();
  }

  async isRememberMeCheckboxVisible(): Promise<boolean> {
    return await this.rememberMeCheckbox.isVisible();
  }

  async isContinueButtonVisible(): Promise<boolean> {
    return await this.continueButton.isVisible();
  }

  async isSignUpLinkVisible(): Promise<boolean> {
    return await this.signUpLink.isVisible();
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPhone(phone: string): Promise<void> {
    try {
      // Wait for phone input to be visible
      await this.phoneInput.waitFor({ state: 'visible', timeout: 5000 });
      await this.phoneInput.fill(phone);
    } catch {
      // If phone input is not visible, try to find it after clicking phone tab
      await this.clickPhoneTab();
      await this.page.waitForTimeout(1000);
      const phoneInput = this.page.locator('input[placeholder="Phone Number"], input[name="phone_number"]').first();
      if (await phoneInput.isVisible()) {
        await phoneInput.fill(phone);
      } else {
        throw new Error('Phone input not found');
      }
    }
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clearEmail(): Promise<void> {
    await this.emailInput.clear();
  }

  async clearPhone(): Promise<void> {
    await this.phoneInput.clear();
  }

  async clearPassword(): Promise<void> {
    await this.passwordInput.clear();
  }

  async clickRememberMeCheckbox(): Promise<void> {
    await this.rememberMeCheckbox.click();
  }

  async isRememberMeChecked(): Promise<boolean> {
    try {
      const isChecked = await this.rememberMeCheckbox.getAttribute('aria-checked');
      if (isChecked === 'true') {
        return true;
      }
      
      // Alternative check for data-state attribute
      const dataState = await this.rememberMeCheckbox.getAttribute('data-state');
      if (dataState === 'checked') {
        return true;
      }
      
      // Check if the checkbox has the checked class or styling
      const hasCheckedClass = await this.rememberMeCheckbox.evaluate((el) => {
        return el.classList.contains('checked') || 
               el.classList.contains('data-[state=checked]') ||
               el.getAttribute('data-state') === 'checked';
      });
      
      return hasCheckedClass;
    } catch {
      return false;
    }
  }

  async clickContinueButton(): Promise<void> {
    await this.continueButton.click();
  }

  async clickSignUpLink(): Promise<void> {
    await this.signUpLink.click();
  }

  async getEmailError(): Promise<string | null> {
    try {
      const errorSelectors = [
        this.page.locator('p.text-destructive').filter({ hasText: /email/i }),
        this.page.locator('p[id*="form-item-message"]').filter({ hasText: /email/i }),
        this.page.locator('[id*="form-item-message"]').filter({ hasText: /email/i }),
        this.page.locator('p').filter({ hasText: /Email address is required/i }),
        this.page.locator('*').filter({ hasText: /email.*required|required.*email/i })
      ];
      
      for (const selector of errorSelectors) {
        if (await selector.isVisible()) {
          const text = await selector.textContent();
          if (text && text.trim()) {
            return text.trim();
          }
        }
      }
      
      // Check for error message in the current form - more comprehensive approach
      const currentError = this.page.locator('p.text-destructive, p[id*="form-item-message"], p.text-sm.text-destructive').first();
      if (await currentError.isVisible()) {
        const text = await currentError.textContent();
        if (text && (text.toLowerCase().includes('email') || text.toLowerCase().includes('required'))) {
          return text.trim();
        }
      }
      
      // Check for any error message on the page
      const allErrors = this.page.locator('p.text-destructive, p[id*="form-item-message"], p.text-sm.text-destructive');
      const count = await allErrors.count();
      for (let i = 0; i < count; i++) {
        const error = allErrors.nth(i);
        if (await error.isVisible()) {
          const text = await error.textContent();
          if (text && text.trim()) {
            return text.trim();
          }
        }
      }
      
      return null;
    } catch {
      return null;
    }
  }

  async getPhoneError(): Promise<string | null> {
    try {
      const errorSelectors = [
        this.page.locator('p.text-destructive').filter({ hasText: /phone/i }),
        this.page.locator('p[id*="form-item-message"]').filter({ hasText: /phone/i }),
        this.page.locator('[id*="form-item-message"]').filter({ hasText: /phone/i }),
        this.page.locator('p').filter({ hasText: /Phone Number is required/i }),
        this.page.locator('*').filter({ hasText: /phone.*required|required.*phone/i })
      ];
      
      for (const selector of errorSelectors) {
        if (await selector.isVisible()) {
          const text = await selector.textContent();
          if (text && text.trim()) {
            return text.trim();
          }
        }
      }
      
      // Check for error message in the current form
      const currentError = this.page.locator('p.text-destructive, p[id*="form-item-message"]').first();
      if (await currentError.isVisible()) {
        const text = await currentError.textContent();
        if (text && text.toLowerCase().includes('phone')) {
          return text.trim();
        }
      }
      
      return null;
    } catch {
      return null;
    }
  }

  async getPasswordError(): Promise<string | null> {
    try {
      const errorSelectors = [
        this.page.locator('p.text-destructive').filter({ hasText: /password/i }),
        this.page.locator('p[id*="form-item-message"]').filter({ hasText: /password/i }),
        this.page.locator('[id*="form-item-message"]').filter({ hasText: /password/i }),
        this.page.locator('*').filter({ hasText: /password.*required|required.*password/i })
      ];
      
      for (const selector of errorSelectors) {
        if (await selector.isVisible()) {
          return await selector.textContent();
        }
      }
      
      const pageText = await this.page.textContent('body');
      if (pageText && /password.*required|required.*password/i.test(pageText)) {
        return 'Password is required';
      }
      
      return null;
    } catch {
      return null;
    }
  }

  async getAllValidationErrors(): Promise<string[]> {
    const errors: string[] = [];
    
    const emailError = await this.getEmailError();
    if (emailError) errors.push(emailError);
    
    const phoneError = await this.getPhoneError();
    if (phoneError) errors.push(phoneError);
    
    const passwordError = await this.getPasswordError();
    if (passwordError) errors.push(passwordError);
    
    return errors;
  }

  async isContinueButtonEnabled(): Promise<boolean> {
    const isDisabled = await this.continueButton.getAttribute('disabled');
    return isDisabled !== 'true' && isDisabled !== '';
  }

  async restorePageState(): Promise<void> {
    const currentUrl = await this.page.url();
    if (currentUrl.includes('google') || currentUrl.includes('facebook') || currentUrl.includes('linkedin') || 
        currentUrl.includes('accounts.google.com') || currentUrl.includes('facebook.com') || currentUrl.includes('linkedin.com')) {
      // If we're on an external OAuth page, navigate back
      await this.navigateToSignInPage();
    } else if (!currentUrl.includes('/login') && !currentUrl.includes('/signin')) {
      // If we're not on the sign in page, navigate to it
      await this.navigateToSignInPage();
    }
    
    // Ensure the page is loaded with a more flexible approach
    try {
      await this.verifyPageLoad();
    } catch {
      // If verification fails, try to navigate again
      await this.navigateToSignInPage();
      await this.page.waitForTimeout(2000);
    }
  }

  async debugFullPageContent(): Promise<void> {
    const pageContent = await this.page.content();
    console.log('=== Full Page Content ===');
    console.log(pageContent);
    console.log('=== End Page Content ===');
  }
}
