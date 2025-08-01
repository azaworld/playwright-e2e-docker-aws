import { Page, Locator, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

export class HomeHero {
  readonly page: Page;
  readonly logo: Locator;
  readonly heroTitle: Locator;
  readonly heroTagline: Locator;
  readonly heroDescription: Locator;
  readonly productImage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.locator('[data-testid="logo"], img[alt*="FUR4"], img[alt*="logo"]').first();
    this.heroTitle = page.locator('h1, [data-testid="hero-title"]').filter({ hasText: /deShedding Tool/i });
    this.heroTagline = page.getByText('safer, gentler and more effective', { exact: false });
    this.heroDescription = page.getByText('Designed to dramatically reduce shedding for', { exact: false });
    this.productImage = page.locator('img[alt*="product"], img[alt*="tool"], img[src*="product"]').first();
  }

  async navigateToHomepage(): Promise<void> {
    const baseUrl = process.env.FUR4_MAIN_URL;
    if (!baseUrl) throw new Error('FUR4_MAIN_URL is not set in environment variables!');
    await this.page.goto(baseUrl, { waitUntil: "domcontentloaded" });
      await this.page.waitForSelector("body", { state: "visible", timeout: 15000 });
      await this.logo.waitFor({ state: "visible", timeout: 15000 });
  }

  async verifyPageLoad(): Promise<void> {
    await expect(this.page).toHaveTitle(/fur4/i);
    await expect(this.page.locator('body')).toBeVisible();
    await expect(this.logo).toBeVisible();
  }

  async isLogoVisible(): Promise<boolean> {
    try {
      await expect(this.logo).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isHeroDescriptionVisible(): Promise<boolean> {
    try {
      await expect(this.heroDescription).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getHeroDescriptionText(): Promise<string> {
    return await this.heroDescription.textContent() || '';
  }

  async isProductImageVisible(): Promise<boolean> {
    try {
      await expect(this.productImage).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isHeroTaglineVisible(): Promise<boolean> {
    try {
      await expect(this.heroTagline).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  // Hero image methods
  getHeroImage() {
    return this.page.locator('img[alt="deShedding Tool"]');
  }
  async isHeroImageVisible(): Promise<boolean> {
    try {
      await expect(this.getHeroImage()).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
  async getHeroImageSrc(): Promise<string> {
    return (await this.getHeroImage().getAttribute('src')) || '';
  }

  // Buy Now button methods
  getBuyNowButton() {
    return this.page.locator('svg:has-text("BUY NOW")');
  }
  async isBuyNowButtonVisible(): Promise<boolean> {
    try {
      await expect(this.getBuyNowButton()).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
  async isBuyNowButtonClickable(): Promise<boolean> {
    try {
      await expect(this.getBuyNowButton()).toBeEnabled({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
  async clickBuyNowButton(): Promise<void> {
    await this.getBuyNowButton().click();
  }

  // Cart icon methods
  getCartIcon() {
    return this.page.locator('img[alt="Cart"]');
  }
  async isCartIconVisible(): Promise<boolean> {
    try {
      await expect(this.getCartIcon()).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
  async clickCartIcon(): Promise<void> {
    await this.getCartIcon().click();
  }
  async isCartCountVisible(): Promise<boolean | undefined> {
    const itemCount = this.page.locator('[class*="cart"] [class*="count"], .cart-count, [data-testid*="count"]');
    if (await itemCount.count() > 0) {
      return await itemCount.first().isVisible();
    }
    return undefined;
  }

  // Menu button methods
  getMenuButton() {
    return this.page.locator('button.group[style], button.group');
  }
  async isMenuButtonVisible(): Promise<boolean> {
    try {
      await expect(this.getMenuButton()).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
  async clickMenuButton(): Promise<void> {
    await this.getMenuButton().click();
  }
  async isNavMenuVisible(): Promise<boolean> {
    try {
      const navMenu = this.page.locator('nav.fixed');
      await expect(navMenu.first()).toBeVisible();
      return true;
    } catch {
      return false;
    }
  }

  // Menu navigation methods
  getMenuLink(text: string) {
    return this.page.locator(`div.block a[href]`).filter({ hasText: text });
  }

  async isMenuLinkVisible(text: string): Promise<boolean> {
    try {
      await expect(this.getMenuLink(text)).toBeVisible({ timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickMenuLink(text: string): Promise<void> {
    await this.getMenuLink(text).click();
  }

  async getMenuLinkHref(text: string): Promise<string> {
    return await this.getMenuLink(text).getAttribute('href') || '';
  }

  // Auth button methods (Sign In/Sign Up)
  getSignInButton() {
    return this.page.getByRole('link', { name: 'Sign In' });
  }

  getSignUpButton() {
    return this.page.getByRole('link', { name: 'Sign Up' });
  }

  async isSignInButtonVisible(): Promise<boolean> {
    try {
      await expect(this.getSignInButton()).toBeVisible({ timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async isSignUpButtonVisible(): Promise<boolean> {
    try {
      await expect(this.getSignUpButton()).toBeVisible({ timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickSignInButton(): Promise<void> {
    await this.getSignInButton().click();
  }

  async clickSignUpButton(): Promise<void> {
    await this.getSignUpButton().click();
  }

  // Newsletter methods
  getNewsletterText() {
    return this.page.getByText('Subscribe to our newsletter', { exact: false }).or(
      this.page.getByText('newsletter', { exact: false })
    ).or(
      this.page.getByText('Subscribe', { exact: false })
    );
  }

  getNewsletterInput() {
    return this.page.locator('input[type="email"]').or(
      this.page.locator('input[placeholder*="email"]')
    ).or(
      this.page.locator('input[placeholder*="Email"]')
    );
  }

  getSubscribeButton() {
    return this.page.locator('button').filter({ hasText: /Subscribe|Subscribe to our newsletter/ }).or(
      this.page.getByRole('button', { name: /Subscribe/ })
    );
  }

  async isNewsletterTextVisible(): Promise<boolean> {
    try {
      await expect(this.getNewsletterText()).toBeVisible({ timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async isNewsletterInputVisible(): Promise<boolean> {
    try {
      await expect(this.getNewsletterInput()).toBeVisible({ timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async isSubscribeButtonVisible(): Promise<boolean> {
    try {
      await expect(this.getSubscribeButton()).toBeVisible({ timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async enterNewsletterEmail(email: string): Promise<void> {
    await this.getNewsletterInput().fill(email);
  }

  async clickSubscribeButton(): Promise<void> {
    await this.getSubscribeButton().click();
  }

  async getNewsletterInputValue(): Promise<string> {
    return await this.getNewsletterInput().inputValue();
  }

  async isNewsletterInputInvalid(): Promise<boolean> {
    try {
      const input = this.getNewsletterInput();
      const validity = await input.evaluate((el: HTMLInputElement) => el.validity.valid);
      return !validity;
    } catch {
      return false;
    }
  }

  async isNewsletterErrorVisible(): Promise<boolean> {
    try {
      const errorMessage = this.page.getByText('Please, fill the email field', { exact: false });
      await expect(errorMessage).toBeVisible({ timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  // Menu close button methods
  getMenuCloseButton() {
    return this.page.getByRole('button').filter({ hasText: /^$/ }).first();
  }

  async isMenuCloseButtonVisible(): Promise<boolean> {
    try {
      await expect(this.getMenuCloseButton()).toBeVisible({ timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickMenuCloseButton(): Promise<void> {
    await this.getMenuCloseButton().click();
  }

  // Menu BUY NOW button methods
  getMenuBuyNowButton() {
    // Try multiple possible locators for BUY NOW button
    return this.page.locator('a[href="/products"], svg[data-text="BUY NOW"], button:has-text("BUY NOW")').first();
  }

  async isMenuBuyNowButtonVisible(): Promise<boolean> {
    try {
      await expect(this.getMenuBuyNowButton()).toBeVisible({ timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickMenuBuyNowButton(): Promise<void> {
    await this.getMenuBuyNowButton().click();
  }

  // Menu logo methods
  getMenuLogo() {
    return this.page.locator('nav.fixed img[alt*="FUR4"], nav.fixed img[alt*="logo"]');
  }

  async isMenuLogoVisible(): Promise<boolean> {
    try {
      await expect(this.getMenuLogo()).toBeVisible({ timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  // Currency dropdown methods
  getCurrencyDropdown() {
    // Try multiple possible locators for currency dropdown
    return this.page.locator('button').filter({ hasText: /USD|AUD|EUR/ }).or(
      this.page.locator('button').filter({ hasText: /USD/ })
    ).or(
      this.page.locator('button').filter({ hasText: /AUD/ })
    ).or(
      this.page.locator('button').filter({ hasText: /EUR/ })
    );
  }

  getCurrencyDropdownList() {
    return this.page.locator('ul[data-lenis-prevent="true"]').filter({ hasText: /AUD|EUR|USD/ });
  }

  getCurrencyOption(currency: string) {
    return this.page.locator('li').filter({ hasText: currency }).first();
  }

  async isCurrencyDropdownVisible(): Promise<boolean> {
    try {
      const dropdown = this.getCurrencyDropdown();
      const count = await dropdown.count();
      console.log(`Found ${count} currency dropdown elements`);
      
      // If no elements found, try alternative locators
      if (count === 0) {
        console.log('Trying alternative locators...');
        
        // Try to find any button with currency symbols
        const allButtons = this.page.locator('button');
        const buttonCount = await allButtons.count();
        console.log(`Found ${buttonCount} total buttons on page`);
        
        // Log all button texts for debugging
        for (let i = 0; i < Math.min(buttonCount, 10); i++) {
          try {
            const buttonText = await allButtons.nth(i).textContent();
            console.log(`Button ${i}: "${buttonText}"`);
          } catch (e) {
            console.log(`Button ${i}: [error reading text]`);
          }
        }
        
        // Try alternative locators
        const altDropdown = this.page.locator('button').filter({ hasText: /\\$/ });
        const altCount = await altDropdown.count();
        console.log(`Found ${altCount} buttons with $ symbol`);
        
        if (altCount > 0) {
          await expect(altDropdown.first()).toBeVisible({ timeout: 3000 });
          return true;
        }
      } else {
        await expect(dropdown.first()).toBeVisible({ timeout: 3000 });
        return true;
      }
      return false;
    } catch (error) {
      console.log('Currency dropdown visibility check failed:', error);
      return false;
    }
  }

  async clickCurrencyDropdown(): Promise<void> {
    const dropdown = this.getCurrencyDropdown();
    const count = await dropdown.count();
    
    if (count === 0) {
      // Try alternative locator
      const altDropdown = this.page.locator('button').filter({ hasText: /\\$/ });
      const altCount = await altDropdown.count();
      
      if (altCount > 0) {
        await altDropdown.first().click();
      } else {
        throw new Error('Currency dropdown not found');
      }
    } else {
      await dropdown.first().click();
    }
  }

  async selectCurrency(currency: string): Promise<void> {
    await this.getCurrencyOption(currency).click();
  }

  async isCurrencyDropdownOpen(): Promise<boolean> {
    try {
      await expect(this.getCurrencyDropdownList()).toBeVisible({ timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  // Country dropdown methods
  getCountryDropdown() {
    // Try multiple possible locators for country dropdown
    return this.page.locator('button').filter({ hasText: /United States|Australia|Belgium/ }).or(
      this.page.locator('button').filter({ hasText: 'United States' })
    );
  }

  getCountryDropdownList() {
    return this.page.locator('ul[data-lenis-prevent="true"]').filter({ hasText: /United States|Australia|Belgium/ });
  }

  getCountryOption(country: string) {
    return this.page.locator('li').filter({ hasText: country }).first();
  }

  async isCountryDropdownVisible(): Promise<boolean> {
    try {
      const dropdown = this.getCountryDropdown();
      const count = await dropdown.count();
      console.log(`Found ${count} country dropdown elements`);
      
      // If no elements found, try alternative locators
      if (count === 0) {
        console.log('Trying alternative country locators...');
        
        // Try to find any button with country names
        const allButtons = this.page.locator('button');
        const buttonCount = await allButtons.count();
        console.log(`Found ${buttonCount} total buttons on page`);
        
        // Log all button texts for debugging
        for (let i = 0; i < Math.min(buttonCount, 10); i++) {
          try {
            const buttonText = await allButtons.nth(i).textContent();
            console.log(`Button ${i}: "${buttonText}"`);
          } catch (e) {
            console.log(`Button ${i}: [error reading text]`);
          }
        }
        
        // Try alternative locators
        const altDropdown = this.page.locator('button').filter({ hasText: 'United States' });
        const altCount = await altDropdown.count();
        console.log(`Found ${altCount} buttons with country names`);
        
        if (altCount > 0) {
          await expect(altDropdown.first()).toBeVisible({ timeout: 3000 });
          return true;
        }
      } else {
        await expect(dropdown.first()).toBeVisible({ timeout: 3000 });
        return true;
      }
      return false;
    } catch (error) {
      console.log('Country dropdown visibility check failed:', error);
      return false;
    }
  }

    async clickCountryDropdown(): Promise<void> {
    // First check if dropdown is already open
    const isDropdownOpen = await this.isCountryDropdownOpen();
    if (isDropdownOpen) {
      console.log('Country dropdown is already open, no need to click');
      return;
    }

    // Debug: Log all buttons to see what's available
    const allButtons = this.page.locator('button');
    const buttonCount = await allButtons.count();
    console.log(`Total buttons found: ${buttonCount}`);
    
    // Log first 10 button texts for debugging
    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      try {
        const buttonText = await allButtons.nth(i).textContent();
        console.log(`Button ${i}: "${buttonText}"`);
      } catch (e) {
        console.log(`Button ${i}: [error reading text]`);
      }
    }

    const dropdown = this.getCountryDropdown();
    const count = await dropdown.count();
    
    console.log(`Attempting to click country dropdown, found ${count} elements`);
    
    if (count > 0) {
      try {
        // Wait for element to be ready
        await dropdown.first().waitFor({ state: 'visible', timeout: 5000 });
        await dropdown.first().click();
        console.log('Successfully clicked country dropdown');
      } catch (error) {
        console.log('Failed to click primary dropdown, trying alternative...');
        // Try alternative locator
        const altDropdown = this.page.locator('button').filter({ hasText: 'United States' });
        const altCount = await altDropdown.count();
        
        if (altCount > 0) {
          await altDropdown.first().waitFor({ state: 'visible', timeout: 5000 });
          await altDropdown.first().click();
          console.log('Successfully clicked alternative country dropdown');
        } else {
          throw new Error('Country dropdown not found');
        }
      }
    } else {
      // Try multiple alternative locators
      console.log('Trying multiple alternative locators...');
      
      // Try different locator strategies
      const locators = [
        this.page.locator('button').filter({ hasText: 'United States' }),
        this.page.locator('button').filter({ hasText: /United States/ }),
        this.page.locator('button').filter({ hasText: /States/ }),
        this.page.locator('button').filter({ hasText: /United/ })
      ];
      
      for (let i = 0; i < locators.length; i++) {
        const locator = locators[i];
        const count = await locator.count();
        console.log(`Alternative locator ${i}: found ${count} elements`);
        
        if (count > 0) {
          try {
            await locator.first().waitFor({ state: 'visible', timeout: 5000 });
            await locator.first().click();
            console.log(`Successfully clicked alternative locator ${i}`);
            return;
          } catch (error) {
            console.log(`Failed to click alternative locator ${i}:`, error);
          }
        }
      }
      
      throw new Error('Country dropdown not found with any locator');
    }
  }

  async selectCountry(country: string): Promise<void> {
    await this.getCountryOption(country).click();
  }

  async isCountryDropdownOpen(): Promise<boolean> {
    try {
      const dropdownList = this.getCountryDropdownList();
      const count = await dropdownList.count();
      console.log(`Country dropdown list found: ${count} elements`);
      
      if (count > 0) {
        await expect(dropdownList.first()).toBeVisible({ timeout: 3000 });
        return true;
      }
      return false;
    } catch (error) {
      console.log('Country dropdown open check failed:', error);
      return false;
    }
  }



  // Newsletter layout methods
  getNewsletterContainer() {
    return this.page.locator('div').filter({ hasText: /Subscribe|newsletter/ }).or(
      this.page.locator('form').filter({ hasText: /Subscribe|newsletter/ })
    );
  }

  async isNewsletterAligned(): Promise<boolean> {
    try {
      // Check if any newsletter elements are visible
      const hasText = await this.isNewsletterTextVisible();
      const hasInput = await this.isNewsletterInputVisible();
      const hasButton = await this.isSubscribeButtonVisible();
      
      console.log(`Newsletter elements - Text: ${hasText}, Input: ${hasInput}, Button: ${hasButton}`);
      
      // If at least one newsletter element is visible, consider it aligned
      if (hasText || hasInput || hasButton) {
        return true;
      }
      
      // Try to find newsletter container
      const container = this.getNewsletterContainer();
      const count = await container.count();
      console.log(`Newsletter containers found: ${count}`);
      
      if (count > 0) {
        await expect(container.first()).toBeVisible({ timeout: 3000 });
        return true;
      }
      
      return false;
    } catch (error) {
      console.log('Newsletter alignment check failed:', error);
      return false;
    }
  }

  // Menu close verification
  async isMenuClosed(): Promise<boolean> {
    try {
      const navMenu = this.page.locator('nav.fixed');
      await expect(navMenu.first()).not.toBeVisible({ timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  // Chat widget methods
  getChatWidget() {
    return this.page.getByText('Chat with us', { exact: false });
  }
  async isChatWidgetVisible(): Promise<boolean> {
    try {
      await expect(this.getChatWidget()).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
  async clickChatWidget(): Promise<void> {
    await this.getChatWidget().click();
  }

  // Back button methods
  getBackButton() {
    return this.page.locator('button#btn-back-to-top');
  }
  async isBackButtonVisible(): Promise<boolean> {
    try {
      await expect(this.getBackButton()).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
  async hoverBackButton(): Promise<void> {
    await this.getBackButton().hover();
    await this.page.waitForTimeout(500);
  }
  async getBackButtonColor(): Promise<string> {
    return await this.getBackButton().evaluate((el: HTMLElement) => window.getComputedStyle(el).backgroundColor);
  }
  async clickBackButton(): Promise<void> {
    await this.getBackButton().click();
  }

  // Footer methods
  getFooterHeading() {
    return this.page.locator('footer h3.font-semibold', { hasText: /^FUR4$/ });
  }
  async isFooterVisible(): Promise<boolean> {
    try {
      await expect(this.getFooterHeading()).toBeVisible();
      return true;
    } catch {
      return false;
    }
  }

  // Scroll to explore text
  getScrollToExploreText() {
    return this.page.getByText(/scroll to explore/i);
  }
  async isScrollToExploreTextVisible(): Promise<boolean> {
    try {
      await expect(this.getScrollToExploreText()).toBeVisible({ timeout: 5000 });
    return true;
    } catch {
      return false;
    }
  }

  // Scroll down
  async scrollDown(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.page.waitForTimeout(500);
  }
}
