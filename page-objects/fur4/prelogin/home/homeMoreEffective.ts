import { Page, Locator, expect } from '@playwright/test';

export class HomeMoreEffective {
  readonly page: Page;
  readonly section: Locator;
  readonly title: Locator;
  readonly tagline: Locator;
  readonly badge: Locator;
  readonly badgeImage: Locator;
  readonly productImage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.section = page.locator('section.more-effective');
    this.title = this.section.locator('h2, h1, h3, span').filter({ hasText: /^More Effective$/i }).first();
    this.tagline = this.section.locator('text=300% more deShedding area with FOUR PolyCarboMax composite carbon fiber edges');
    this.badge = this.section.locator('text=REDUCES SHEDDING UP TO 95%');
    // The badge image is the second image in the section (first is product, second is badge)
    this.badgeImage = this.section.locator('img').nth(1);
    this.productImage = this.section.locator('img.more-effective-image, img[alt*="brush"], img[alt*="product"], img[alt*="tool"]').first();
  }

  async navigateToHomepage(): Promise<void> {
    const baseUrl = process.env.FUR4_MAIN_URL;
    if (!baseUrl) throw new Error('FUR4_MAIN_URL is not set in environment variables!');
    await this.page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await this.page.waitForSelector('body', { state: 'visible', timeout: 15000 });
    await this.page.locator('[data-testid="logo"], img[alt*="FUR4"]').first().waitFor({ state: 'visible', timeout: 15000 });
  }

  async scrollToSection(): Promise<void> {
    let attempts = 0;
    const maxAttempts = 12;
    while (attempts < maxAttempts) {
      try {
        await expect(this.section).toBeVisible({ timeout: 2000 });
        break;
      } catch {
        await this.page.mouse.wheel(0, 500);
        await this.page.waitForTimeout(1000);
        attempts++;
      }
    }
    if (attempts >= maxAttempts) {
      throw new Error('Could not scroll to More Effective section');
    }
  }

  async isSectionVisible(): Promise<boolean> {
    try {
      await expect(this.section).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isTitleVisible(): Promise<boolean> {
    try {
      await expect(this.title).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getTitleText(): Promise<string> {
    return await this.title.textContent() || '';
  }

  async isTaglineVisible(): Promise<boolean> {
    try {
      await expect(this.tagline).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getTaglineText(): Promise<string> {
    return await this.tagline.textContent() || '';
  }

  async isBadgeVisible(): Promise<boolean> {
    try {
      await expect(this.badge).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getBadgeText(): Promise<string> {
    return await this.badge.textContent() || '';
  }

  async isBadgeImageVisible(): Promise<boolean> {
    try {
      await expect(this.badgeImage).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isProductImageVisible(): Promise<boolean> {
    try {
      await expect(this.productImage).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async checkForBrokenImages(): Promise<string[]> {
    const brokenImages: string[] = [];
    const images = await this.section.locator('img').all();
    for (const img of images) {
      const src = await img.getAttribute('src');
      if (src && (src.endsWith('.svg') || src.includes('.svg'))) continue; // skip SVGs
      if (img.scrollIntoViewIfNeeded) {
        await img.scrollIntoViewIfNeeded();
      }
      // Wait for the image to finish loading
      await img.evaluate((el: HTMLImageElement) => {
        return new Promise<void>((resolve) => {
          if (el.complete) return resolve();
          el.addEventListener('load', () => resolve(), { once: true });
          el.addEventListener('error', () => resolve(), { once: true });
        });
      });
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
