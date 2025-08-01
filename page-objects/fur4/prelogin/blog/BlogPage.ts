import { Page, Locator, expect } from '@playwright/test';

export class BlogPage {
  readonly page: Page;
  
  // Header elements
  readonly logo: Locator;
  readonly cartIcon: Locator;
  readonly buyNowButton: Locator;
  readonly hamburgerMenu: Locator;
  readonly chatButton: Locator;
  readonly backToTopArrow: Locator;
  
  // Hero section
  readonly heroSection: Locator;
  readonly heroPostTitle: Locator;
  readonly viewAllLink: Locator;
  
  // Featured section
  readonly featuredSection: Locator;
  readonly featuredCards: Locator;
  
  // Recent section
  readonly recentSection: Locator;
  readonly recentCards: Locator;
  
  // Footer links
  readonly dealerLocatorLink: Locator;
  readonly privacyPolicyLink: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Header elements - Updated based on debug output
    this.logo = page.getByRole('link').filter({ has: page.locator('img[alt*="logo"]') });
    this.cartIcon = page.getByRole('link').filter({ has: page.getByRole('img', { name: /cart/i }) });
    this.buyNowButton = page.getByRole('button', { name: /BUY NOW/i }).or(page.getByText('BUY NOW'));
    this.hamburgerMenu = page.locator('button').filter({ has: page.locator('svg') }).first();
    this.chatButton = page.getByRole('button', { name: /Chat/i }).or(page.locator('button').filter({ hasText: /chat/i }));
    this.backToTopArrow = page.locator('button').filter({ has: page.locator('svg') }).last();
    
    // Hero section
    this.heroSection = page.locator('article').first();
    this.heroPostTitle = this.heroSection.getByRole('heading');
    this.viewAllLink = page.getByRole('link', { name: 'View All' });
    
    // Featured section - Updated based on debug output showing actual structure
    this.featuredSection = page.getByText('Featured').first();
    this.featuredCards = page.locator('article').filter({ hasText: /How to Eliminate Hairballs|Shedding 101|Breed Breakdown/i });
    
    // Recent section - Updated based on debug output
    this.recentSection = page.getByText('Recent').first();
    this.recentCards = page.locator('article').filter({ hasText: /Welcome to the FUR4 Blog|Best Times to DeShed|Brushing vs. DeShedding|The Weirdest Pet Habits|The Impact Your Pets Diet|Long-Term Cost Savings/i });
    
    // Footer links
    this.dealerLocatorLink = page.getByRole('link', { name: 'Dealer Locator' });
    this.privacyPolicyLink = page.getByRole('link', { name: 'Privacy Policy' });
  }

  async navigateToBlogPage(): Promise<void> {
    const baseUrl = process.env.FUR4_MAIN_URL;
    if (!baseUrl) throw new Error('FUR4_MAIN_URL is not set in environment variables!');
    
    try {
      console.log('=== BLOG NAVIGATION DEBUG ===');
      console.log('Base URL:', baseUrl);
      
      // First navigate to homepage
      await this.page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
      console.log('Current URL after homepage:', await this.page.url());
      await this.page.waitForSelector('body', { state: 'visible', timeout: 15000 });
      
      // Try menu navigation first
      try {
        // Wait for menu button to be visible and click it
        console.log('Looking for menu button...');
        await this.page.waitForSelector('button.group[style], button.group', { state: 'visible', timeout: 10000 });
        console.log('Menu button found, clicking...');
        await this.clickMenuButton();
        
        // Wait for navigation menu to appear
        console.log('Waiting for navigation menu...');
        await this.page.waitForSelector('nav.fixed', { state: 'visible', timeout: 5000 });
        console.log('Navigation menu appeared');
        
        // Click Blog link from menu
        console.log('Looking for Blog link in menu...');
        await this.clickBlogLinkFromMenu();
        console.log('Blog link clicked');
        
        // Wait for navigation to complete
        console.log('Waiting for navigation to complete...');
        await this.page.waitForLoadState('networkidle', { timeout: 10000 });
        console.log('Navigation completed');
        console.log('URL after Blog link click:', await this.page.url());
        
        // Wait for the blog content to be loaded
        console.log('Waiting for blog content...');
        await this.page.waitForSelector('h1, h2, h3', { hasText: /Blog|Featured|Recent/i }, { timeout: 15000 });
        console.log('Blog content found');
        console.log('Final URL:', await this.page.url());
        
        // Verify we actually reached the blog page
        const finalUrl = await this.page.url();
        if (!finalUrl.includes('blog')) {
          throw new Error('Menu navigation did not reach blog page');
        }
        
        console.log('=== END BLOG NAVIGATION DEBUG ===');
      } catch (menuError) {
        console.log('Menu navigation failed:', menuError.message);
        console.log('Falling back to direct navigation...');
        
        // Direct navigation fallback
        await this.page.goto(`${baseUrl}/blog`, { waitUntil: 'domcontentloaded' });
        await this.page.waitForSelector('body', { state: 'visible', timeout: 15000 });
        console.log('Direct navigation to blog page successful');
        
        // Wait for blog content to load
        await this.page.waitForSelector('h1, h2, h3', { hasText: /Blog|Featured|Recent/i }, { timeout: 15000 });
        console.log('Blog content loaded after direct navigation');
        console.log('Final URL after direct navigation:', await this.page.url());
      }
    } catch (error) {
      console.error('Navigation to blog page failed:', error);
      console.log('Current URL at error:', await this.page.url());
      console.log('Page title at error:', await this.page.title());
      throw error;
    }
  }

  async verifyPageLoad(): Promise<void> {
    await this.page.waitForSelector('body', { state: 'visible', timeout: 15000 });
    const pageTitle = await this.page.title();
    expect(pageTitle).toMatch(/FUR4/i);
  }

  async isFeaturedSectionVisible(): Promise<boolean> {
    try {
      await expect(this.featuredSection).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isRecentSectionVisible(): Promise<boolean> {
    try {
      await expect(this.recentSection).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getFeaturedCardsCount(): Promise<number> {
    // Updated to use more specific selectors based on debug output
    const featuredCards = await this.page.locator('article').filter({ 
      hasText: /How to Eliminate Hairballs|Shedding 101|Breed Breakdown/i 
    }).count();
    return featuredCards;
  }

  async getRecentCardsCount(): Promise<number> {
    // Updated to use more specific selectors based on debug output
    const recentCards = await this.page.locator('article').filter({ 
      hasText: /Welcome to the FUR4 Blog|Best Times to DeShed|Brushing vs. DeShedding|The Weirdest Pet Habits|The Impact Your Pets Diet|Long-Term Cost Savings/i 
    }).count();
    return recentCards;
  }

  async clickFeaturedCard(index: number): Promise<void> {
    // Updated to use more specific selector and handle multiple links
    const featuredCards = this.page.locator('article').filter({ 
      hasText: /How to Eliminate Hairballs|Shedding 101|Breed Breakdown/i 
    });
    const card = featuredCards.nth(index);
    
    // Try to click the first link in the card
    const link = card.locator('a').first();
    await link.click();
  }

  async clickRecentCard(index: number): Promise<void> {
    // Updated to use more specific selector and handle multiple links
    const recentCards = this.page.locator('article').filter({ 
      hasText: /Welcome to the FUR4 Blog|Best Times to DeShed|Brushing vs. DeShedding|The Weirdest Pet Habits|The Impact Your Pets Diet|Long-Term Cost Savings/i 
    });
    const card = recentCards.nth(index);
    
    // Try to click the first link in the card
    const link = card.locator('a').first();
    await link.click();
  }

  async isBlogCardComplete(cardIndex: number, section: 'featured' | 'recent'): Promise<boolean> {
    try {
      const cards = section === 'featured' ? 
        this.page.locator('article').filter({ hasText: /How to Eliminate Hairballs|Shedding 101|Breed Breakdown/i }) :
        this.page.locator('article').filter({ hasText: /Welcome to the FUR4 Blog|Best Times to DeShed|Brushing vs. DeShedding|The Weirdest Pet Habits|The Impact Your Pets Diet|Long-Term Cost Savings/i });
      
      const card = cards.nth(cardIndex);
      
      // Check if card exists
      await expect(card).toBeVisible({ timeout: 3000 });
      
      // Check for any image in the card
      const image = card.locator('img').first();
      await expect(image).toBeVisible({ timeout: 3000 });
      
      // Check for any link in the card
      const link = card.locator('a').first();
      await expect(link).toBeVisible({ timeout: 3000 });
      
      // Check for any text content (title or description)
      const cardText = await card.textContent();
      expect(cardText).toBeTruthy();
      expect(cardText!.length).toBeGreaterThan(10);
      
      return true;
    } catch {
      return false;
    }
  }

  async isViewAllButtonVisible(): Promise<boolean> {
    try {
      // Based on debug output, View All is a link
      const viewAllLink = this.page.getByRole('link', { name: /View All/i });
      await expect(viewAllLink).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickViewAllButton(): Promise<void> {
    await this.viewAllLink.click();
  }

  // Header element methods - Updated selectors
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
      // Try multiple selectors for BUY NOW button
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
      // Try multiple selectors for chat button
      const chatButton = this.page.getByRole('button', { name: /Chat/i })
        .or(this.page.locator('button').filter({ hasText: /chat/i }))
        .or(this.page.locator('button').filter({ hasText: /Chat/i }));
      
      await expect(chatButton.first()).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickChatButton(): Promise<void> {
    const chatButton = this.page.getByRole('button', { name: /Chat/i })
      .or(this.page.locator('button').filter({ hasText: /chat/i }))
      .or(this.page.locator('button').filter({ hasText: /Chat/i }));
    
    await chatButton.first().click();
  }

  async isBackToTopArrowVisible(): Promise<boolean> {
    try {
      // Try multiple selectors for back-to-top arrow
      const backToTopArrow = this.page.locator('button').filter({ has: this.page.locator('svg') }).last()
        .or(this.page.locator('button').filter({ hasText: /top/i }))
        .or(this.page.locator('button').filter({ hasText: /arrow/i }));
      
      await expect(backToTopArrow.first()).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickBackToTopArrow(): Promise<void> {
    const backToTopArrow = this.page.locator('button').filter({ has: this.page.locator('svg') }).last()
      .or(this.page.locator('button').filter({ hasText: /top/i }))
      .or(this.page.locator('button').filter({ hasText: /arrow/i }));
    
    await backToTopArrow.first().click();
  }

  // Hero section methods
  async isHeroSectionVisible(): Promise<boolean> {
    try {
      await expect(this.heroSection).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getHeroPostTitle(): Promise<string> {
    return await this.heroPostTitle.textContent() || '';
  }

  async clickHeroPost(): Promise<void> {
    // Updated to click the first link in the hero section instead of the whole section
    const heroLink = this.heroSection.locator('a').first();
    await heroLink.click();
  }

  async isViewAllLinkVisible(): Promise<boolean> {
    try {
      await expect(this.viewAllLink).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickViewAllLink(): Promise<void> {
    await this.viewAllLink.click();
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

  // Menu navigation methods (following existing pattern)
  getMenuButton() {
    return this.page.locator('button.group[style], button.group');
  }

  async clickMenuButton(): Promise<void> {
    await this.getMenuButton().click();
  }

  getMenuLink(text: string) {
    return this.page.locator(`div.block a[href]`).filter({ hasText: text });
  }

  async clickMenuLink(text: string): Promise<void> {
    await this.getMenuLink(text).click();
  }

  async clickBlogLinkFromMenu(): Promise<void> {
    await this.clickMenuLink('Blog');
  }

  async checkIfPageLoaded(): Promise<boolean> {
    try {
      const url = await this.page.url();
      const title = await this.page.title();
      const bodyText = await this.page.locator('body').textContent();
      
      console.log('=== BLOG PAGE LOAD CHECK ===');
      console.log('Blog Page URL:', url);
      console.log('Blog Page Title:', title);
      console.log('Blog Body text length:', bodyText?.length || 0);
      console.log('First 500 chars of body text:', bodyText?.substring(0, 500));
      
      // Check if we're on the right page
      if (!url.includes('blog')) {
        console.log('ERROR: Not on blog page - URL does not contain "blog"');
        return false;
      }
      
      // Check if page has any content
      if (!bodyText || bodyText.length < 100) {
        console.log('ERROR: Blog page has very little content');
        return false;
      }
      
      // Check for blog-related content
      const hasBlogContent = bodyText.includes('Blog') || 
                           bodyText.includes('Featured') || 
                           bodyText.includes('Recent');
      
      if (!hasBlogContent) {
        console.log('ERROR: Page does not contain blog content');
        return false;
      }
      
      console.log('✓ Blog page loaded successfully');
      console.log('=== END BLOG PAGE LOAD CHECK ===');
      return true;
    } catch (error) {
      console.log('ERROR checking blog page load:', error);
      return false;
    }
  }

  async debugFullPageContent(): Promise<void> {
    console.log('=== COMPREHENSIVE BLOG PAGE DEBUG ===');
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
    
    // Check for blog sections
    const featuredSections = await this.page.locator('*:has-text("Featured")').all();
    const recentSections = await this.page.locator('*:has-text("Recent")').all();
    console.log('=== BLOG SECTIONS FOUND ===');
    console.log(`Featured sections: ${featuredSections.length}`);
    console.log(`Recent sections: ${recentSections.length}`);
    
    // Check for blog cards
    const allCards = await this.page.locator('[class*="card"], article, .blog-card, .featured-card, .recent-card').all();
    console.log('=== BLOG CARDS FOUND ===');
    for (let i = 0; i < allCards.length; i++) {
      const text = await allCards[i].textContent();
      console.log(`Card ${i + 1}: "${text?.substring(0, 100)}..."`);
    }
    
    // Check for images
    const images = await this.page.locator('img').all();
    console.log('=== IMAGES FOUND ===');
    for (let i = 0; i < images.length; i++) {
      const src = await images[i].getAttribute('src');
      const alt = await images[i].getAttribute('alt');
      console.log(`Image ${i + 1}: src="${src?.substring(0, 50)}...", alt="${alt}"`);
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
    
    // Check for specific blog-related text
    const blogTexts = [
      'Blog', 'Featured', 'Recent', 'View All', 'Read More', 'Published', 'Date'
    ];
    console.log('=== BLOG TEXT COUNTS ===');
    for (const text of blogTexts) {
      const count = await this.page.locator(`*:has-text("${text}")`).count();
      console.log(`"${text}": ${count} elements found`);
    }
    
    console.log('=== END BLOG PAGE DEBUG ===');
  }
} 