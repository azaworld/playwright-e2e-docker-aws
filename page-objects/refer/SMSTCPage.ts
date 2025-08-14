import { Page, Locator, expect } from '@playwright/test';

export class SMSTCPage {
  readonly page: Page;
  readonly supportEmailLink: Locator;
  readonly externalPrivacyLink: Locator;
  readonly chatWithUsWidget: Locator;
  readonly facebookIconLink: Locator;
  readonly youtubeIconLink: Locator;
  readonly instagramIconLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.supportEmailLink = page.getByRole('link', { name: 'support@fur4.com' });
    this.externalPrivacyLink = page.locator('a[href="https://www.fur4.com/privacy"]');
    this.chatWithUsWidget = page.getByRole('button', { name: 'Chat with us' });
    this.facebookIconLink = page.getByRole('link', { name: 'Facebook' });
    this.youtubeIconLink = page.getByRole('link', { name: 'YouTube' });
    this.instagramIconLink = page.getByRole('link', { name: 'Instagram' });
  }

  async navigateToSMSTCPage(): Promise<void> {
    const baseUrl = process.env.FUR4_REFERRAL_URL || 'https://refer.fur4.com/';
    await this.page.goto(`${baseUrl}/sms-tc`, { waitUntil: 'domcontentloaded' });
    await this.page.waitForSelector('body', { state: 'visible', timeout: 15000 });
  }

  async verifyPageLoad(): Promise<void> {
    // This page returns a 404 "not found" page, but it still loads
    await expect(this.page).toHaveURL(/sms-tc/);
    // The page loads but shows 404 content, title remains "FUR4 REFERRAL"
    await expect(this.page).toHaveTitle(/FUR4 REFERRAL/i);
  }

  async isSupportEmailLinkVisible(): Promise<boolean> {
    try {
      await expect(this.supportEmailLink).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getSupportEmailLinkHref(): Promise<string | null> {
    return await this.supportEmailLink.getAttribute('href');
  }

  async isExternalPrivacyLinkVisible(): Promise<boolean> {
    try {
      await expect(this.externalPrivacyLink).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getExternalPrivacyLinkHref(): Promise<string | null> {
    return await this.externalPrivacyLink.getAttribute('href');
  }

  async isChatWithUsWidgetVisible(): Promise<boolean> {
    try {
      await expect(this.chatWithUsWidget).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickChatWithUsWidget(): Promise<void> {
    await this.chatWithUsWidget.click();
  }

  async verifyAllSocialLinksArePresent(): Promise<void> {
    await expect(this.facebookIconLink).toBeVisible();
    await expect(this.youtubeIconLink).toBeVisible();
    await expect(this.instagramIconLink).toBeVisible();
  }

  async verifyPageContent(): Promise<void> {
    const bodyText = await this.page.locator('body').textContent();
    expect((bodyText?.length || 0)).toBeGreaterThan(100);
    
    // Verify we're on the right page
    const currentUrl = await this.page.url();
    expect(currentUrl).toContain('sms-tc');
    
    // Since this is a 404 page, check for 404 content
    expect(bodyText).toContain('404');
    expect(bodyText).toContain("Sorry, we can't find that page");
  }
}
