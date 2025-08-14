// Test runner for all FUR4 Referral Site pre-login tests
require('dotenv').config();
import { test, expect } from '@playwright/test';
import { ReferralHomePage } from '../../../page-objects/refer/ReferralHomePage';
import { RegisterPage } from '../../../page-objects/refer/RegisterPage';
import { LoginPage } from '../../../page-objects/refer/LoginPage';
import { FAQPage } from '../../../page-objects/refer/FAQPage';
import { buildTag } from '../../utils/tagBuilder';

const FUR4_REFERRAL_URL = process.env.FUR4_REFERRAL_URL || 'https://refer.fur4.com/';

test.describe('FUR4 Referral Site - Complete Pre-login Test Suite', () => {
  test.describe.configure({ mode: 'serial' }); // Run tests sequentially for comprehensive coverage
  
  test.beforeEach(async ({ page }) => {
    await page.context().setExtraHTTPHeaders({
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
  });

  // ===== HOME PAGE TESTS =====
  test.describe('Home Page Tests', () => {
    test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: 'COMP001' })} Complete home page functionality test`, async ({ page }) => {
      const home = new ReferralHomePage(page);
      
      // Navigate to home page
      await page.goto(FUR4_REFERRAL_URL);
      await page.waitForTimeout(1000);
      
      // Verify page loads
      await home.verifyLoaded();
      await expect(page).toHaveURL(FUR4_REFERRAL_URL);
      
      // Verify main navigation elements that actually exist
      await expect(page.getByRole('button', { name: 'REGISTER' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Get Your Unique Referral Link' })).toBeVisible();
      
      // Verify footer sections
      await home.verifyFooterIntroSection();
      await home.verifyFooterContactInfo();
      await home.verifyFooterLinkGroups();
      
      // Verify home page content
      await home.verifyHomeSectionsAndTexts();
      await home.verifyHomepageMainElements();
      await home.verifyReferralProgramTextVisible();
    });
  });

  // ===== REGISTER PAGE TESTS =====
  test.describe('Register Page Tests', () => {
    test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: 'COMP003' })} Complete register page functionality test`, async ({ page }) => {
      const register = new RegisterPage(page);
      
      // Navigate to register page
      await register.navigateToRegisterPage();
      
      // Verify page loads
      await register.verifyPageLoad();
      
      // Verify all form elements
      await register.verifyAllFormElements();
      
      // Test form functionality
      await register.selectCountryRegion('United States');
      await register.enterEmail('test@example.com');
      await register.enterPassword('TestPassword123!');
      await register.enterConfirmPassword('TestPassword123!');
      
      // Verify form validation
      expect(await register.isFormValid()).toBe(true);
      expect(await register.verifyPasswordFieldsMatch()).toBe(true);
      
      // Clear form
      await register.clearAllFields();
    });
  });

  // ===== LOGIN PAGE TESTS =====
  test.describe('Login Page Tests', () => {
    test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: 'COMP004' })} Complete login page functionality test`, async ({ page }) => {
      const login = new LoginPage(page);
      
      // Navigate to login page
      await login.navigateToLoginPage();
      
      // Verify page loads
      await login.verifyPageLoad();
      
      // Verify all login elements
      await login.verifyAllLoginElements();
      
      // Test mode switching
      await login.switchToEmailMode();
      expect(await login.isEmailModeActive()).toBe(true);
      
      await login.switchToPhoneMode();
      expect(await login.isPhoneModeActive()).toBe(true);
      
      // Test form functionality
      await login.enterValidEmail('test@example.com');
      await login.toggleRememberMe();
      expect(await login.isRememberMeChecked()).toBe(true);
      
      // Verify continue button
      expect(await login.isContinueButtonEnabled()).toBe(true);
    });
  });

  // ===== FAQ PAGE TESTS =====
  test.describe('FAQ Page Tests', () => {
    test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: 'COMP005' })} Complete FAQ page functionality test`, async ({ page }) => {
      const faq = new FAQPage(page);
      
      // Navigate to FAQ page
      await faq.navigateToFAQPage();
      
      // Verify page loads
      await faq.verifyPageLoad();
      
      // Verify FAQ content
      await faq.verifyAllFAQItems();
      
      // Verify register button
      await faq.verifyRegisterButton();
      
      // Verify footer links
      await faq.verifyAllFooterLinks();
    });
  });

  // ===== PAGE LOAD PERFORMANCE TEST =====
  test.describe('Page Load Performance Tests', () => {
    test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: 'COMP006' })} Page load performance test`, async ({ page }) => {
      const pages = [
        { url: FUR4_REFERRAL_URL, name: 'Home' },
        { url: `${FUR4_REFERRAL_URL}faq`, name: 'FAQ' },
        { url: `${FUR4_REFERRAL_URL}register`, name: 'Register' },
        { url: `${FUR4_REFERRAL_URL}login`, name: 'Login' }
      ];
      
      for (const pageInfo of pages) {
        const startTime = Date.now();
        await page.goto(pageInfo.url);
        await page.waitForLoadState('domcontentloaded');
        const loadTime = Date.now() - startTime;
        
        console.log(`${pageInfo.name} page loaded in ${loadTime}ms`);
        
        // Page should load within 15 seconds
        expect(loadTime).toBeLessThan(15000);
        
        // Verify page has content
        const bodyText = await page.locator('body').textContent();
        expect((bodyText?.length || 0)).toBeGreaterThan(100);
      }
    });
  });
});
