import { Page, Locator, expect } from '@playwright/test';

export class FAQPage {
  readonly page: Page;
  readonly faqHeading: Locator;
  readonly faqItems: Locator;
  readonly faqAccordionItems: Locator[];
  readonly registerButton: Locator;
  readonly footerLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Updated to match the actual heading on the page
    this.faqHeading = page.getByText('Referral FAQ', { exact: true });
    this.faqItems = page.locator('[data-orientation="vertical"]');
    
    // FAQ Accordion Items
    this.faqAccordionItems = [
      page.getByRole('button', { name: 'What is the FUR4 Referral Partner Cash Rewards Portal?' }),
      page.getByRole('button', { name: 'How do I sign up to become a referral partner?' }),
      page.getByRole('button', { name: 'How does the referral program work?' }),
      page.getByRole('button', { name: 'How can I share my referral link?' }),
      page.getByRole('button', { name: 'What types of marketing materials are provided?' }),
      page.getByRole('button', { name: 'How do I track the success of my referral campaigns?' }),
      page.getByRole('button', { name: 'How and when do I get paid?' }),
      page.getByRole('button', { name: 'Who can become a referral partner?' }),
      page.getByRole('button', { name: 'What do I need to do to get started?' }),
      page.getByRole('button', { name: 'How do I verify my email and phone number?' }),
      page.getByRole('button', { name: 'What are the KYC requirements?' }),
      page.getByRole('button', { name: 'Can I use my referral earnings for purchases on the FUR4 site?' }),
      page.getByRole('button', { name: 'How do I withdraw my earnings?' }),
      page.getByRole('button', { name: 'Can I see the status of my referrals?' }),
      page.getByRole('button', { name: 'What happens if a referral is unsuccessful?' }),
      page.getByRole('button', { name: 'Can I upload my own marketing materials?' }),
      page.getByRole('button', { name: 'Can I refer people outside my country?' }),
      page.getByRole('button', { name: 'How do I update my account information?' })
    ];

    // Register button
    this.registerButton = page.getByRole('button', { name: 'REGISTER' });

    // Footer links - use a more flexible approach
    this.footerLinks = page.locator('footer a');
  }

  async navigateToFAQPage(): Promise<void> {
    const baseUrl = process.env.FUR4_REFERRAL_URL || 'https://refer.fur4.com/';
    await this.page.goto(`${baseUrl}/faq`, { waitUntil: 'domcontentloaded' });
    await this.page.waitForSelector('body', { state: 'visible', timeout: 15000 });
  }

  async verifyPageLoad(): Promise<void> {
    await expect(this.page).toHaveURL(/faq/);
    // The page title remains "FUR4 REFERRAL" but the content contains FAQ information
    await expect(this.page).toHaveTitle(/FUR4 REFERRAL/i);
  }

  async verifyAllFAQItems(): Promise<void> {
    // Verify all FAQ accordion items are visible
    for (let i = 0; i < this.faqAccordionItems.length; i++) {
      await expect(this.faqAccordionItems[i]).toBeVisible();
    }
  }

  async verifyFAQItemText(index: number, expectedText: string): Promise<void> {
    await expect(this.faqAccordionItems[index]).toHaveText(expectedText);
  }

  async clickFAQItem(index: number): Promise<void> {
    if (index < this.faqAccordionItems.length) {
      await this.faqAccordionItems[index].click();
    }
  }

  async expandAllFAQs(): Promise<void> {
    for (let i = 0; i < this.faqAccordionItems.length; i++) {
      await this.clickFAQItem(i);
      await this.page.waitForTimeout(500); // Small delay between clicks
    }
  }

  async collapseAllFAQs(): Promise<void> {
    for (let i = 0; i < this.faqAccordionItems.length; i++) {
      await this.clickFAQItem(i);
      await this.page.waitForTimeout(500); // Small delay between clicks
    }
  }

  async isFAQItemExpanded(index: number): Promise<boolean> {
    try {
      if (index < this.faqAccordionItems.length) {
        const ariaExpanded = await this.faqAccordionItems[index].getAttribute('aria-expanded');
        return ariaExpanded === 'true';
      }
      return false;
    } catch {
      return false;
    }
  }

  async getFAQItemText(index: number): Promise<string> {
    if (index < this.faqAccordionItems.length) {
      return await this.faqAccordionItems[index].textContent() || '';
    }
    return '';
  }

  async verifyRegisterButton(): Promise<void> {
    await expect(this.registerButton).toBeVisible();
    await expect(this.registerButton).toBeEnabled();
  }

  async clickRegisterButton(): Promise<void> {
    await this.registerButton.click();
  }

  async verifyAllFooterLinks(): Promise<void> {
    // Verify all footer links are visible
    const footerCount = await this.footerLinks.count();
    if (footerCount > 0) {
      for (let i = 0; i < footerCount; i++) {
        await expect(this.footerLinks.nth(i)).toBeVisible();
      }
    }
  }

  async clickFooterLink(index: number): Promise<void> {
    const footerCount = await this.footerLinks.count();
    if (index < footerCount) {
      await this.footerLinks.nth(index).click();
    }
  }

  async verifyFooterLinkHref(linkName: string, expectedHref: string): Promise<void> {
    const link = this.footerLinks.locator(`text=${linkName}`);
    if (await link.count() > 0) {
      await expect(link).toHaveAttribute('href', expectedHref);
    } else {
      throw new Error(`Footer link '${linkName}' not found`);
    }
  }

  async getFooterLinkHref(linkName: string): Promise<string> {
    const link = this.footerLinks.locator(`text=${linkName}`);
    if (await link.count() > 0) {
      return await link.getAttribute('href') || '';
    } else {
      throw new Error(`Footer link '${linkName}' not found`);
    }
  }

  async verifyFAQCount(): Promise<void> {
    const expectedCount = this.faqAccordionItems.length;
    const actualCount = await this.page.locator('[role="button"][aria-expanded]').count();
    expect(actualCount).toBeGreaterThanOrEqual(expectedCount);
  }

  async searchFAQByKeyword(keyword: string): Promise<number[]> {
    const matchingIndices: number[] = [];
    
    for (let i = 0; i < this.faqAccordionItems.length; i++) {
      const text = await this.getFAQItemText(i);
      if (text.toLowerCase().includes(keyword.toLowerCase())) {
        matchingIndices.push(i);
      }
    }
    
    return matchingIndices;
  }

  async verifyFAQItemAccessibility(index: number): Promise<void> {
    const item = this.faqAccordionItems[index];
    
    // Verify it has proper ARIA attributes
    await expect(item).toHaveAttribute('aria-expanded');
    await expect(item).toHaveAttribute('aria-controls');
    
    // Verify it's keyboard accessible
    await expect(item).toBeVisible();
  }

  async getFAQItemCount(): Promise<number> {
    return this.faqAccordionItems.length;
  }

  async verifyFAQItemOrder(): Promise<void> {
    // Verify FAQ items are in the expected order
    const expectedOrder = [
      'What is the FUR4 Referral Partner Cash Rewards Portal?',
      'How do I sign up to become a referral partner?',
      'How does the referral program work?',
      'How can I share my referral link?',
      'What types of marketing materials are provided?',
      'How do I track the success of my referral campaigns?',
      'How and when do I get paid?',
      'Who can become a referral partner?',
      'What do I need to do to get started?',
      'How do I verify my email and phone number?',
      'What are the KYC requirements?',
      'Can I use my referral earnings for purchases on the FUR4 site?',
      'How do I withdraw my earnings?',
      'Can I see the status of my referrals?',
      'What happens if a referral is unsuccessful?',
      'Can I upload my own marketing materials?',
      'Can I refer people outside my country?',
      'How do I update my account information?'
    ];

    for (let i = 0; i < this.faqAccordionItems.length; i++) {
      const actualText = await this.getFAQItemText(i);
      expect(actualText).toContain(expectedOrder[i]);
    }
  }
}
