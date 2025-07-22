import { Page } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string, options?: Parameters<Page['goto']>[1]) {
    await this.page.goto(url, options);
  }

  async isVisible(selector: string) {
    return this.page.isVisible(selector);
  }

  async click(selector: string) {
    await this.page.click(selector);
  }

  async getTitle() {
    return this.page.title();
  }
}
