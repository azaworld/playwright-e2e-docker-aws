// Pre-login (guest) test cases for FUR4 Referral Site
require('dotenv').config();
import { test, expect } from '@playwright/test';
import { ReferralHomePage } from '../../../page-objects/refer/ReferralHomePage';
import { SignupPage } from '../../../page-objects/refer/SignupPage';
import { DealerPage } from '../../../page-objects/refer/DealerPage';
import { NavigationPage } from '../../../page-objects/refer/NavigationPage';
import { SocialLoginPage } from '../../../page-objects/refer/SocialLoginPage';
import { TAGS } from '../../fixtures/tags';

const FUR4_REFERRAL_URL = process.env.FUR4_REFERRAL_URL;
if (!FUR4_REFERRAL_URL) throw new Error('FUR4_REFERRAL_URL is not set in environment variables');

test.describe(`${TAGS.MODULE.REF} FUR4 Referral Site - Guest User Tests`, () => {
  test.beforeEach(async ({ page }) => {
    await page.context().setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
  });

  test.describe(`${TAGS.MODULE.REF} Referral Landing Page Tests`, () => {
    test(`Should load the referral landing page and display all expected CTAs ${TAGS.REF.R001}`, async ({ page }, testInfo) => {
      const referralHome = new ReferralHomePage(page);
      await test.step('Navigate to the referral landing page using the referral site URL', async () => {
        await referralHome.gotoHome(FUR4_REFERRAL_URL);
      });
      await test.step('Verify the landing page is fully loaded and no missing content is present', async () => {
        await referralHome.verifyLoaded();
      });
      await test.step('Assert that all expected CTA buttons are present on the landing page', async () => {
        expect(await referralHome.hasCTA()).toBe(true);
      });
    });
  });

  test.describe(`${TAGS.MODULE.REF} Registration and Form Tests`, () => {
    test(`Should load and validate the signup form correctly ${TAGS.REF.R002}`, async ({ page }) => {
      const signupPage = new SignupPage(page);
      await test.step('Navigate to the signup page using the referral site URL', async () => {
        await signupPage.gotoSignup(`${FUR4_REFERRAL_URL}/signup`);
      });
      await test.step('Verify the signup form is rendered and validates input as expected', async () => {
        await signupPage.verifySignupForm();
      });
    });
  });

  test.describe(`${TAGS.MODULE.DEALER} Dealer Landing Page Tests`, () => {
    test(`Should load the dealer page from all possible URLs and display CTAs ${TAGS.REF.R003}`, async ({ page }) => {
      const dealerPage = new DealerPage(page);
      const dealerUrls = [
        `${FUR4_REFERRAL_URL}/dealer`,
        `${FUR4_REFERRAL_URL}/dealers`,
        `${FUR4_REFERRAL_URL}/partner`,
        `${FUR4_REFERRAL_URL}/business`
      ];
      let dealerPageFound = false;
      await test.step('Attempt to load the dealer page from each possible URL', async () => {
        for (const url of dealerUrls) {
          try {
            await dealerPage.gotoDealer(url);
            const title = await dealerPage.getTitle();
            if (!title.toLowerCase().includes('404') && !title.toLowerCase().includes('not found')) {
              dealerPageFound = true;
              await test.step(`Dealer page found at ${url} - verify CTAs`, async () => {
                await dealerPage.verifyDealerCTA();
              });
              break;
            }
          } catch (error) {
            // If loading fails, try the next URL
          }
        }
      });
      await test.step('Assert that at least one dealer page URL is valid and loaded', async () => {
        expect(dealerPageFound).toBe(true);
      });
    });
  });

  test.describe(`${TAGS.MODULE.NAV} Navigation and Footer Link Tests`, () => {
    test(`Should verify all main navigation links work as expected ${TAGS.REF.R004}`, async ({ page }) => {
      const navigationPage = new NavigationPage(page);
      await test.step('Navigate to the referral home page to check navigation links', async () => {
        await navigationPage.goto(FUR4_REFERRAL_URL);
      });
      await test.step('Verify all main navigation links are present and functional', async () => {
        await navigationPage.verifyNavigationLinks();
      });
    });
    test(`Should verify all footer links exist and function correctly ${TAGS.REF.R005}`, async ({ page }) => {
      const navigationPage = new NavigationPage(page);
      await test.step('Navigate to the referral home page to check footer links', async () => {
        await navigationPage.goto(FUR4_REFERRAL_URL);
      });
      await test.step('Verify all footer links are present and functional', async () => {
        await navigationPage.verifyFooterLinks();
      });
    });
  });

  test.describe(`${TAGS.MODULE.SOCIAL} Social Login UI Tests`, () => {
    test(`Should display all social login buttons on the login page ${TAGS.REF.R006}`, async ({ page }) => {
      const socialLoginPage = new SocialLoginPage(page);
      await test.step('Navigate to the login page using the referral site URL', async () => {
        await socialLoginPage.goto(`${FUR4_REFERRAL_URL}/login`);
      });
      await test.step('Verify that all expected social login buttons are visible', async () => {
        await socialLoginPage.verifySocialLoginButtons();
      });
    });
  });
}); 