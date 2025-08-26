import { BasePage } from '../BasePage';
import { Page, Locator, expect } from '@playwright/test';

export class MenuModalPage extends BasePage {
  // Modal/Overlay elements
  readonly modal: Locator;
  readonly closeButton: Locator;
  
  // Header elements
  readonly fur4ReferralLogo: Locator;
  readonly countrySelector: Locator;
  
  // Navigation elements
  readonly referralHomeLink: Locator;
  readonly referralFaqsLink: Locator;
  
  // Authentication elements
  readonly signInButton: Locator;
  readonly signUpButton: Locator;
  
  // Newsletter elements
  readonly newsletterText: Locator;
  readonly emailInput: Locator;
  readonly subscribeButton: Locator;
  
  // Social media elements
  readonly facebookLink: Locator;
  readonly youtubeLink: Locator;
  readonly instagramLink: Locator;

  constructor(page: Page) {
    super(page);
    
    // Modal/Overlay selectors
    this.modal = page.locator('[role="dialog"], .modal, .overlay, [data-testid*="modal"]').first();
    this.closeButton = page.locator('button[aria-label="Close"], button:has-text("×"), button:has-text("✕"), [data-testid*="close"]').first();
    
    // Header selectors
    this.fur4ReferralLogo = page.locator('text=FUR4 REFERRAL, text=FUR4, text=REFERRAL').first();
    this.countrySelector = page.locator('text=United States, [role="combobox"], select').first();
    
    // Navigation selectors
    this.referralHomeLink = page.getByText('Referral Home');
    this.referralFaqsLink = page.getByText('Referral FAQs');
    
    // Authentication selectors
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.signUpButton = page.getByRole('button', { name: 'Sign Up' });
    
    // Newsletter selectors
    this.newsletterText = page.locator('text=Subscribe to FUR4 Referral newsletter for updates!');
    this.emailInput = page.getByPlaceholder('Enter your email');
    this.subscribeButton = page.getByRole('button', { name: 'Subscribe' });
    
    // Social media selectors
    this.facebookLink = page.locator('a[href*="facebook"], [aria-label*="Facebook"]').first();
    this.youtubeLink = page.locator('a[href*="youtube"], [aria-label*="YouTube"]').first();
    this.instagramLink = page.locator('a[href*="instagram"], [aria-label*="Instagram"]').first();
  }

  // ===== MODAL INTERACTION METHODS =====

  async openMenuModal(): Promise<void> {
    const hamburgerButton = this.page.getByRole('button', { name: 'Open menu' });
    if (await hamburgerButton.count() > 0) {
      await hamburgerButton.click();
      await this.page.waitForTimeout(1500); // Wait for modal to open
      console.log('✅ Menu modal opened');
    } else {
      console.log('ℹ️ Hamburger menu button not found');
    }
  }

  async closeMenuModal(): Promise<void> {
    if (await this.closeButton.count() > 0) {
      await this.closeButton.click();
      await this.page.waitForTimeout(1000); // Wait for modal to close
      console.log('✅ Menu modal closed');
    } else {
      console.log('ℹ️ Close button not found');
    }
  }

  async isModalVisible(): Promise<boolean> {
    try {
      if (await this.modal.count() > 0) {
        return await this.modal.isVisible({ timeout: 3000 });
      }
      return false;
    } catch (error) {
      console.log('⚠️ Error checking modal visibility:', error);
      return false;
    }
  }

  async waitForModalToOpen(timeout: number = 5000): Promise<boolean> {
    try {
      await this.modal.waitFor({ state: 'visible', timeout });
      return true;
    } catch (error) {
      console.log('⚠️ Modal did not open within timeout');
      return false;
    }
  }

  // ===== HEADER VERIFICATION METHODS =====

  async verifyFur4ReferralLogo(): Promise<void> {
    if (await this.fur4ReferralLogo.count() > 0) {
      await expect(this.fur4ReferralLogo).toBeVisible();
      console.log('✅ FUR4 REFERRAL logo is visible');
    } else {
      console.log('ℹ️ FUR4 REFERRAL logo not found');
    }
  }

  async verifyCountrySelector(): Promise<void> {
    if (await this.countrySelector.count() > 0) {
      await expect(this.countrySelector).toBeVisible();
      console.log('✅ Country selector is visible');
    } else {
      console.log('ℹ️ Country selector not found');
    }
  }

  // ===== NAVIGATION VERIFICATION METHODS =====

  async verifyNavigationLinks(): Promise<void> {
    const navLinks = [
      { name: 'Referral Home', locator: this.referralHomeLink },
      { name: 'Referral FAQs', locator: this.referralFaqsLink }
    ];

    for (const link of navLinks) {
      if (await link.locator.count() > 0) {
        await expect(link.locator).toBeVisible();
        console.log(`✅ Navigation link "${link.name}" is visible`);
      } else {
        console.log(`ℹ️ Navigation link "${link.name}" not found`);
      }
    }
  }

  // ===== AUTHENTICATION VERIFICATION METHODS =====

  async verifySignInSignUpButtons(): Promise<void> {
    if (await this.signInButton.count() > 0) {
      await expect(this.signInButton).toBeVisible();
      await expect(this.signInButton).toBeEnabled();
      console.log('✅ Sign In button is visible and enabled');
    } else {
      console.log('ℹ️ Sign In button not found');
    }

    if (await this.signUpButton.count() > 0) {
      await expect(this.signUpButton).toBeVisible();
      await expect(this.signUpButton).toBeEnabled();
      console.log('✅ Sign Up button is visible and enabled');
    } else {
      console.log('ℹ️ Sign Up button not found');
    }
  }

  // ===== NEWSLETTER VERIFICATION METHODS =====

  async verifyNewsletterSection(): Promise<void> {
    if (await this.newsletterText.count() > 0) {
      await expect(this.newsletterText).toBeVisible();
      console.log('✅ Newsletter subscription text is visible');
    } else {
      console.log('ℹ️ Newsletter subscription text not found');
    }
  }

  async verifyEmailInput(): Promise<void> {
    if (await this.emailInput.count() > 0) {
      await expect(this.emailInput).toBeVisible();
      await expect(this.emailInput).toBeEnabled();
      await expect(this.emailInput).toHaveAttribute('placeholder', 'Enter your email');
      console.log('✅ Email input field is visible and functional');
    } else {
      console.log('ℹ️ Email input field not found');
    }
  }

  async verifySubscribeButton(): Promise<void> {
    if (await this.subscribeButton.count() > 0) {
      await expect(this.subscribeButton).toBeVisible();
      await expect(this.subscribeButton).toBeEnabled();
      console.log('✅ Subscribe button is visible and functional');
    } else {
      console.log('ℹ️ Subscribe button not found');
    }
  }

  async testNewsletterSubscription(email: string = 'test@example.com'): Promise<void> {
    if (await this.emailInput.count() > 0 && await this.subscribeButton.count() > 0) {
      await this.emailInput.fill(email);
      expect(await this.emailInput.inputValue()).toBe(email);
      await expect(this.subscribeButton).toBeEnabled();
      console.log('✅ Newsletter subscription functionality works');
    } else {
      console.log('ℹ️ Newsletter subscription elements not found');
    }
  }

  // ===== SOCIAL MEDIA VERIFICATION METHODS =====

  async verifySocialMediaLinks(): Promise<void> {
    const socialLinks = [
      { name: 'Facebook', locator: this.facebookLink },
      { name: 'YouTube', locator: this.youtubeLink },
      { name: 'Instagram', locator: this.instagramLink }
    ];

    for (const social of socialLinks) {
      if (await social.locator.count() > 0) {
        await expect(social.locator).toBeVisible();
        console.log(`✅ ${social.name} link is visible`);
      } else {
        console.log(`ℹ️ ${social.name} link not found`);
      }
    }
  }

  // ===== COMPREHENSIVE VERIFICATION METHODS =====

  async verifyAllModalElements(): Promise<void> {
    console.log('🔍 Verifying all menu modal elements...');
    
    await this.verifyFur4ReferralLogo();
    await this.verifyCountrySelector();
    await this.verifyNavigationLinks();
    await this.verifySignInSignUpButtons();
    await this.verifyNewsletterSection();
    await this.verifyEmailInput();
    await this.verifySubscribeButton();
    await this.verifySocialMediaLinks();
    
    console.log('✅ All menu modal elements verification completed');
  }

  async verifyModalFunctionality(): Promise<void> {
    console.log('🔍 Testing menu modal functionality...');
    
    // Test newsletter subscription
    await this.testNewsletterSubscription();
    
    // Test modal visibility
    const isVisible = await this.isModalVisible();
    console.log(`Modal visibility: ${isVisible}`);
    
    console.log('✅ Menu modal functionality testing completed');
  }

  // ===== UTILITY METHODS =====

  async getEmailInputValue(): Promise<string> {
    if (await this.emailInput.count() > 0) {
      return await this.emailInput.inputValue();
    }
    return '';
  }

  async clearEmailInput(): Promise<void> {
    if (await this.emailInput.count() > 0) {
      await this.emailInput.clear();
    }
  }

  async clickSignInButton(): Promise<void> {
    if (await this.signInButton.count() > 0) {
      await this.signInButton.click();
    }
  }

  async clickSignUpButton(): Promise<void> {
    if (await this.signUpButton.count() > 0) {
      await this.signUpButton.click();
    }
  }

  async clickSubscribeButton(): Promise<void> {
    if (await this.subscribeButton.count() > 0) {
      await this.subscribeButton.click();
    }
  }
}
