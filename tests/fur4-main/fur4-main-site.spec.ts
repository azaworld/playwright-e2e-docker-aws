require('dotenv').config();
import { test, expect } from '@playwright/test';
import { HomePage } from '../../page-objects/fur4/HomePage';
import { CheckoutPage } from '../../page-objects/fur4/CheckoutPage';
import { AuthPage } from '../../page-objects/fur4/AuthPage';

const FUR4_MAIN_URL = process.env.FUR4_MAIN_URL;
if (!FUR4_MAIN_URL) throw new Error('FUR4_MAIN_URL is not set in environment variables');

test.describe('[@module:main] FUR4 Main Site - Guest User Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
  });

  test.describe('[@module:main] Homepage Tests', () => {
    test('homepage loads correctly with no 404s or missing content [@case:MAIN-001]', async ({ page }) => {
      await test.step('Go to home page and verify loaded', async () => {
        const homePage = new HomePage(page);
        await homePage.gotoHome(FUR4_MAIN_URL);
        await homePage.verifyLoaded();
      });
    });

    test('homepage has expected CTAs and navigation [@case:MAIN-002]', async ({ page }) => {
      await test.step('Go to home page and check for CTAs', async () => {
        const homePage = new HomePage(page);
        await homePage.gotoHome(FUR4_MAIN_URL);
        expect(await homePage.hasCTA()).toBe(true);
      });
    });
  });

  test.describe('[@module:main] Cart and Checkout Tests', () => {
    test('add to cart functionality works for guest users [@case:MAIN-003]', async ({ page }) => {
      await test.step('Go to home page and (TODO) add to cart', async () => {
        const homePage = new HomePage(page);
        await homePage.gotoHome(FUR4_MAIN_URL);
        // Add to cart logic here (to be implemented in HomePage POM)
      });
    });

    test('guest checkout flow is accessible [@case:MAIN-004]', async ({ page }) => {
      await test.step('Go to checkout page and verify elements', async () => {
        const checkoutPage = new CheckoutPage(page);
        await checkoutPage.gotoCheckout(FUR4_MAIN_URL + '/checkout');
        await checkoutPage.verifyCheckoutElements();
      });
    });
  });
});

test.describe('[@module:main] Registration and Login Tests', () => {
  test('registration forms load and validate [@case:MAIN-005]', async ({ page }) => {
    await test.step('Go to registration page and verify form', async () => {
      const authPage = new AuthPage(page);
      await authPage.gotoRegistration(FUR4_MAIN_URL + '/register');
      await authPage.verifyRegistrationForm();
    });
  });

  test('social login buttons appear [@case:MAIN-006]', async ({ page }) => {
    await test.step('Go to login page and verify social login buttons', async () => {
      const authPage = new AuthPage(page);
      await authPage.gotoLogin(FUR4_MAIN_URL + '/login');
      await authPage.verifySocialLoginButtons();
    });
  });
}); 