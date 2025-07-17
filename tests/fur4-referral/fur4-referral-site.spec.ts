require('dotenv').config();
import { test, expect } from '@playwright/test';
import { ReferralHomePage } from '../../page-objects/refer/ReferralHomePage';
import { SignupPage } from '../../page-objects/refer/SignupPage';
import { DealerPage } from '../../page-objects/refer/DealerPage';
import { NavigationPage } from '../../page-objects/refer/NavigationPage';
import { SocialLoginPage } from '../../page-objects/refer/SocialLoginPage';

const FUR4_REFERRAL_URL = process.env.FUR4_REFERRAL_URL;
if (!FUR4_REFERRAL_URL) throw new Error('FUR4_REFERRAL_URL is not set in environment variables');

test.describe('FUR4 Referral Site - Guest User Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
  });

  test.describe('Referral Landing Page Tests', () => {
    test('referral landing page loads correctly', async ({ page }) => {
      const referralHome = new ReferralHomePage(page);
      await referralHome.gotoHome(FUR4_REFERRAL_URL);
      await referralHome.verifyLoaded();
    });

    test('referral landing page has expected CTAs', async ({ page }) => {
      const referralHome = new ReferralHomePage(page);
      await referralHome.gotoHome(FUR4_REFERRAL_URL);
      expect(await referralHome.hasCTA()).toBe(true);
    });
  });

  test.describe('Registration and Form Tests', () => {
    test('registration forms load and validate on referral site', async ({ page }) => {
      const signupPage = new SignupPage(page);
      await signupPage.gotoSignup(FUR4_REFERRAL_URL + '/signup');
      await signupPage.verifySignupForm();
    });
  });

  test.describe('Dealer Landing Page Tests', () => {
    test('dealer landing page displays expected CTAs', async ({ page }) => {
      const dealerPage = new DealerPage(page);
      const dealerUrls = [
        FUR4_REFERRAL_URL + '/dealer',
        FUR4_REFERRAL_URL + '/dealers',
        FUR4_REFERRAL_URL + '/partner',
        FUR4_REFERRAL_URL + '/business'
      ];
      let dealerPageFound = false;
      for (const url of dealerUrls) {
        try {
          await dealerPage.gotoDealer(url);
          // If page loads without 404, check for CTAs
          const title = await dealerPage.getTitle();
          if (!title.toLowerCase().includes('404') && !title.toLowerCase().includes('not found')) {
            dealerPageFound = true;
            await dealerPage.verifyDealerCTA();
            break;
          }
        } catch (error) {
          continue;
        }
      }
      expect(dealerPageFound).toBe(true);
    });
  });

  test.describe('Navigation and Link Tests', () => {
    test('main navigation links work correctly', async ({ page }) => {
      const navigationPage = new NavigationPage(page);
      await navigationPage.goto(FUR4_REFERRAL_URL);
      await navigationPage.verifyNavigationLinks();
    });

    test('footer links are present and functional', async ({ page }) => {
      const navigationPage = new NavigationPage(page);
      await navigationPage.goto(FUR4_REFERRAL_URL);
      await navigationPage.verifyFooterLinks();
    });
  });

  test.describe('Social Login Tests', () => {
    test('social login buttons appear on referral site', async ({ page }) => {
      const socialLoginPage = new SocialLoginPage(page);
      await socialLoginPage.goto(FUR4_REFERRAL_URL + '/login');
      await socialLoginPage.verifySocialLoginButtons();
    });
  });
}); 