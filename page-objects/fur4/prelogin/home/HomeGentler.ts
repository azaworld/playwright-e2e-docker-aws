import { Page, Locator, expect } from '@playwright/test';

export class HomeGentler {
  readonly page: Page;
  readonly gentlerSection: Locator;
  readonly gentlerTitle: Locator;
  readonly gentlerTagline: Locator;
  readonly gentlerProductImage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.gentlerSection = page.locator('section, div').filter({ hasText: /Gentler/i }).first();
    this.gentlerTitle = page.locator('h1, h2, h3, .gentler-title').filter({ hasText: /^Gentler$/i }).first();
    this.gentlerTagline = page.locator('text=Four deShedding edges spread out pressure for a comfortable grooming experience');
    this.gentlerProductImage = this.gentlerSection.locator('img[alt*="product"], img[alt*="tool"], img[src*="product"]').first();
  }

  async navigateToHomepage(): Promise<void> {
    const baseUrl = process.env.FUR4_MAIN_URL;
    if (!baseUrl) throw new Error('FUR4_MAIN_URL is not set in environment variables!');
    await this.page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await this.page.waitForSelector('body', { state: 'visible', timeout: 15000 });
    await this.page.locator('[data-testid="logo"], img[alt*="FUR4"]').first().waitFor({ state: 'visible', timeout: 15000 });
  }

  async scrollToGentlerSection(): Promise<void> {
    let attempts = 0;
    const maxAttempts = 10;
    while (attempts < maxAttempts) {
      try {
        await expect(this.gentlerSection).toBeVisible({ timeout: 2000 });
        break;
      } catch {
        await this.page.mouse.wheel(0, 500);
        await this.page.waitForTimeout(1000);
        attempts++;
      }
    }
    if (attempts >= maxAttempts) {
      throw new Error('Could not scroll to Gentler section');
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

  async isGentlerTitleVisible(): Promise<boolean> {
    try {
      await expect(this.gentlerTitle).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getGentlerTitleText(): Promise<string> {
    return await this.gentlerTitle.textContent() || '';
  }

  async isGentlerTaglineVisible(): Promise<boolean> {
    try {
      await expect(this.gentlerTagline).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getGentlerTaglineText(): Promise<string> {
    return await this.gentlerTagline.textContent() || '';
  }

  async isGentlerProductImageVisible(): Promise<boolean> {
    try {
      await expect(this.gentlerProductImage).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async checkForBrokenImages(): Promise<string[]> {
    const brokenImages: string[] = [];
    const images = await this.gentlerSection.locator('img').all();
    for (const img of images) {
      const src = await img.getAttribute('src');
      if (src && (src.endsWith('.svg') || src.includes('.svg'))) continue; // skip SVGs
      if (img.scrollIntoViewIfNeeded) {
        await img.scrollIntoViewIfNeeded();
      }
      if (src) {
        const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
        if (naturalWidth === 0) {
          brokenImages.push(src);
        }
      }
    }
    return brokenImages;
  }
}
