import { Page, Locator, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

export class HomeHero {
  readonly page: Page;
  readonly logo: Locator;
  readonly heroTitle: Locator;
  readonly heroTagline: Locator;
  readonly heroDescription: Locator;
  readonly productImage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.locator('[data-testid="logo"], img[alt*="FUR4"], img[alt*="logo"]').first();
    this.heroTitle = page.locator('h1, [data-testid="hero-title"]').filter({ hasText: /deShedding Tool/i });
    this.heroTagline = page.getByText('safer, gentler and more effective', { exact: false });
    this.heroDescription = page.getByText('Designed to dramatically reduce shedding for', { exact: false });
    this.productImage = page.locator('img[alt*="product"], img[alt*="tool"], img[src*="product"]').first();
  }

  async navigateToHomepage(): Promise<void> {
    const baseUrl = process.env.FUR4_MAIN_URL;
    if (!baseUrl) throw new Error('FUR4_MAIN_URL is not set in environment variables!');
    await this.page.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await this.page.waitForSelector("body", { state: "visible", timeout: 15000 });
    await this.logo.waitFor({ state: "visible", timeout: 15000 });
  }

  async verifyPageLoad(): Promise<void> {
    await expect(this.page).toHaveTitle(/fur4/i);
    await expect(this.page.locator('body')).toBeVisible();
    await expect(this.logo).toBeVisible();
  }

  async isLogoVisible(): Promise<boolean> {
    try {
      await expect(this.logo).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isHeroDescriptionVisible(): Promise<boolean> {
    try {
      await expect(this.heroDescription).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getHeroDescriptionText(): Promise<string> {
    return await this.heroDescription.textContent() || '';
  }

  async isProductImageVisible(): Promise<boolean> {
    try {
      await expect(this.productImage).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isHeroTaglineVisible(): Promise<boolean> {
    try {
      await expect(this.heroTagline).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  // Hero image methods
  getHeroImage() {
    return this.page.locator('img[alt="deShedding Tool"]');
  }
  async isHeroImageVisible(): Promise<boolean> {
    try {
      await expect(this.getHeroImage()).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
  async getHeroImageSrc(): Promise<string> {
    return (await this.getHeroImage().getAttribute('src')) || '';
  }

  // Buy Now button methods
  getBuyNowButton() {
    return this.page.locator('svg:has-text("BUY NOW")');
  }
  async isBuyNowButtonVisible(): Promise<boolean> {
    try {
      await expect(this.getBuyNowButton()).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
  async isBuyNowButtonClickable(): Promise<boolean> {
    try {
      await expect(this.getBuyNowButton()).toBeEnabled({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
  async clickBuyNowButton(): Promise<void> {
    await this.getBuyNowButton().click();
  }

  // Cart icon methods
  getCartIcon() {
    return this.page.locator('img[alt="Cart"]');
  }
  async isCartIconVisible(): Promise<boolean> {
    try {
      await expect(this.getCartIcon()).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
  async clickCartIcon(): Promise<void> {
    await this.getCartIcon().click();
  }
  async isCartCountVisible(): Promise<boolean | undefined> {
    const itemCount = this.page.locator('[class*="cart"] [class*="count"], .cart-count, [data-testid*="count"]');
    if (await itemCount.count() > 0) {
      return await itemCount.first().isVisible();
    }
    return undefined;
  }

  // Menu button methods
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

  // Chat widget methods
  getChatWidget() {
    return this.page.getByText('Chat with us', { exact: false });
  }
  async isChatWidgetVisible(): Promise<boolean> {
    try {
      await expect(this.getChatWidget()).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
  async clickChatWidget(): Promise<void> {
    await this.getChatWidget().click();
  }

  // Back button methods
  getBackButton() {
    return this.page.locator('button#btn-back-to-top');
  }
  async isBackButtonVisible(): Promise<boolean> {
    try {
      await expect(this.getBackButton()).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
  async hoverBackButton(): Promise<void> {
    await this.getBackButton().hover();
    await this.page.waitForTimeout(500);
  }
  async getBackButtonColor(): Promise<string> {
    return await this.getBackButton().evaluate((el: HTMLElement) => window.getComputedStyle(el).backgroundColor);
  }
  async clickBackButton(): Promise<void> {
    await this.getBackButton().click();
  }

  // Footer methods
  getFooterHeading() {
    return this.page.locator('footer h3.font-semibold', { hasText: /^FUR4$/ });
  }
  async isFooterVisible(): Promise<boolean> {
    try {
      await expect(this.getFooterHeading()).toBeVisible();
      return true;
    } catch {
      return false;
    }
  }

  // Scroll to explore text
  getScrollToExploreText() {
    return this.page.getByText(/scroll to explore/i);
  }
  async isScrollToExploreTextVisible(): Promise<boolean> {
    try {
      await expect(this.getScrollToExploreText()).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  // Scroll down
  async scrollDown(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.page.waitForTimeout(500);
  }
}
