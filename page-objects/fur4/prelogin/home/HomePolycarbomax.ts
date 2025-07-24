import { Page, Locator, expect } from '@playwright/test';

export class HomePolycarbomax {
  readonly page: Page;
  readonly section: Locator;
  readonly title: Locator;
  readonly description: Locator;
  readonly learnMoreButton: Locator;
  readonly productImage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.section = page.locator('section, div').filter({ hasText: /PolyCarboMax/i }).first();
    this.title = this.section.locator('h2, h1, h3').filter({ hasText: /Advanced\s+PolyCarboMax\s+Material/i }).first();
    this.description = this.section.locator('text=FUR4’s superior deShedding design is made possible using an innovative new composite carbon fiber. This ground-breaking material is incredibly strong and curiously lightweight, enabling the innovative and patented FUR4 deShedding edges with eight SafetyNubs.');
    this.learnMoreButton = this.section.locator('button, a').filter({ hasText: '+ Learn More' }).first();
    this.productImage = this.section.locator('img, picture img').first();
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
      throw new Error('Could not scroll to Advanced PolyCarboMax Material section');
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

  async isDescriptionVisible(): Promise<boolean> {
    try {
      await expect(this.description).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getDescriptionText(): Promise<string> {
    return await this.description.textContent() || '';
  }

  async isLearnMoreButtonVisible(): Promise<boolean> {
    try {
      await expect(this.learnMoreButton).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickLearnMoreAndWaitForNavigation(): Promise<void> {
    await Promise.all([
      this.page.waitForURL('**/polycarbomax*', { timeout: 10000 }),
      this.learnMoreButton.click()
    ]);
  }

  async isPolyCarboMaxPageTitleVisible(): Promise<boolean> {
    const title = this.page.locator('h1').filter({ hasText: 'PolyCarboMax' });
    try {
      await expect(title).toBeVisible({ timeout: 5000 });
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

  async checkLayoutAndStyles(): Promise<{ fontFamily: string; fontWeight: string; color: string; textAlign: string; } | null> {
    // Check the main title for font, weight, color, and alignment
    if (!await this.title.isVisible()) return null;
    return await this.title.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        fontFamily: style.fontFamily,
        fontWeight: style.fontWeight,
        color: style.color,
        textAlign: style.textAlign,
      };
    });
  }
}
