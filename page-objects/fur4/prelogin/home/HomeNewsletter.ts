import { Page, Locator, expect } from '@playwright/test';

export class HomeNewsletter {
  readonly page: Page;
  readonly inventorSection: Locator;
  readonly inventorTitle: Locator;
  readonly newsletterTitle: Locator;
  readonly emailInput: Locator;
  readonly subscribeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventorSection = page.locator('span').filter({ hasText: 'From the Inventor of the' }).first();
    this.inventorTitle = this.inventorSection;
    this.newsletterTitle = page.locator('h4').filter({ hasText: 'Subscribe to our newsletter' }).first();
    this.emailInput = page.locator('input[placeholder="Enter your email"]');
    this.subscribeButton = page.locator('button').filter({ hasText: 'Subscribe' });
  }

  async scrollToInventorSection(): Promise<void> {
    let attempts = 0;
    const maxAttempts = 10;
    while (attempts < maxAttempts) {
      try {
        await expect(this.inventorSection).toBeVisible({ timeout: 2000 });
        break;
      } catch {
        await this.page.mouse.wheel(0, 500);
        await this.page.waitForTimeout(1000);
        attempts++;
      }
    }
    if (attempts >= maxAttempts) {
      throw new Error('Could not scroll to Inventor section');
    }
  }

  async isInventorTitleVisible(): Promise<boolean> {
    try {
      await expect(this.inventorTitle).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getInventorTitleText(): Promise<string> {
    return (await this.inventorTitle.textContent())?.replace(/\s+/g, ' ').trim() || '';
  }

  async isNewsletterTitleVisible(): Promise<boolean> {
    try {
      await expect(this.newsletterTitle).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isEmailInputVisible(): Promise<boolean> {
    try {
      await expect(this.emailInput).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isSubscribeButtonVisible(): Promise<boolean> {
    try {
      await expect(this.subscribeButton).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async typeEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async getEmailInputValue(): Promise<string> {
    return await this.emailInput.inputValue();
  }

  async clickSubscribe(): Promise<void> {
    await this.subscribeButton.click();
  }

  async getFeedbackMessage(): Promise<string | null> {
    // Robust selector for the toast message text
    const feedback = this.page.locator('div.text-lg.whitespace-normal');
    if (await feedback.first().isVisible().catch(() => false)) {
      return (await feedback.first().textContent())?.trim() || null;
    }
    return null;
  }

  async checkNewsletterLayoutAndStyles(): Promise<{ fontFamily: string; fontWeight: string; color: string; backgroundColor: string; borderColor: string; textAlign: string; } | null> {
    // Check the newsletter title for font, weight, color, and alignment
    if (!await this.newsletterTitle.isVisible()) return null;
    return await this.newsletterTitle.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        fontFamily: style.fontFamily,
        fontWeight: style.fontWeight,
        color: style.color,
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
        textAlign: style.textAlign,
      };
    });
  }

  async hasNoBrokenUI(): Promise<boolean> {
    // Check that the input and button are visible and not visually hidden
    const inputVisible = await this.emailInput.isVisible().catch(() => false);
    const buttonVisible = await this.subscribeButton.isVisible().catch(() => false);
    // Optionally check for other UI issues (e.g., missing border, wrong color)
    return inputVisible && buttonVisible;
  }
}
