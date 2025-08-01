import { Page, Locator, expect } from '@playwright/test';

export class DealerLocatorPage {
  readonly page: Page;
  
  // Main page elements
  readonly heading: Locator;
  readonly eTailerButton: Locator;
  readonly retailerButton: Locator;
  readonly zipCodeInput: Locator;
  readonly findClosestStoresButton: Locator;
  readonly dealerResultList: Locator;
  readonly mapContainer: Locator;
  
  // Individual dealer elements
  readonly dealerCards: Locator;
  readonly firstDealer: Locator;
  
  // UI elements
  readonly chatButton: Locator;
  readonly backToTopArrow: Locator;
  
  // Footer links
  readonly dealerLocatorLink: Locator;
  readonly privacyPolicyLink: Locator;
  readonly termsOfServiceLink: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Main page elements
    this.heading = page.getByRole('heading', { name: 'Where to buy' });
    this.eTailerButton = page.getByRole('button', { name: /E‑TAILER|E-TAILER|E-TAILER|etailer/i });
    this.retailerButton = page.getByRole('button', { name: 'RETAILER' });
    this.zipCodeInput = page.getByPlaceholder('Zip Code');
    this.findClosestStoresButton = page.getByRole('button', { name: 'Find Closest Stores' });
    this.dealerResultList = page.locator('div').filter({ hasText: /Distributor/ }).locator('div');
    this.mapContainer = page.locator('#dealerloc');
    
    // Individual dealer elements
    this.dealerCards = page.locator('div').filter({ has: page.getByRole('heading') });
    this.firstDealer = this.dealerCards.first();
    
    // UI elements
    this.chatButton = page.getByRole('button', { name: /Chat with us/i });
    this.backToTopArrow = page.locator('button').filter({ has: page.locator('svg') }).last();
    
    // Footer links
    this.dealerLocatorLink = page.getByRole('link', { name: 'Dealer Locator' });
    this.privacyPolicyLink = page.getByRole('link', { name: 'Privacy Policy' });
    this.termsOfServiceLink = page.getByRole('link', { name: 'Terms Of Service' });
  }

  async navigateToDealerLocatorPage(): Promise<void> {
    const baseUrl = process.env.FUR4_MAIN_URL;
    if (!baseUrl) throw new Error('FUR4_MAIN_URL is not set in environment variables!');
    
    try {
      console.log('=== DEALER LOCATOR NAVIGATION DEBUG ===');
      console.log('Base URL:', baseUrl);
      
      // Navigate to dealer locator page
      await this.page.goto(`${baseUrl}/dealer/locator`, { waitUntil: 'domcontentloaded' });
      await this.page.waitForSelector('body', { state: 'visible', timeout: 15000 });
      console.log('Direct navigation to dealer locator page successful');
      
      // Wait for dealer locator content to load
      await this.page.waitForSelector('h1, h2, h3', { timeout: 15000 });
      console.log('Dealer locator content loaded');
      console.log('Final URL after navigation:', await this.page.url());
      
      console.log('=== END DEALER LOCATOR NAVIGATION DEBUG ===');
    } catch (error) {
      console.error('Navigation to dealer locator page failed:', error);
      console.log('Current URL at error:', await this.page.url());
      console.log('Page title at error:', await this.page.title());
      throw error;
    }
  }

  async verifyPageLoad(): Promise<boolean> {
    try {
      await this.page.waitForSelector('body', { state: 'visible', timeout: 15000 });
      const pageTitle = await this.page.title();
      const hasValidTitle = pageTitle.match(/FUR4|Dealer|Locator/i);
      return !!hasValidTitle;
    } catch (error) {
      return false;
    }
  }

  async isHeadingVisible(): Promise<boolean> {
    try {
      await expect(this.heading).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isETailerButtonVisible(): Promise<boolean> {
    try {
      await expect(this.eTailerButton).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickETailerButton(): Promise<void> {
    await this.eTailerButton.click();
  }

  async isRetailerButtonVisible(): Promise<boolean> {
    try {
      await expect(this.retailerButton).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickRetailerButton(): Promise<void> {
    await this.retailerButton.click();
  }

  async isZipCodeInputVisible(): Promise<boolean> {
    try {
      await expect(this.zipCodeInput).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async enterZipCode(zipCode: string): Promise<void> {
    await this.zipCodeInput.fill(zipCode);
  }

  async clearZipCode(): Promise<void> {
    await this.zipCodeInput.clear();
  }

  async isFindClosestStoresButtonVisible(): Promise<boolean> {
    try {
      await expect(this.findClosestStoresButton).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickFindClosestStoresButton(): Promise<void> {
    await this.findClosestStoresButton.click();
  }

  async getDealerCardsCount(): Promise<number> {
    return await this.dealerCards.count();
  }

  async clickDealerCard(index: number): Promise<void> {
    const card = this.dealerCards.nth(index);
    await card.click();
  }

  async isMapContainerVisible(): Promise<boolean> {
    try {
      await expect(this.mapContainer).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isChatButtonVisible(): Promise<boolean> {
    try {
      await expect(this.chatButton).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickChatButton(): Promise<void> {
    await this.chatButton.click();
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

  // Footer methods
  async isDealerLocatorLinkVisible(): Promise<boolean> {
    try {
      await expect(this.dealerLocatorLink).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickDealerLocatorLink(): Promise<void> {
    await this.dealerLocatorLink.click();
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

  async isTermsOfServiceLinkVisible(): Promise<boolean> {
    try {
      await expect(this.termsOfServiceLink).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickTermsOfServiceLink(): Promise<void> {
    await this.termsOfServiceLink.click();
  }

  // Specific distributor verification methods
  async verifyDistributorExists(name: string): Promise<boolean> {
    try {
      const distributor = this.page.locator('div').filter({ hasText: name });
      await expect(distributor.first()).toBeVisible({ timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async getDistributorDetails(name: string): Promise<string> {
    const distributor = this.page.locator('div').filter({ hasText: name });
    return await distributor.first().textContent() || '';
  }

  async verifyDistributorAddress(name: string, expectedAddress: string): Promise<boolean> {
    try {
      const distributor = this.page.locator('div').filter({ hasText: name });
      const details = await distributor.first().textContent();
      if (!details) return false;
      
      // Split expected address into parts for more flexible matching
      const addressParts = expectedAddress.toLowerCase().split(/[,\s]+/).filter(part => part.length > 2);
      const detailsLower = details.toLowerCase();
      
      // Check if at least 3 address parts are found
      const foundParts = addressParts.filter(part => detailsLower.includes(part));
      return foundParts.length >= 3;
    } catch {
      return false;
    }
  }

  // Navigation methods
  async navigateToETailerPage(): Promise<void> {
    try {
      await this.clickETailerButton();
      await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 });
    } catch (error: unknown) {
      console.log('⚠ E-TAILER navigation failed:', error instanceof Error ? error.message : String(error));
    }
  }

  async navigateToRetailerPage(): Promise<void> {
    try {
      await this.clickRetailerButton();
      await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 });
    } catch (error: unknown) {
      console.log('⚠ RETAILER navigation failed:', error instanceof Error ? error.message : String(error));
    }
  }

  // Responsive design methods
  async setMobileViewport(): Promise<void> {
    await this.page.setViewportSize({ width: 375, height: 667 });
  }

  async setTabletViewport(): Promise<void> {
    await this.page.setViewportSize({ width: 768, height: 1024 });
  }

  // Validation methods
  async isZipCodeRequired(): Promise<boolean> {
    try {
      await this.clickFindClosestStoresButton();
      // Wait a bit for validation to appear
      await this.page.waitForTimeout(1000);
      
      // Check for various validation messages
      const validationSelectors = [
        'div:has-text("Please fill out this field")',
        'div:has-text("required")',
        'div:has-text("zip code")',
        'div:has-text("zip")',
        'input:invalid',
        '[aria-invalid="true"]'
      ];
      
      for (const selector of validationSelectors) {
        const validationElement = this.page.locator(selector);
        if (await validationElement.isVisible()) {
          return true;
        }
      }
      
      // If no validation message found, check if button is disabled
      const isButtonDisabled = await this.findClosestStoresButton.isDisabled();
      return isButtonDisabled;
    } catch {
      return false;
    }
  }

  // Debug methods
  async debugPageContent(): Promise<void> {
    console.log('=== DEALER LOCATOR PAGE DEBUG ===');
    console.log('URL:', await this.page.url());
    console.log('Title:', await this.page.title());
    
    // Get all text content
    const bodyText = await this.page.locator('body').textContent();
    console.log('Full body text length:', bodyText?.length || 0);
    console.log('First 1000 chars of body text:', bodyText?.substring(0, 1000));
    
    // Check for distributors
    const distributors = await this.page.locator('div').filter({ hasText: /Distributor|Distributer/i }).all();
    console.log('=== DISTRIBUTORS FOUND ===');
    for (let i = 0; i < distributors.length; i++) {
      const text = await distributors[i].textContent();
      console.log(`Distributor ${i + 1}: "${text?.substring(0, 100)}..."`);
    }
    
    // Check for buttons
    const buttons = await this.page.locator('button').all();
    console.log('=== BUTTONS FOUND ===');
    for (let i = 0; i < buttons.length; i++) {
      const text = await buttons[i].textContent();
      const ariaLabel = await buttons[i].getAttribute('aria-label');
      console.log(`Button ${i + 1}: "${text?.trim()}" (aria-label: "${ariaLabel}")`);
    }
    
    console.log('=== END DEALER LOCATOR PAGE DEBUG ===');
  }
} 