import { Page, Locator, expect } from '@playwright/test';

export class StorageCase {
  readonly page: Page;
  readonly section: Locator;
  readonly title: Locator;
  readonly titleGray: Locator;
  readonly titleBlue: Locator;
  readonly packagingImage: Locator;
  readonly featureLabels: Locator[];

  constructor(page: Page) {
    this.page = page;
    this.section = page.locator('section.packaging');
    this.title = this.section.locator('h2').first();
    this.titleGray = this.title.locator('span').filter({ hasText: /Protective storage case/i });
    this.titleBlue = this.title.locator('span').filter({ hasText: /(included)/i });
    this.packagingImage = this.section.locator('img').first();
    this.featureLabels = [
      this.section.getByText('deShedding Tool', { exact: false }),
      this.section.getByText('Safer, Gentler & More Effective', { exact: false }),
      this.section.getByText('FOR SHORT HAIR CATS', { exact: false }),
    ];
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
    const maxAttempts = 15;
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
      throw new Error('Could not scroll to Protective storage case section');
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

  async isPackagingImageVisible(): Promise<boolean> {
    try {
      await expect(this.packagingImage).toBeVisible({ timeout: 5000 });
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

  async areFeatureLabelsVisible(): Promise<boolean[]> {
    return Promise.all(this.featureLabels.map(async (label) => {
      try {
        await expect(label).toBeVisible({ timeout: 5000 });
        return true;
      } catch {
        return false;
      }
    }));
  }

  async checkLayoutAndStyles(): Promise<{ fontFamily: string; fontWeight: string; color: string; textAlign: string; grayColor: string; blueColor: string; } | null> {
    // Check the main title and its spans for font, weight, color, and alignment
    if (!await this.title.isVisible()) return null;
    const style = await this.title.evaluate((el) => {
      const s = window.getComputedStyle(el);
      return {
        fontFamily: s.fontFamily,
        fontWeight: s.fontWeight,
        color: s.color,
        textAlign: s.textAlign,
      };
    });
    let grayColor = '', blueColor = '';
    if (await this.titleGray.isVisible()) {
      grayColor = await this.titleGray.evaluate((el) => window.getComputedStyle(el).color);
    }
    if (await this.titleBlue.isVisible()) {
      blueColor = await this.titleBlue.evaluate((el) => window.getComputedStyle(el).color);
    }
    return { ...style, grayColor, blueColor };
  }

  async logImagesAndTexts(): Promise<void> {
    const images = await this.section.locator('img').all();
    for (const img of images) {
      const src = await img.getAttribute('src');
      const alt = await img.getAttribute('alt');
      const cls = await img.getAttribute('class');
      console.log('Image:', { src, alt, cls });
    }
    const texts = await this.section.allTextContents();
    console.log('Section texts:', texts);
  }
}
