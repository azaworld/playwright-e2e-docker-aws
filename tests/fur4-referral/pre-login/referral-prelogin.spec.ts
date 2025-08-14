// Pre-login (guest) test cases for FUR4 Referral Site
require('dotenv').config();
import { test, expect } from '@playwright/test';
import { ReferralHomePage } from '../../../page-objects/refer/ReferralHomePage';
import { NavigationPage } from '../../../page-objects/refer/NavigationPage';
import { buildTag } from '../../utils/tagBuilder';

const FUR4_REFERRAL_URL = process.env.FUR4_REFERRAL_URL || 'https://refer.fur4.com/';

test.describe('FUR4 Referral Site - Guest User Tests (Pre-login)', () => {
  test.describe.configure({ mode: 'parallel' });
  test.beforeEach(async ({ page }) => {
    await page.context().setExtraHTTPHeaders({
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    await page.goto(FUR4_REFERRAL_URL);
    await page.waitForTimeout(1000);
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '001' })} Footer sections and links are visible`, async ({ page }) => {
    const home = new ReferralHomePage(page);

    await home.verifyFooterIntroSection();
    await home.verifyFooterContactInfo();
    await home.verifyFooterLinkGroups();
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '002' })} Home page sections and texts are visible`, async ({ page }) => {
    const home = new ReferralHomePage(page);

    await home.verifyHomeSectionsAndTexts();
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '003' })} Menu bar contains expected links`, async ({ page }) => {
    const nav = new NavigationPage(page);

    await nav.verifyMenuContainsExpectedLinks();
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '004' })} Homepage loads and displays main elements`, async ({ page }) => {
    const home = new ReferralHomePage(page);
    await home.verifyHomepageMainElements();
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '005' })} Referral program text is visible`, async ({ page }) => {
    const home = new ReferralHomePage(page);
    await home.verifyReferralProgramTextVisible();
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '006' })} FAQ link is present and clickable`, async ({ page }) => {
    const home = new ReferralHomePage(page);
    await home.clickFaqLinkAndWait();
    // Don't expect URL change since FAQ link doesn't navigate
    // Just verify we're still on the home page
    await expect(page).toHaveURL(/refer\.fur4\.com\/?$/);
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '007' })} Footer contact info is visible`, async ({ page }) => {
    const home = new ReferralHomePage(page);
    await home.verifyFooterContactInfo();
  });
});


