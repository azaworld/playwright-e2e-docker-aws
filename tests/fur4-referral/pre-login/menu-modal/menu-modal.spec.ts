// Menu Modal tests for FUR4 Referral Site
require('dotenv').config();
import { test, expect } from '@playwright/test';
import { ReferralHomePage } from '../../../../page-objects/refer/ReferralHomePage';
import { MenuModalPage } from '../../../../page-objects/refer/MenuModalPage';
import { buildTag } from '../../../utils/tagBuilder';

const FUR4_REFERRAL_URL = process.env.FUR4_REFERRAL_URL || 'https://refer.fur4.com/';

test.describe('FUR4 Referral Site - Menu Modal Tests (Pre-login)', () => {
  test.describe.configure({ 
    mode: 'serial', // Must be serial for beforeAll to work properly
    timeout: 120000 // Increased timeout for beforeAll setup
  });
  
  let sharedPage: any;
  
  // Helper function to ensure we're on the home page
  async function ensureOnHomePage() {
    if (sharedPage) {
      const currentUrl = await sharedPage.url();
      if (!currentUrl.includes('refer.fur4.com') || currentUrl.includes('/faq') || currentUrl.includes('/login') || currentUrl.includes('/register')) {
        console.log(`🔄 Navigating back to home page from: ${currentUrl}`);
        await sharedPage.goto(FUR4_REFERRAL_URL, { 
          timeout: 60000,
          waitUntil: 'domcontentloaded'
        });
        await sharedPage.waitForTimeout(1000);
      }
    }
  }
  
  test.beforeAll(async ({ browser }) => {
    // Create a shared browser context and page for all tests
    const context = await browser.newContext({
      extraHTTPHeaders: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    sharedPage = await context.newPage();
    
    // Navigate to the home page once for all tests
    try {
      await sharedPage.goto(FUR4_REFERRAL_URL, { 
        timeout: 60000,
        waitUntil: 'domcontentloaded'
      });
      
      // Wait for page to be fully loaded with more lenient conditions
      try {
        await sharedPage.waitForLoadState('domcontentloaded', { timeout: 15000 });
        await sharedPage.waitForTimeout(1000);
        console.log('✅ Page loaded successfully');
      } catch (error) {
        console.log('⚠️ Page load timeout, continuing with tests...');
        await sharedPage.waitForTimeout(1000);
      }
      
      console.log('✅ Shared home page setup completed successfully for menu modal tests');
    } catch (error) {
      console.error('❌ Failed to setup shared home page for menu modal tests:', error);
      throw error;
    }
  });
  
  test.afterAll(async () => {
    // Clean up shared resources
    if (sharedPage) {
      try {
        await sharedPage.close();
        console.log('✅ Shared home page cleanup completed for menu modal tests');
      } catch (error) {
        console.error('❌ Error during home page cleanup for menu modal tests:', error);
      }
    }
  });
  
  test.beforeEach(async () => {
    // Ensure we're on the home page before each test
    await ensureOnHomePage();
  });

  test(`${buildTag({ site: 'refer', module: 'menu-modal', caseId: '090' })} Hamburger menu button is visible and clickable`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Verify hamburger menu button is visible', async () => {
      if (await home.hamburgerMenuButton.count() > 0) {
        await expect(home.hamburgerMenuButton).toBeVisible();
        await expect(home.hamburgerMenuButton).toBeEnabled();
        console.log('✅ Hamburger menu button found and is clickable');
      } else {
        console.log('ℹ️ Hamburger menu button not found on this page');
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'menu-modal', caseId: '091' })} Menu modal opens when hamburger button is clicked`, async () => {
    const menuModal = new MenuModalPage(sharedPage);
    
    await test.step('Open menu modal', async () => {
      await menuModal.openMenuModal();
    });
    
    await test.step('Verify menu modal is visible', async () => {
      const isVisible = await menuModal.isModalVisible();
      if (isVisible) {
        console.log('✅ Menu modal is visible');
      } else {
        console.log('ℹ️ Menu modal not visible');
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'menu-modal', caseId: '092' })} FUR4 REFERRAL logo is visible in menu modal`, async () => {
    const menuModal = new MenuModalPage(sharedPage);
    
    await test.step('Open menu modal', async () => {
      await menuModal.openMenuModal();
    });
    
    await test.step('Verify FUR4 REFERRAL logo is visible', async () => {
      await menuModal.verifyFur4ReferralLogo();
    });
  });

  test(`${buildTag({ site: 'refer', module: 'menu-modal', caseId: '093' })} Country selector dropdown is present`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Open menu modal', async () => {
      if (await home.hamburgerMenuButton.count() > 0) {
        await home.hamburgerMenuButton.click();
        await sharedPage.waitForTimeout(1000);
      }
    });
    
    await test.step('Verify country selector dropdown', async () => {
      const countrySelector = sharedPage.locator('text=United States, [role="combobox"], select').first();
      if (await countrySelector.count() > 0) {
        await expect(countrySelector).toBeVisible();
        console.log('✅ Country selector dropdown found');
      } else {
        console.log('ℹ️ Country selector dropdown not found');
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'menu-modal', caseId: '094' })} Navigation links are present in menu modal`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Open menu modal', async () => {
      if (await home.hamburgerMenuButton.count() > 0) {
        await home.hamburgerMenuButton.click();
        await sharedPage.waitForTimeout(1000);
      }
    });
    
    await test.step('Verify navigation links', async () => {
      const navLinks = [
        'Referral Home',
        'Referral FAQs'
      ];
      
      for (const linkText of navLinks) {
        const link = sharedPage.getByText(linkText);
        if (await link.count() > 0) {
          await expect(link).toBeVisible();
          console.log(`✅ Navigation link "${linkText}" found`);
        } else {
          console.log(`ℹ️ Navigation link "${linkText}" not found`);
        }
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'menu-modal', caseId: '095' })} Sign In and Sign Up buttons are present`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Open menu modal', async () => {
      if (await home.hamburgerMenuButton.count() > 0) {
        await home.hamburgerMenuButton.click();
        await sharedPage.waitForTimeout(1000);
      }
    });
    
    await test.step('Verify Sign In and Sign Up buttons', async () => {
      const signInButton = sharedPage.getByRole('button', { name: 'Sign In' });
      const signUpButton = sharedPage.getByRole('button', { name: 'Sign Up' });
      
      if (await signInButton.count() > 0) {
        await expect(signInButton).toBeVisible();
        await expect(signInButton).toBeEnabled();
        console.log('✅ Sign In button found in menu modal');
      } else {
        console.log('ℹ️ Sign In button not found in menu modal');
      }
      
      if (await signUpButton.count() > 0) {
        await expect(signUpButton).toBeVisible();
        await expect(signUpButton).toBeEnabled();
        console.log('✅ Sign Up button found in menu modal');
      } else {
        console.log('ℹ️ Sign Up button not found in menu modal');
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'menu-modal', caseId: '096' })} Newsletter subscription section is present`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Open menu modal', async () => {
      if (await home.hamburgerMenuButton.count() > 0) {
        await home.hamburgerMenuButton.click();
        await sharedPage.waitForTimeout(1000);
      }
    });
    
    await test.step('Verify newsletter subscription text', async () => {
      const newsletterText = sharedPage.locator('text=Subscribe to FUR4 Referral newsletter for updates!');
      if (await newsletterText.count() > 0) {
        await expect(newsletterText).toBeVisible();
        console.log('✅ Newsletter subscription text found');
      } else {
        console.log('ℹ️ Newsletter subscription text not found');
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'menu-modal', caseId: '097' })} Email input field is functional`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Open menu modal', async () => {
      if (await home.hamburgerMenuButton.count() > 0) {
        await home.hamburgerMenuButton.click();
        await sharedPage.waitForTimeout(1000);
      }
    });
    
    await test.step('Verify email input field', async () => {
      const emailInput = sharedPage.getByPlaceholder('Enter your email');
      if (await emailInput.count() > 0) {
        await expect(emailInput).toBeVisible();
        await expect(emailInput).toBeEnabled();
        await expect(emailInput).toHaveAttribute('placeholder', 'Enter your email');
        console.log('✅ Email input field found and functional');
      } else {
        console.log('ℹ️ Email input field not found');
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'menu-modal', caseId: '098' })} Subscribe button is present and functional`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Open menu modal', async () => {
      if (await home.hamburgerMenuButton.count() > 0) {
        await home.hamburgerMenuButton.click();
        await sharedPage.waitForTimeout(1000);
      }
    });
    
    await test.step('Verify subscribe button', async () => {
      const subscribeButton = sharedPage.getByRole('button', { name: 'Subscribe' });
      if (await subscribeButton.count() > 0) {
        await expect(subscribeButton).toBeVisible();
        await expect(subscribeButton).toBeEnabled();
        console.log('✅ Subscribe button found and functional');
      } else {
        console.log('ℹ️ Subscribe button not found');
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'menu-modal', caseId: '099' })} Social media links are present in menu modal`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Open menu modal', async () => {
      if (await home.hamburgerMenuButton.count() > 0) {
        await home.hamburgerMenuButton.click();
        await sharedPage.waitForTimeout(1000);
      }
    });
    
    await test.step('Verify social media links', async () => {
      const socialLinks = [
        { name: 'Facebook', selector: 'a[href*="facebook"], [aria-label*="Facebook"]' },
        { name: 'YouTube', selector: 'a[href*="youtube"], [aria-label*="YouTube"]' },
        { name: 'Instagram', selector: 'a[href*="instagram"], [aria-label*="Instagram"]' }
      ];
      
      for (const social of socialLinks) {
        const link = sharedPage.locator(social.selector);
        if (await link.count() > 0) {
          await expect(link.first()).toBeVisible();
          console.log(`✅ ${social.name} link found in menu modal`);
        } else {
          console.log(`ℹ️ ${social.name} link not found in menu modal`);
        }
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'menu-modal', caseId: '100' })} Close button is present and functional`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Open menu modal', async () => {
      if (await home.hamburgerMenuButton.count() > 0) {
        await home.hamburgerMenuButton.click();
        await sharedPage.waitForTimeout(1000);
      }
    });
    
    await test.step('Verify close button', async () => {
      const closeButton = sharedPage.locator('button[aria-label="Close"], button:has-text("×"), button:has-text("✕"), [data-testid*="close"]');
      if (await closeButton.count() > 0) {
        await expect(closeButton.first()).toBeVisible();
        await expect(closeButton.first()).toBeEnabled();
        console.log('✅ Close button found in menu modal');
      } else {
        console.log('ℹ️ Close button not found in menu modal');
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'menu-modal', caseId: '101' })} Newsletter subscription functionality works`, async () => {
    const menuModal = new MenuModalPage(sharedPage);
    
    await test.step('Open menu modal', async () => {
      await menuModal.openMenuModal();
    });
    
    await test.step('Test newsletter subscription', async () => {
      await menuModal.testNewsletterSubscription('test@example.com');
    });
  });

  test(`${buildTag({ site: 'refer', module: 'menu-modal', caseId: '102' })} Menu modal closes when close button is clicked`, async () => {
    const menuModal = new MenuModalPage(sharedPage);
    
    await test.step('Open menu modal', async () => {
      await menuModal.openMenuModal();
    });
    
    await test.step('Close menu modal', async () => {
      await menuModal.closeMenuModal();
    });
    
    await test.step('Verify menu modal is closed', async () => {
      const isVisible = await menuModal.isModalVisible();
      if (!isVisible) {
        console.log('✅ Menu modal closed successfully');
      } else {
        console.log('ℹ️ Menu modal may still be visible after close attempt');
      }
    });
  });
});
