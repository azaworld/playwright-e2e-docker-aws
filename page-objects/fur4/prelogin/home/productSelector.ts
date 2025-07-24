import { Page, Locator, expect } from '@playwright/test';

export class ProductSelector {
  readonly page: Page;
  readonly section: Locator;
  readonly title: Locator;
  readonly cards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.section = page.locator('section.h-fit');
    this.title = this.section.locator('.container > div').filter({ hasText: 'The best tool FUR your FOUR Legged friends' }).first();
    this.cards = this.section.locator('.container .grid > div');
  }

  async scrollToSection(): Promise<void> {
    let attempts = 0;
    const maxAttempts = 10;
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
      throw new Error('Could not scroll to Product Selector section');
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

  async getCardCount(): Promise<number> {
    return await this.cards.count();
  }

  async getCardLabels(): Promise<string[]> {
    const labels: string[] = [];
    const cardDivs = await this.cards.all();
    for (const card of cardDivs) {
      const label = await card.locator('div, span, p').last().textContent().catch(() => '');
      labels.push(label?.trim() || '');
    }
    return labels;
  }

  async getCardImages(): Promise<Locator[]> {
    const cardDivs = await this.cards.all();
    return Promise.all(cardDivs.map(card => card.locator('img').first()));
  }

  async getCardImageAlts(): Promise<string[]> {
    const images = await this.getCardImages();
    return Promise.all(images.map(async img => (await img.getAttribute('alt')) || ''));
  }

  async getCardLearnMoreButtons(): Promise<Locator[]> {
    const cardDivs = await this.cards.all();
    return Promise.all(cardDivs.map(card => card.getByText('+ Learn More', { exact: false })));
  }

  async areAllLearnMoreButtonsVisible(): Promise<boolean> {
    const buttons = await this.getCardLearnMoreButtons();
    return (await Promise.all(buttons.map(async btn => await btn.isVisible()))).every(Boolean);
  }

  async clickAllLearnMoreButtonsAndCheckNavigation(): Promise<boolean[]> {
    const buttons = await this.getCardLearnMoreButtons();
    const results: boolean[] = [];
    for (const btn of buttons) {
      const [newPage] = await Promise.all([
        this.page.waitForEvent('popup').catch(() => null),
        btn.click()
      ]);
      if (newPage) {
        await newPage.waitForLoadState('domcontentloaded');
        results.push(true);
        await newPage.close();
      } else {
        results.push(false);
      }
    }
    return results;
  }

  async clickLearnMoreButtonAndAssertNavigation(index: number, expectedUrl: string, expectedH1: string, exactUrl: boolean = false): Promise<void> {
    const button = this.getCardLearnMoreButtonByIndex(index);
    const prevUrl = this.page.url();
    await Promise.all([
      this.page.waitForNavigation({ timeout: 10000 }),
      button.click()
    ]);
    // Assert URL
    const currentUrl = this.page.url();
    if (exactUrl) {
      expect(currentUrl).toBe(expectedUrl);
    } else {
      expect(currentUrl).toContain(expectedUrl);
      expect(currentUrl).not.toBe(prevUrl);
    }
    // Wait for the h1 to be visible and assert its text
    const h1 = this.page.locator('h1');
    await expect(h1).toBeVisible({ timeout: 5000 });
    const h1Text = await h1.textContent();
    expect(h1Text?.replace(/\s+/g, ' ').trim()).toBe(expectedH1);
  }

  async getCardLearnMoreButtonHref(index: number): Promise<string | null> {
    const buttons = await this.getCardLearnMoreButtons();
    const button = buttons[index];
    // If it's an <a>, get href; if it's a <button>, try to get parent <a> href
    const tag = await button.evaluate(el => el.tagName.toLowerCase());
    if (tag === 'a') {
      return await button.getAttribute('href');
    } else {
      // Try to find a parent <a>
      return await button.evaluate(el => {
        let parent = el.parentElement;
        while (parent) {
          if (parent.tagName.toLowerCase() === 'a') return parent.getAttribute('href');
          parent = parent.parentElement;
        }
        return null;
      });
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

  async getCardHandleColors(): Promise<string[]> {
    // This is a placeholder: you may need to use evaluate to get computed style of the handle element in each card
    const cardDivs = await this.cards.all();
    const colors: string[] = [];
    for (const card of cardDivs) {
      const img = card.locator('img').first();
      const color = await img.evaluate((el) => window.getComputedStyle(el).borderColor || window.getComputedStyle(el).boxShadow || '');
      colors.push(color);
    }
    return colors;
  }

  async checkLayoutAndSpacing(): Promise<any> {
    // Placeholder: you can expand this to check grid gap, alignment, etc.
    const grid = this.section.locator('.grid');
    if (!await grid.isVisible()) return null;
    return await grid.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        display: style.display,
        gridTemplateColumns: style.gridTemplateColumns,
        gap: style.gap,
        alignItems: style.alignItems,
        justifyItems: style.justifyItems,
      };
    });
  }

  async logSectionDivs(): Promise<void> {
    const divs = await this.section.locator('div').all();
    for (const div of divs) {
      const text = await div.textContent();
      const cls = await div.getAttribute('class');
      console.log('Div:', { cls, text });
    }
  }

  async getSectionTitleText(): Promise<string> {
    return (await this.title.textContent())?.replace(/\s+/g, ' ').trim() || '';
  }

  async getCardCountSimple(): Promise<number> {
    return await this.cards.count();
  }

  getCardImagesByAlt(): Locator[] {
    // Use the specific alt attributes for each product image
    return [
      this.section.locator('img[alt="FUR4 deShedding Tool - Long Hair Dog"]'),
      this.section.locator('img[alt="FUR4 deShedding Tool - Short Hair Dog"]'),
      this.section.locator('img[alt="FUR4 deShedding Tool - Long Hair Cat"]'),
      this.section.locator('img[alt="FUR4 deShedding Tool -  Short Hair Cat"]'),
    ];
  }

  async getCardImageCount(): Promise<number> {
    const images = this.getCardImagesByAlt();
    let count = 0;
    for (const img of images) {
      if (await img.first().isVisible().catch(() => false)) {
        count++;
      }
    }
    return count;
  }

  async getCardImageAltsSimple(): Promise<string[]> {
    const images = this.getCardImagesByAlt();
    const alts: string[] = [];
    for (const img of images) {
      const el = img.first();
      if (await el.isVisible().catch(() => false)) {
        alts.push((await el.getAttribute('alt')) || '');
      }
    }
    return alts;
  }

  getCardLearnMoreButtonsByClass(): Locator {
    // Robust selector: all button elements with text '+ Learn More' inside the section
    return this.section.locator('button').filter({ hasText: '+ Learn More' });
  }

  getCardLearnMoreButtonByIndex(index: number): Locator {
    return this.getCardLearnMoreButtonsByClass().nth(index);
  }
}
