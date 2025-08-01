import { Page, Locator, expect } from '@playwright/test';

export class AboutUsPage {
  readonly page: Page;
  readonly mainTitle: Locator;
  readonly sheddingProblemText: Locator;
  readonly fur4Description: Locator;
  readonly saferGentlerMoreEffectiveTitle: Locator;
  readonly saferSection: Locator;
  readonly gentlerSection: Locator;
  readonly moreEffectiveSection: Locator;
  readonly polyCarboMaxSection: Locator;
  readonly productImages: Locator;
  readonly browseOurProductsButton: Locator;
  readonly learnMoreLink: Locator;
  readonly footer: Locator;
  readonly saferImage: Locator;
  readonly gentlerImage: Locator;
  readonly moreEffectiveImage: Locator;
  readonly allFur4ToolsText: Locator;

  constructor(page: Page) {
    this.page = page;
    // Using simpler, more reliable selectors like the JavaScript version
    this.mainTitle = page.getByText('About FUR4', { exact: true });
    this.sheddingProblemText = page.locator('text=Pet owners around the world have one common problem: shedding.');
    this.fur4Description = page.locator('text=The FUR4 deShedding tool was designed and patented by David Porter.');
    this.saferGentlerMoreEffectiveTitle = page.getByText('The Safer, Gentler, and More Effective', { exact: true });
    this.saferSection = page.getByText('Safer', { exact: true });
    this.gentlerSection = page.getByText('Gentler', { exact: true });
    this.moreEffectiveSection = page.getByText('More Effective', { exact: true });
    this.polyCarboMaxSection = page.getByText('PolyCarboMax™', { exact: true });
    // Updated to use getByRole as requested
    this.productImages = page.getByRole('img', { name: 'introduction' }).first();
    // New locators for additional test cases
    this.browseOurProductsButton = page.getByRole('button', { name: 'Browse Our Products' });
    this.learnMoreLink = page.locator('p.text-white.text-base.md\\:text-xl.font-semibold').filter({ hasText: 'Learn More' });
    this.footer = page.locator('footer');
    // Additional locators for comprehensive assertions
    this.saferImage = page.getByRole('img', { name: 'Safer' });
    this.gentlerImage = page.getByRole('img', { name: 'Gentler' });
    this.moreEffectiveImage = page.getByRole('img', { name: 'More Effective' });
    this.allFur4ToolsText = page.getByText('All FUR4 deShedding tools');
  }

  async navigateToAboutUsPage(): Promise<void> {
    const baseUrl = process.env.FUR4_MAIN_URL;
    if (!baseUrl) throw new Error('FUR4_MAIN_URL is not set in environment variables!');
    
    try {
      await this.page.goto(`${baseUrl}/about-us`, { waitUntil: 'domcontentloaded' });
      await this.page.waitForSelector('body', { state: 'visible', timeout: 15000 });
      
      // Wait for the page to be loaded by checking for the About FUR4 heading
      await this.page.waitForSelector('div', { hasText: 'About FUR4' }, { timeout: 15000 });
      
      // Remove networkidle wait as it's causing timeout issues
      // await this.page.waitForLoadState('networkidle', { timeout: 10000 });
    } catch (error) {
      console.error('Navigation to About Us page failed:', error);
      throw error;
    }
  }

  async verifyPageLoad(): Promise<void> {
    await expect(this.page).toHaveURL(/about-us/);
    // Updated title to match the actual page title
    await expect(this.page).toHaveTitle(/FUR4 DeShedding Tool/i);
  }

  async isMainTitleVisible(): Promise<boolean> {
    try {
      await expect(this.mainTitle).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getMainTitleText(): Promise<string> {
    return await this.mainTitle.textContent() || '';
  }

  async isSheddingProblemTextVisible(): Promise<boolean> {
    try {
      await expect(this.sheddingProblemText).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isFur4DescriptionVisible(): Promise<boolean> {
    try {
      await expect(this.fur4Description).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isSaferGentlerMoreEffectiveTitleVisible(): Promise<boolean> {
    try {
      await expect(this.saferGentlerMoreEffectiveTitle).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getSaferGentlerMoreEffectiveTitleText(): Promise<string> {
    return await this.saferGentlerMoreEffectiveTitle.textContent() || '';
  }

  async isSaferSectionVisible(): Promise<boolean> {
    try {
      await expect(this.saferSection).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isGentlerSectionVisible(): Promise<boolean> {
    try {
      await expect(this.gentlerSection).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isMoreEffectiveSectionVisible(): Promise<boolean> {
    try {
      await expect(this.moreEffectiveSection).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isPolyCarboMaxSectionVisible(): Promise<boolean> {
    try {
      await expect(this.polyCarboMaxSection).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isProductImagesVisible(): Promise<boolean> {
    try {
      await expect(this.productImages).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getProductImagesCount(): Promise<number> {
    return await this.productImages.count();
  }

  // Browse Our Products button methods
  async isBrowseOurProductsButtonVisible(): Promise<boolean> {
    try {
      await expect(this.browseOurProductsButton).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickBrowseOurProductsButton(): Promise<void> {
    await this.browseOurProductsButton.click();
  }

  // Learn More link methods
  async isLearnMoreLinkVisible(): Promise<boolean> {
    try {
      await expect(this.learnMoreLink).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickLearnMoreLink(): Promise<void> {
    await this.learnMoreLink.click();
  }

  // Footer methods
  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.page.waitForTimeout(1000); // Wait for scroll to complete
  }

  async isFooterVisible(): Promise<boolean> {
    try {
      await expect(this.footer).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getFooterText(): Promise<string> {
    return await this.footer.textContent() || '';
  }

  // PolyCarboMax section verification
  async isPolyCarboMaxHeadingVisible(): Promise<boolean> {
    try {
      await expect(this.polyCarboMaxSection).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getPolyCarboMaxHeadingText(): Promise<string> {
    return await this.polyCarboMaxSection.textContent() || '';
  }

  // Additional image verification methods
  async isSaferImageVisible(): Promise<boolean> {
    try {
      await expect(this.saferImage).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isGentlerImageVisible(): Promise<boolean> {
    try {
      await expect(this.gentlerImage).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isMoreEffectiveImageVisible(): Promise<boolean> {
    try {
      await expect(this.moreEffectiveImage).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isAllFur4ToolsTextVisible(): Promise<boolean> {
    try {
      await expect(this.allFur4ToolsText).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getAllFur4ToolsText(): Promise<string> {
    return await this.allFur4ToolsText.textContent() || '';
  }

  async debugPageContent(): Promise<void> {
    console.log('=== DEBUG: Page Content ===');
    console.log('URL:', await this.page.url());
    console.log('Title:', await this.page.title());
    
    // Check if page is actually loaded
    const bodyText = await this.page.locator('body').textContent();
    console.log('Body text (first 500 chars):', bodyText?.substring(0, 500));
    
    // Check for any text containing "About"
    const aboutElements = await this.page.locator('*:has-text("About")').count();
    console.log('Elements with "About" text:', aboutElements);
    
    // Check for any text containing "Pet owners"
    const petOwnerElements = await this.page.locator('*:has-text("Pet owners")').count();
    console.log('Elements with "Pet owners" text:', petOwnerElements);
    
    // Check for any text containing "Safer"
    const saferElements = await this.page.locator('*:has-text("Safer")').count();
    console.log('Elements with "Safer" text:', saferElements);
    
    // Check for any text containing "Gentler"
    const gentlerElements = await this.page.locator('*:has-text("Gentler")').count();
    console.log('Elements with "Gentler" text:', gentlerElements);
    
    // Check for any text containing "More Effective"
    const moreEffectiveElements = await this.page.locator('*:has-text("More Effective")').count();
    console.log('Elements with "More Effective" text:', moreEffectiveElements);
    
    // Check for any text containing "PolyCarboMax"
    const polyCarboMaxElements = await this.page.locator('*:has-text("PolyCarboMax")').count();
    console.log('Elements with "PolyCarboMax" text:', polyCarboMaxElements);
    
    // Check if introduction image exists
    const introImages = await this.page.locator('img[alt="introduction"]').count();
    console.log('Introduction images:', introImages);
    
    // Check for any images
    const allImages = await this.page.locator('img').count();
    console.log('Total images on page:', allImages);
    
    // Check if page has any content at all
    const hasContent = await this.page.locator('body').textContent();
    console.log('Page has content:', hasContent ? 'YES' : 'NO');
    console.log('Content length:', hasContent?.length || 0);
    
    // Check for common error pages
    const errorTexts = ['404', 'Not Found', 'Error', 'Access Denied', 'Forbidden'];
    for (const errorText of errorTexts) {
      const errorElements = await this.page.locator(`*:has-text("${errorText}")`).count();
      if (errorElements > 0) {
        console.log(`ERROR: Found "${errorText}" on page`);
      }
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
      if (!url.includes('about-us')) {
        console.log('ERROR: Not on about-us page');
        return false;
      }
      
      // Check if page has any content
      if (!bodyText || bodyText.length < 100) {
        console.log('ERROR: Page has very little content');
        return false;
      }
      
      return true;
    } catch (error) {
      console.log('ERROR checking page load:', error);
      return false;
    }
  }

  async isElementPresent(selector: string): Promise<boolean> {
    try {
      const count = await this.page.locator(selector).count();
      return count > 0;
    } catch {
      return false;
    }
  }

  async getElementText(selector: string): Promise<string> {
    try {
      return await this.page.locator(selector).textContent() || '';
    } catch {
      return '';
    }
  }

  async debugFullPageContent(): Promise<void> {
    console.log('=== COMPREHENSIVE PAGE DEBUG ===');
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
    
    // Check for all buttons
    const buttons = await this.page.locator('button, [role="button"]').all();
    console.log('=== BUTTONS FOUND ===');
    for (let i = 0; i < buttons.length; i++) {
      const text = await buttons[i].textContent();
      const ariaLabel = await buttons[i].getAttribute('aria-label');
      console.log(`Button ${i + 1}: "${text?.trim()}" (aria-label: "${ariaLabel}")`);
    }
    
    // Check for all links
    const links = await this.page.locator('a').all();
    console.log('=== LINKS FOUND ===');
    for (let i = 0; i < links.length; i++) {
      const text = await links[i].textContent();
      const href = await links[i].getAttribute('href');
      console.log(`Link ${i + 1}: "${text?.trim()}" (href: "${href}")`);
    }
    
    // Check for all images
    const images = await this.page.locator('img').all();
    console.log('=== IMAGES FOUND ===');
    for (let i = 0; i < images.length; i++) {
      const alt = await images[i].getAttribute('alt');
      const src = await images[i].getAttribute('src');
      console.log(`Image ${i + 1}: alt="${alt}" src="${src?.substring(0, 50)}..."`);
    }
    
    // Check for all sections with specific text
    const sectionTexts = [
      'About FUR4', 'Pet owners', 'Safer', 'Gentler', 'More Effective', 
      'PolyCarboMax', 'Browse Our Products', 'Learn More', 'FUR4 deShedding tools'
    ];
    console.log('=== SECTION TEXT COUNTS ===');
    for (const text of sectionTexts) {
      const count = await this.page.locator(`*:has-text("${text}")`).count();
      console.log(`"${text}": ${count} elements found`);
    }
    
    // Check for specific elements by role
    console.log('=== ELEMENTS BY ROLE ===');
    const buttonRoles = await this.page.locator('[role="button"]').count();
    const imgRoles = await this.page.locator('[role="img"]').count();
    const linkRoles = await this.page.locator('[role="link"]').count();
    console.log(`Elements with role="button": ${buttonRoles}`);
    console.log(`Elements with role="img": ${imgRoles}`);
    console.log(`Elements with role="link": ${linkRoles}`);
    
    // Check for footer content
    const footer = await this.page.locator('footer').textContent();
    console.log('=== FOOTER CONTENT ===');
    console.log('Footer text:', footer?.substring(0, 500));
    
    // Check for navigation elements
    const nav = await this.page.locator('nav').count();
    console.log(`Navigation elements: ${nav}`);
    
    // Check for forms
    const forms = await this.page.locator('form').count();
    console.log(`Forms: ${forms}`);
    
    // Check for lists
    const lists = await this.page.locator('ul, ol').count();
    console.log(`Lists: ${lists}`);
    
    console.log('=== END COMPREHENSIVE DEBUG ===');
  }
} 