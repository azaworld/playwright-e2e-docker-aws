// Pre-login (guest) test cases for FUR4 Main Site
require('dotenv').config();
import { test, expect } from '@playwright/test';
import { HomePage } from '../../../page-objects/fur4/HomePage';
import { CheckoutPage } from '../../../page-objects/fur4/CheckoutPage';
import { AuthPage } from '../../../page-objects/fur4/AuthPage';
import { buildTag } from '../../utils/tagBuilder';

const FUR4_MAIN_URL = process.env.FUR4_MAIN_URL;
if (!FUR4_MAIN_URL) throw new Error('FUR4_MAIN_URL is not set in environment variables');

test.describe('FUR4 Main Site - Guest User Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
  });

  test.describe('Homepage Tests', () => {
    test(`${buildTag({ site: 'fur4', module: 'nav' })} Should display all expected CTAs and navigation elements on the homepage`, async ({ page }) => {
      await test.step('Navigate to the home page to check for CTAs and navigation', async () => {
        const homePage = new HomePage(page);
        await homePage.gotoHome(FUR4_MAIN_URL);
      });
      await test.step('Assert that all expected CTA buttons and navigation elements are present', async () => {
        const homePage = new HomePage(page);
        expect(await homePage.hasCTA()).toBe(true);
      });
    });
  });

  test.describe('Cart and Checkout Tests', () => {
    test(`${buildTag({ site: 'fur4', module: 'checkout' })} Should allow a guest user to add an item to the cart`, async ({ page }) => {
      await test.step('Navigate to the home page to start the add-to-cart flow', async () => {
        const homePage = new HomePage(page);
        await homePage.gotoHome(FUR4_MAIN_URL);
      });
      await test.step('Add an item to the cart as a guest user (TODO: implement logic in HomePage POM)', async () => {
        // TODO: Implement add to cart logic in HomePage page object model
      });
    });
  });
}); 