import { Page, Locator, expect } from '@playwright/test';

export class FaqPage {
  readonly page: Page;
  readonly faqHeader: Locator;
  readonly faqQuestions: Locator;
  readonly expandCollapseIcons: Locator;
  constructor(page: Page) {
    this.page = page;
    this.faqHeader = page.getByText('Frequently Asked Questions', { exact: true });
    this.faqQuestions = page.locator('h3, [class*="question"], [class*="faq"]').filter({ hasText: /^Q|Can the FUR4|How long should I use|What makes the FUR4|What should I do before|Does the FUR4|Why are the deShedding edges|Should I tell my friends|What are the common side effects/ });
    this.expandCollapseIcons = page.locator('[class*="chevron"], [class*="arrow"], [class*="expand"], [class*="collapse"]');
  }

  async navigateToFaqPage(): Promise<void> {
    const baseUrl = process.env.FUR4_MAIN_URL;
    if (!baseUrl) throw new Error('FUR4_MAIN_URL is not set in environment variables!');
    
    try {
      console.log('=== FAQ NAVIGATION DEBUG ===');
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
        
        // Click FAQ link from menu
        console.log('Looking for FAQ link in menu...');
        await this.clickFaqLinkFromMenu();
        console.log('FAQ link clicked');
        
        // Wait for navigation to complete
        console.log('Waiting for navigation to complete...');
        await this.page.waitForLoadState('networkidle', { timeout: 10000 });
        console.log('Navigation completed');
        console.log('URL after FAQ link click:', await this.page.url());
        
        // Wait for the FAQ header to be loaded
        console.log('Waiting for FAQ header...');
        await this.page.waitForSelector('h2', { hasText: 'Frequently Asked Questions' }, { timeout: 15000 });
        console.log('FAQ header found');
        console.log('Final URL:', await this.page.url());
        
        // Verify we actually reached the FAQ page
        const finalUrl = await this.page.url();
        if (!finalUrl.includes('faq')) {
          throw new Error('Menu navigation did not reach FAQ page');
        }
        
        console.log('=== END FAQ NAVIGATION DEBUG ===');
      } catch (menuError) {
        console.log('Menu navigation failed:', menuError.message);
        console.log('Falling back to direct navigation...');
        
        // Direct navigation fallback
        await this.page.goto(`${baseUrl}/faq`, { waitUntil: 'domcontentloaded' });
        await this.page.waitForSelector('body', { state: 'visible', timeout: 15000 });
        console.log('Direct navigation to FAQ page successful');
        
        // Wait for FAQ content to load
        await this.page.waitForSelector('h2', { hasText: 'Frequently Asked Questions' }, { timeout: 15000 });
        console.log('FAQ content loaded after direct navigation');
        console.log('Final URL after direct navigation:', await this.page.url());
      }
    } catch (error) {
      console.error('Navigation to FAQ page failed:', error);
      console.log('Current URL at error:', await this.page.url());
      console.log('Page title at error:', await this.page.title());
      throw error;
    }
  }

  async verifyPageLoad(): Promise<void> {
    await expect(this.page).toHaveURL(/faq/);
    // The FAQ page might not have "FAQ" in the title, so let's be more flexible
    await expect(this.page).toHaveTitle(/FUR4/i);
  }

  async isFaqHeaderVisible(): Promise<boolean> {
    try {
      await expect(this.faqHeader).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getFaqHeaderText(): Promise<string> {
    return await this.faqHeader.textContent() || '';
  }

  async getFaqQuestionsCount(): Promise<number> {
    return await this.faqQuestions.count();
  }

  async getAllFaqQuestions(): Promise<string[]> {
    const questions = await this.faqQuestions.all();
    const questionTexts: string[] = [];
    
    for (const question of questions) {
      const text = await question.textContent();
      if (text) {
        questionTexts.push(text.trim());
      }
    }
    
    return questionTexts;
  }

  async isExpandCollapseIconVisible(): Promise<boolean> {
    try {
      await expect(this.expandCollapseIcons.first()).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getExpandCollapseIconsCount(): Promise<number> {
    return await this.expandCollapseIcons.count();
  }

  // FAQ question interaction methods
  getFaqQuestionButton(questionIndex: number) {
    const questionTexts = [
      'Q Can the FUR4 deShedding Tool be used on all pets?',
      'Q How long should I use the FUR4 deShedding Tool on my pet?',
      'Q What makes the FUR4 deShedding Tool different?',
      'Q What should I do before deShedding my pet?',
      'Q Does the FUR4 deShedding Tool cut or damage the topcoat?',
      'Q Why are the deShedding edges made out of composite carbon fiber?',
      'Q Should I tell my friends with pets about FUR4?',
      'Q What are the common side effects of using the FUR4 deShedding Tool?'
    ];
    return this.page.getByRole('button', { name: questionTexts[questionIndex] });
  }

  async clickFaqQuestion(questionIndex: number): Promise<void> {
    const button = this.getFaqQuestionButton(questionIndex);
    await button.click();
    // Wait for potential animation/transition
    await this.page.waitForTimeout(500);
  }

  async isFaqAnswerVisible(questionIndex: number): Promise<boolean> {
    try {
      // Wait for answer content to appear with better selectors
      const answerSelectors = [
        'The FUR4 deShedding Tool can be used on most shedding animals',
        'One or two sessions a week for 10 to 15 minutes',
        'The patented FUR4 deShedding Tool is a safer, gentler and more',
        'The FUR4 deShedding Tool works best on a clean, dry coat',
        'No, the FUR4 deShedding Tool does not cut or damage your pet\'s topcoat',
        'Traditional deShedding tools required metal material',
        'Absolutely. Especially that \'one friend\' that has fur',
        'Common side effects... wagging tails, loud purring, increased relaxation'
      ];
      
      const expectedText = answerSelectors[questionIndex];
      const answerElement = this.page.locator(`*:has-text("${expectedText}")`).first();
      await expect(answerElement).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getFaqAnswerText(questionIndex: number): Promise<string> {
    // Get the answer text for the specific question
    const answerSelectors = [
      'The FUR4 deShedding Tool can be used on most shedding animals...',
      'One or two sessions a week for 10 to 15 minutes...',
      'The patented FUR4 deShedding Tool is a safer, gentler and more...',
      'The FUR4 deShedding Tool works best on a clean, dry coat...',
      'No, the FUR4 deShedding Tool does not cut or damage your pet\'s topcoat...',
      'Traditional deShedding tools required metal material...',
      'Absolutely. Especially that \'one friend\' that has fur...',
      'Common side effects... wagging tails, loud purring, increased relaxation...'
    ];
    
    const expectedText = answerSelectors[questionIndex];
    const answerElement = this.page.locator(`*:has-text("${expectedText}")`).first();
    return await answerElement.textContent() || '';
  }

  async isOnlyOneFaqExpanded(): Promise<boolean> {
    // Check if only one FAQ answer is visible at a time
    const visibleAnswers = await this.page.locator('*:has-text("The FUR4 deShedding Tool can be used on most shedding animals"), *:has-text("One or two sessions a week"), *:has-text("The patented FUR4 deShedding Tool"), *:has-text("The FUR4 deShedding Tool works best"), *:has-text("No, the FUR4 deShedding Tool does not cut"), *:has-text("Traditional deShedding tools required"), *:has-text("Absolutely. Especially that \'one friend\'"), *:has-text("Common side effects... wagging tails")').filter({ hasText: /The FUR4|One or two sessions|The patented FUR4|The FUR4 deShedding Tool works best|No, the FUR4|Traditional deShedding tools|Absolutely. Especially|Common side effects/ }).count();
    return visibleAnswers <= 1;
  }

  async getChevronIcon(questionIndex: number) {
    return this.page.locator('.lucide-chevron-down, .lucide-chevron-up').nth(questionIndex);
  }

  async isChevronRotated(questionIndex: number): Promise<boolean> {
    try {
      const chevron = await this.getChevronIcon(questionIndex);
      const className = await chevron.getAttribute('class');
      return className?.includes('rotate-180') || false;
    } catch {
      return false;
    }
  }

  async isFooterVisible(): Promise<boolean> {
    try {
      const footer = this.page.locator('footer, [class*="footer"], [id*="footer"]');
      await expect(footer.first()).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getFooterText(): Promise<string> {
    const footer = this.page.locator('footer, [class*="footer"], [id*="footer"]').first();
    return await footer.textContent() || '';
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  async setMobileViewport(): Promise<void> {
    await this.page.setViewportSize({ width: 375, height: 667 });
  }

  async setTabletViewport(): Promise<void> {
    await this.page.setViewportSize({ width: 768, height: 1024 });
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async getMetaDescription(): Promise<string> {
    const metaDescription = this.page.locator('meta[name="description"]');
    return await metaDescription.getAttribute('content') || '';
  }

  async debugFaqInteraction(questionIndex: number): Promise<void> {
    console.log(`=== DEBUG FAQ INTERACTION FOR QUESTION ${questionIndex} ===`);
    
    // Check if button exists
    const button = this.getFaqQuestionButton(questionIndex);
    const isButtonVisible = await button.isVisible();
    const buttonText = await button.textContent();
    console.log(`Button visible: ${isButtonVisible}, Text: "${buttonText?.trim()}"`);
    
    // Click the button
    console.log('Clicking FAQ question button...');
    await button.click();
    await this.page.waitForTimeout(1000);
    
    // Check for answer content
    const answerSelectors = [
      'The FUR4 deShedding Tool can be used on most shedding animals',
      'One or two sessions a week for 10 to 15 minutes',
      'The patented FUR4 deShedding Tool is a safer, gentler and more',
      'The FUR4 deShedding Tool works best on a clean, dry coat',
      'No, the FUR4 deShedding Tool does not cut or damage your pet\'s topcoat',
      'Traditional deShedding tools required metal material',
      'Absolutely. Especially that \'one friend\' that has fur',
      'Common side effects... wagging tails, loud purring, increased relaxation'
    ];
    
    const expectedText = answerSelectors[questionIndex];
    console.log(`Looking for answer text: "${expectedText}"`);
    
    // Check all elements with this text
    const allElementsWithText = this.page.locator(`*:has-text("${expectedText}")`);
    const count = await allElementsWithText.count();
    console.log(`Found ${count} elements with answer text`);
    
    for (let i = 0; i < count; i++) {
      const element = allElementsWithText.nth(i);
      const isVisible = await element.isVisible();
      const text = await element.textContent();
      console.log(`Element ${i + 1}: visible=${isVisible}, text="${text?.substring(0, 100)}..."`);
    }
    
    console.log('=== END FAQ INTERACTION DEBUG ===');
  }

  // Menu button methods (following HomeHero pattern)
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

  // Menu navigation methods (following HomeHero pattern)
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

  async clickFaqLinkFromMenu(): Promise<void> {
    // Debug: List all menu links first
    console.log('=== DEBUG: ALL MENU LINKS ===');
    const allMenuLinks = await this.page.locator('div.block a[href], nav a[href], [role="navigation"] a[href], a[href]').all();
    for (let i = 0; i < allMenuLinks.length; i++) {
      const text = await allMenuLinks[i].textContent();
      const href = await allMenuLinks[i].getAttribute('href');
      console.log(`Menu Link ${i + 1}: "${text?.trim()}" -> "${href}"`);
    }
    console.log('=== END DEBUG: ALL MENU LINKS ===');

    // Try multiple FAQ link selectors
    const faqSelectors = [
      'a[href*="faq"]',
      'a[href="/faq"]',
      'a[href="/faq/"]',
      'a:has-text("FAQ")',
      'a:has-text("Frequently Asked Questions")',
      'a:has-text("faq")',
      'a:has-text("Faq")',
      'a:has-text("Frequently")',
      'a:has-text("Questions")'
    ];

    for (const selector of faqSelectors) {
      try {
        const faqLink = this.page.locator(selector).first();
        const isVisible = await faqLink.isVisible();
        const text = await faqLink.textContent();
        const href = await faqLink.getAttribute('href');
        console.log(`Trying selector "${selector}": visible=${isVisible}, text="${text?.trim()}", href="${href}"`);
        
        if (isVisible) {
          console.log(`Found FAQ link with selector "${selector}"`);
          await faqLink.click();
          return;
        }
      } catch (error) {
        console.log(`Selector "${selector}" failed:`, error.message);
      }
    }

    // If no FAQ link found, try the original method
    console.log('No FAQ link found with specific selectors, trying original method...');
    try {
      await this.clickMenuLink('FAQ');
    } catch (error) {
      console.log('Original FAQ link method also failed, will use direct navigation fallback');
      throw new Error('FAQ link not found in menu');
    }
  }

  async checkIfPageLoaded(): Promise<boolean> {
    try {
      const url = await this.page.url();
      const title = await this.page.title();
      const bodyText = await this.page.locator('body').textContent();
      
      console.log('=== FAQ PAGE LOAD CHECK ===');
      console.log('FAQ Page URL:', url);
      console.log('FAQ Page Title:', title);
      console.log('FAQ Body text length:', bodyText?.length || 0);
      console.log('First 500 chars of body text:', bodyText?.substring(0, 500));
      
      // Check if we're on the right page
      if (!url.includes('faq')) {
        console.log('ERROR: Not on FAQ page - URL does not contain "faq"');
        return false;
      }
      
      // Check if page has any content
      if (!bodyText || bodyText.length < 100) {
        console.log('ERROR: FAQ page has very little content');
        return false;
      }
      
      // Check for FAQ-related content
      const hasFaqContent = bodyText.includes('Frequently Asked Questions') || 
                           bodyText.includes('FAQ') || 
                           bodyText.includes('Can the FUR4');
      
      if (!hasFaqContent) {
        console.log('ERROR: Page does not contain FAQ content');
        return false;
      }
      
      console.log('✓ FAQ page loaded successfully');
      console.log('=== END FAQ PAGE LOAD CHECK ===');
      return true;
    } catch (error) {
      console.log('ERROR checking FAQ page load:', error);
      return false;
    }
  }

  async debugFullPageContent(): Promise<void> {
    console.log('=== COMPREHENSIVE FAQ PAGE DEBUG ===');
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
    
    // Check for all FAQ questions
    const faqQuestions = await this.page.locator('h3').filter({ hasText: /^Q/ }).all();
    console.log('=== FAQ QUESTIONS FOUND ===');
    for (let i = 0; i < faqQuestions.length; i++) {
      const text = await faqQuestions[i].textContent();
      console.log(`FAQ Question ${i + 1}: "${text?.trim()}"`);
    }
    
    // Check for expand/collapse icons
    const expandIcons = await this.page.locator('[class*="chevron"], [class*="arrow"], [class*="expand"], [class*="collapse"]').all();
    console.log('=== EXPAND/COLLAPSE ICONS FOUND ===');
    for (let i = 0; i < expandIcons.length; i++) {
      const className = await expandIcons[i].getAttribute('class');
      console.log(`Icon ${i + 1}: class="${className}"`);
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
    
    // Check for specific FAQ-related text
    const faqTexts = [
      'Frequently Asked Questions', 'FAQ', 'Can the FUR4', 'How long should I use',
      'What makes the FUR4', 'What should I do before', 'Does the FUR4',
      'Why are the deShedding edges', 'Should I tell my friends', 'What are the common side effects'
    ];
    console.log('=== FAQ TEXT COUNTS ===');
    for (const text of faqTexts) {
      const count = await this.page.locator(`*:has-text("${text}")`).count();
      console.log(`"${text}": ${count} elements found`);
    }
    
    console.log('=== END FAQ PAGE DEBUG ===');
  }
} 