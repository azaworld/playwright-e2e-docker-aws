import { Page, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export class ThanksPage {
  private page: Page;
  
  // Main Sections
  private thanksPageSection: any;
  private thanksPageContainer: any;
  private toastifySection: any;
  private notificationRegion: any;
  private notificationList: any;

  constructor(page: Page) {
    this.page = page;
    this.thanksPageSection = page.locator('section.thanks-page');
    this.thanksPageContainer = page.locator('div.thanks-page__container');
    this.toastifySection = page.locator('section.Toastify');
    this.notificationRegion = page.getByRole('region', { name: 'Notifications (F8)' });
    this.notificationList = page.locator('ol.fixed.flex.flex-col-reverse');
  }

  async navigateToThanksPage(): Promise<void> {
    const baseUrl = process.env.FUR4_MAIN_URL;
    if (!baseUrl) throw new Error('FUR4_MAIN_URL is not set in environment variables!');
    
    try {
      console.log('=== THANKS PAGE NAVIGATION DEBUG ===');
      console.log('Base URL:', baseUrl);
      await this.page.goto(`${baseUrl}/thanks`, { waitUntil: 'domcontentloaded' });
      console.log('Current URL after navigation:', await this.page.url());
      await this.page.waitForSelector('body', { state: 'visible', timeout: 15000 });
      console.log('Body element loaded');
      console.log('=== END THANKS PAGE NAVIGATION DEBUG ===');
    } catch (error) {
      console.error('Navigation to Thanks page failed:', error);
      throw error;
    }
  }

  async verifyPageLoad(): Promise<void> {
    await this.page.waitForSelector('body', { state: 'visible', timeout: 15000 });
    const pageTitle = await this.page.title();
    expect(pageTitle).toMatch(/FUR4/i);
  }

  async checkIfPageLoaded(): Promise<boolean> {
    try {
      await this.verifyPageLoad();
      return true;
    } catch {
      return false;
    }
  }

  // Main Sections
  async isThanksPageSectionVisible(): Promise<boolean> {
    try {
      await expect(this.thanksPageSection).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isThanksPageContainerVisible(): Promise<boolean> {
    try {
      await expect(this.thanksPageContainer).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isToastifySectionVisible(): Promise<boolean> {
    try {
      await expect(this.toastifySection).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isNotificationRegionVisible(): Promise<boolean> {
    try {
      await expect(this.notificationRegion).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isNotificationListVisible(): Promise<boolean> {
    try {
      await expect(this.notificationList).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  // Meta and Head Elements
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async getMetaDescription(): Promise<string> {
    const metaDescription = this.page.locator('meta[name="description"]');
    return await metaDescription.getAttribute('content') || '';
  }

  async getCanonicalLink(): Promise<string> {
    const canonicalLink = this.page.locator('link[rel="canonical"]');
    return await canonicalLink.getAttribute('href') || '';
  }

  async getOpenGraphTitle(): Promise<string> {
    const ogTitle = this.page.locator('meta[property="og:title"]');
    return await ogTitle.getAttribute('content') || '';
  }

  // Debug Methods
  async debugFullPageContent(): Promise<void> {
    console.log('=== COMPREHENSIVE THANKS PAGE DEBUG ===');
    console.log('URL:', await this.page.url());
    console.log('Title:', await this.page.title());
    
    // Check main sections
    console.log('Thanks Page Section visible:', await this.isThanksPageSectionVisible());
    console.log('Thanks Page Container visible:', await this.isThanksPageContainerVisible());
    console.log('Toastify Section visible:', await this.isToastifySectionVisible());
    console.log('Notification Region visible:', await this.isNotificationRegionVisible());
    console.log('Notification List visible:', await this.isNotificationListVisible());
    
    // Check meta elements
    console.log('Meta Description:', await this.getMetaDescription());
    console.log('Canonical Link:', await this.getCanonicalLink());
    console.log('Open Graph Title:', await this.getOpenGraphTitle());
    
    // Log all elements with specific classes
    const thanksElements = await this.page.locator('[class*="thanks"]').count();
    console.log('Elements with "thanks" in class:', thanksElements);
    
    const toastifyElements = await this.page.locator('[class*="Toastify"]').count();
    console.log('Elements with "Toastify" in class:', toastifyElements);
    
    console.log('=== END COMPREHENSIVE THANKS PAGE DEBUG ===');
  }

  // Responsive Testing
  async setMobileViewport(): Promise<void> {
    await this.page.setViewportSize({ width: 375, height: 667 });
  }

  async setTabletViewport(): Promise<void> {
    await this.page.setViewportSize({ width: 768, height: 1024 });
  }

  async setDesktopViewport(): Promise<void> {
    await this.page.setViewportSize({ width: 1440, height: 900 });
  }
} 