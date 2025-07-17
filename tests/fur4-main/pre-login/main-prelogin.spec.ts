// Pre-login (guest) test cases for FUR4 Main Site
require('dotenv').config();
import { test, expect } from '@playwright/test';
import { HomePage } from '../../../page-objects/fur4/HomePage';
import { CheckoutPage } from '../../../page-objects/fur4/CheckoutPage';
import { AuthPage } from '../../../page-objects/fur4/AuthPage';
import { TAGS } from '../../fixtures/tags';

const FUR4_MAIN_URL = process.env.FUR4_MAIN_URL;
if (!FUR4_MAIN_URL) throw new Error('FUR4_MAIN_URL is not set in environment variables');

test.describe(`${TAGS.MODULE.MAIN} FUR4 Main Site - Guest User Tests`, () => {
  test.beforeEach(async ({ page }) => {
    await page.context().setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
  });

  test.describe(`${TAGS.MODULE.MAIN} Homepage Tests`, () => {
    test(`Should load the homepage without errors and display all expected content ${TAGS.MAIN.M001}`, async ({ page }) => {
      await test.step('Navigate to the home page using the main site URL', async () => {
        const homePage = new HomePage(page);
        await homePage.gotoHome(FUR4_MAIN_URL);
      });
      await test.step('Verify the homepage is fully loaded and no 404 or missing content is present', async () => {
        const homePage = new HomePage(page);
        await homePage.verifyLoaded();
      });
    });
    test(`Should display all expected CTAs and navigation elements on the homepage ${TAGS.MAIN.M002}`, async ({ page }) => {
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

  test.describe(`${TAGS.MODULE.CHECKOUT} Cart and Checkout Tests`, () => {
    test(`Should allow a guest user to add an item to the cart ${TAGS.MAIN.M003}`, async ({ page }) => {
      await test.step('Navigate to the home page to start the add-to-cart flow', async () => {
        const homePage = new HomePage(page);
        await homePage.gotoHome(FUR4_MAIN_URL);
      });
      await test.step('Add an item to the cart as a guest user (TODO: implement logic in HomePage POM)', async () => {
        // TODO: Implement add to cart logic in HomePage page object model
      });
    });
    test(`Should allow a guest user to access the checkout flow ${TAGS.MAIN.M004}`, async ({ page }) => {
      await test.step('Navigate directly to the checkout page as a guest user', async () => {
        const checkoutPage = new CheckoutPage(page);
        await checkoutPage.gotoCheckout(FUR4_MAIN_URL + '/checkout');
      });
      await test.step('Verify all required checkout elements are present for guest checkout', async () => {
        const checkoutPage = new CheckoutPage(page);
        await checkoutPage.verifyCheckoutElements();
      });
    });
  });
});

test.describe(`${TAGS.MODULE.AUTH} Registration and Login Tests`, () => {
  test(`Should load and validate the registration form correctly ${TAGS.MAIN.M005}`, async ({ page }) => {
    await test.step('Navigate to the registration page using the main site URL', async () => {
      const authPage = new AuthPage(page);
      await authPage.gotoRegistration(FUR4_MAIN_URL + '/register');
    });
    await test.step('Verify the registration form is rendered and validates input as expected', async () => {
      const authPage = new AuthPage(page);
      await authPage.verifyRegistrationForm();
    });
  });
  test(`Should display social login buttons on the login page ${TAGS.MAIN.M006}`, async ({ page }) => {
    await test.step('Navigate to the login page using the main site URL', async () => {
      const authPage = new AuthPage(page);
      await authPage.gotoLogin(FUR4_MAIN_URL + '/login');
    });
    await test.step('Verify that all expected social login buttons are visible', async () => {
      const authPage = new AuthPage(page);
      await authPage.verifySocialLoginButtons();
    });
  });
}); 