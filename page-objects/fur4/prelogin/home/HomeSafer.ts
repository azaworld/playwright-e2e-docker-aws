import { Page, Locator, expect } from '@playwright/test';

export class HomeSafter {
  readonly page: Page;
  readonly saferSection: Locator;
  readonly saferTitle: Locator;
  readonly saferTagline: Locator;
  readonly noHarshBladesWarning: Locator;
  readonly warningIcon: Locator;
  readonly saferProductImage: Locator;
  readonly safetyNubsText: Locator;
  readonly antimicrobialText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.saferSection = page.locator('section, div').filter({ hasText: /Safer/i }).first();
    this.saferTitle = page.locator('h1, h2, h3').filter({ hasText: /^Safer$/i });
    this.saferTagline = page.locator('text=The safer way to deShed your pet');
    this.noHarshBladesWarning = page.locator('text=NO HARSH METAL BLADES');
    this.warningIcon = page.locator('[data-testid="warning-icon"], .warning-icon, svg[class*="warning"]').first();
    this.saferProductImage = this.saferSection.locator('img[alt*="product"], img[alt*="tool"], img[src*="product"]').first();
    this.safetyNubsText = page.locator('text=Eight SafetyNubs™ to prevent scraping or cutting');
    this.antimicrobialText = page.locator('text=Antimicrobial edges effective against bacteria up to 99.99%');
  }

  async navigateToHomepage(): Promise<void> {
    const baseUrl = process.env.FUR4_MAIN_URL;
    if (!baseUrl) throw new Error('FUR4_MAIN_URL is not set in environment variables!');
    await this.page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await this.page.waitForSelector('body', { state: 'visible', timeout: 15000 });
    await this.page.locator('[data-testid="logo"], img[alt*="FUR4"]').first().waitFor({ state: 'visible', timeout: 15000 });
  }

  async scrollToSaferSection(): Promise<void> {
    // Scroll down until the Safer section is visible
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      try {
        await expect(this.saferSection).toBeVisible({ timeout: 2000 });
        break;
      } catch {
        await this.page.mouse.wheel(0, 500);
        await this.page.waitForTimeout(1000);
        attempts++;
      }
    }
    
    if (attempts >= maxAttempts) {
      throw new Error('Could not scroll to Safer section');
    }
  }

  async isSaferSectionVisible(): Promise<boolean> {
    try {
      await expect(this.saferSection).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isSaferTitleVisible(): Promise<boolean> {
    try {
      await expect(this.saferTitle).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getSaferTitleText(): Promise<string> {
    return await this.saferTitle.textContent() || '';
  }

  async isSaferTaglineVisible(): Promise<boolean> {
    try {
      await expect(this.saferTagline).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getSaferTaglineText(): Promise<string> {
    return await this.saferTagline.textContent() || '';
  }

  async isNoHarshBladesWarningVisible(): Promise<boolean> {
    try {
      await expect(this.noHarshBladesWarning).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getNoHarshBladesWarningText(): Promise<string> {
    return await this.noHarshBladesWarning.textContent() || '';
  }

  async isWarningIconVisible(): Promise<boolean> {
    try {
      await expect(this.warningIcon).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isSaferProductImageVisible(): Promise<boolean> {
    try {
      await expect(this.saferProductImage).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isSafetyNubsTextVisible(): Promise<boolean> {
    try {
      await expect(this.safetyNubsText).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getSafetyNubsText(): Promise<string> {
    return await this.safetyNubsText.textContent() || '';
  }

  async isAntimicrobialTextVisible(): Promise<boolean> {
    try {
      await expect(this.antimicrobialText).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getAntimicrobialText(): Promise<string> {
    return await this.antimicrobialText.textContent() || '';
  }

  async checkSaferSectionLayout(): Promise<{
    hasBlueHighlight: boolean;
    hasRedWarningIcon: boolean;
    isTextAligned: boolean;
  }> {
    // Check for blue highlight styling
    const blueElement = await this.saferSection.locator('[style*="blue"], .blue, [class*="blue"]').count();
    const hasBlueHighlight = blueElement > 0;

    // Check for red warning icon
    const redIcon = await this.warningIcon.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.color.includes('red') || styles.fill.includes('red');
    }).catch(() => false);

    // Check text alignment (basic check)
    const isTextAligned = await this.saferSection.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });

    return {
      hasBlueHighlight,
      hasRedWarningIcon: redIcon,
      isTextAligned
    };
  }

  async checkForBrokenImages(): Promise<string[]> {
    const brokenImages: string[] = [];
    const images = await this.saferSection.locator('img').all();
    
    for (const img of images) {
      const src = await img.getAttribute('src');
      if (src) {
        const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
        if (naturalWidth === 0) {
          brokenImages.push(src);
        }
      }
    }
    
    return brokenImages;
  }

  async hasNoUIErrors(): Promise<boolean> {
    const errorTexts = ['error', 'not found', 'blocked', '404', '500'];
    
    for (const errorText of errorTexts) {
      const errorElement = this.saferSection.locator(`text=${errorText}`).first();
      if (await errorElement.isVisible()) {
        return false;
      }
    }
    
    // Check for missing icons or broken UI elements
    const missingElements = await this.saferSection.locator('[alt=""], img[src=""], svg[class=""]').count();
    return missingElements === 0;
  }

  async getSaferSectionColors(): Promise<{
    backgroundColor: string;
    textColor: string;
  }> {
    const backgroundColor = await this.saferSection.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });

    const textColor = await this.saferSection.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });

    return { backgroundColor, textColor };
  }

  async verifySaferSectionContent(): Promise<{
    hasSaferTitle: boolean;
    hasTagline: boolean;
    hasWarning: boolean;
    hasProductImage: boolean;
    hasSafetyInfo: boolean;
  }> {
    return {
      hasSaferTitle: await this.isSaferTitleVisible(),
      hasTagline: await this.isSaferTaglineVisible(),
      hasWarning: await this.isNoHarshBladesWarningVisible(),
      hasProductImage: await this.isSaferProductImageVisible(),
      hasSafetyInfo: await this.isSafetyNubsTextVisible() && await this.isAntimicrobialTextVisible()
    };
  }
}
