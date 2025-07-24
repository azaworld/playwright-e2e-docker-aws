import { Page, Locator, expect } from '@playwright/test';

export class HomeFooter {
  readonly page: Page;
  readonly footer: Locator;
  readonly description: Locator;
  readonly facebookIcon: Locator;
  readonly youtubeIcon: Locator;
  readonly instagramIcon: Locator;
  readonly contactSection: Locator;
  readonly contactInfo: Locator;
  readonly quickLinksSection: Locator;
  readonly quickLinks: Locator;
  readonly usefulLinksSection: Locator;
  readonly usefulLinks: Locator;
  readonly policiesSection: Locator;
  readonly policiesLinks: Locator;
  readonly copyright: Locator;

  constructor(page: Page) {
    this.page = page;
    this.footer = page.locator('footer');
    this.description = this.footer.locator('p').filter({ hasText: 'The FUR4 deShedding tool' });
    this.facebookIcon = this.footer.locator('a[href*="facebook.com/FUR4pets"]');
    this.youtubeIcon = this.footer.locator('a[href*="youtube.com/@FUR4PETS"]');
    this.instagramIcon = this.footer.locator('a[href*="instagram.com/fur4pets"]');
    this.contactSection = this.footer.locator('h2').filter({ hasText: 'contact' }).first().locator('..');
    this.contactInfo = this.contactSection.locator('nav li div.text-base');
    this.quickLinksSection = this.footer.locator('h2').filter({ hasText: 'QUICK LINKS' }).first().locator('..');
    this.quickLinks = this.quickLinksSection.locator('nav a');
    this.usefulLinksSection = this.footer.locator('h2').filter({ hasText: 'USEFUL LINKS' }).first().locator('..');
    this.usefulLinks = this.usefulLinksSection.locator('nav a');
    this.policiesSection = this.footer.locator('h2').filter({ hasText: 'POLICIES' }).first().locator('..');
    this.policiesLinks = this.policiesSection.locator('nav a');
    this.copyright = this.footer.locator('p.font-medium.text-sm').filter({ hasText: 'FUR4, LLC' });
  }

  async scrollToFooter(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    // Wait for the footer to be visible
    await expect(this.footer).toBeVisible({ timeout: 5000 });
  }

  async isFooterVisible(): Promise<boolean> {
    try {
      await expect(this.footer).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isDescriptionVisible(): Promise<boolean> {
    try {
      await expect(this.description).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getDescriptionText(): Promise<string> {
    return (await this.description.textContent())?.replace(/\s+/g, ' ').trim() || '';
  }

  async areSocialIconsVisible(): Promise<boolean[]> {
    return Promise.all([
      this.facebookIcon.isVisible().catch(() => false),
      this.youtubeIcon.isVisible().catch(() => false),
      this.instagramIcon.isVisible().catch(() => false),
    ]);
  }

  async getSocialIconHrefs(): Promise<string[]> {
    const hrefs = await Promise.all([
      this.facebookIcon.getAttribute('href'),
      this.youtubeIcon.getAttribute('href'),
      this.instagramIcon.getAttribute('href'),
    ]);
    return hrefs.filter((href): href is string => !!href);
  }

  async getContactInfoTexts(): Promise<string[]> {
    const items = await this.contactInfo.all();
    const texts: string[] = [];
    for (const item of items) {
      const text = await item.textContent();
      if (text) texts.push(text.trim());
    }
    return texts;
  }

  async getQuickLinksTextsAndHrefs(): Promise<{ text: string; href: string | null }[]> {
    const links = await this.quickLinks.all();
    const results: { text: string; href: string | null }[] = [];
    for (const link of links) {
      const text = (await link.textContent())?.trim() || '';
      const href = await link.getAttribute('href');
      results.push({ text, href });
    }
    return results;
  }

  async clickQuickLinkByText(linkText: string): Promise<void> {
    const link = this.quickLinks.filter({ hasText: linkText }).first();
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      link.click(),
    ]);
  }

  async getUsefulLinksTextsAndHrefs(): Promise<{ text: string; href: string | null }[]> {
    const links = await this.usefulLinks.all();
    const results: { text: string; href: string | null }[] = [];
    for (const link of links) {
      const text = (await link.textContent())?.trim() || '';
      const href = await link.getAttribute('href');
      results.push({ text, href });
    }
    return results;
  }

  async clickUsefulLinkByText(linkText: string): Promise<{ isExternal: boolean; url: string | null }> {
    const link = this.usefulLinks.filter({ hasText: linkText }).first();
    const href = await link.getAttribute('href');
    const isExternal = href?.startsWith('http');
    if (isExternal) {
      const [newPage] = await Promise.all([
        this.page.context().waitForEvent('page'),
        link.click(),
      ]);
      await newPage.waitForLoadState('domcontentloaded');
      return { isExternal: true, url: newPage.url() };
    } else {
      await Promise.all([
        this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
        link.click(),
      ]);
      return { isExternal: false, url: this.page.url() };
    }
  }

  async getPoliciesLinksTextsAndHrefs(): Promise<{ text: string; href: string | null }[]> {
    const links = await this.policiesLinks.all();
    const results: { text: string; href: string | null }[] = [];
    for (const link of links) {
      const text = (await link.textContent())?.trim() || '';
      const href = await link.getAttribute('href');
      results.push({ text, href });
    }
    return results;
  }

  async clickPoliciesLinkByText(linkText: string): Promise<string> {
    const link = this.policiesLinks.filter({ hasText: linkText }).first();
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      link.click(),
    ]);
    return this.page.url();
  }

  async getCopyrightText(): Promise<string> {
    return (await this.copyright.textContent())?.replace(/\s+/g, ' ').trim() || '';
  }
}
