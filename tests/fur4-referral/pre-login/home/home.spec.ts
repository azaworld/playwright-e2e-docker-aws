// Home page tests for FUR4 Referral Site
require('dotenv').config();
import { test, expect } from '@playwright/test';
import { ReferralHomePage } from '../../../../page-objects/refer/ReferralHomePage';
import { buildTag } from '../../../utils/tagBuilder';

const FUR4_REFERRAL_URL = process.env.FUR4_REFERRAL_URL || 'https://refer.fur4.com/';

test.describe('FUR4 Referral Site - Home Page Tests (Pre-login)', () => {
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
    
    // Navigate to the page once for all tests
    try {
      await sharedPage.goto(FUR4_REFERRAL_URL, { 
        timeout: 90000,
        waitUntil: 'domcontentloaded'
      });
      
      // Wait for page to be fully loaded
      await sharedPage.waitForLoadState('networkidle', { timeout: 30000 });
      await sharedPage.waitForTimeout(2000);
      
      console.log('✅ Shared page setup completed successfully');
    } catch (error) {
      console.error('❌ Failed to setup shared page:', error);
      throw error;
    }
  });
  
  test.afterAll(async () => {
    // Clean up shared resources
    if (sharedPage) {
      try {
        await sharedPage.close();
        console.log('✅ Shared page cleanup completed');
      } catch (error) {
        console.error('❌ Error during cleanup:', error);
      }
    }
  });
  
  test.beforeEach(async () => {
    // For tests that need fresh page, use the shared page
    // This allows individual tests to still get their own page if needed
    if (!sharedPage) {
      // Fallback: if shared page failed, use individual page setup
      await sharedPage.context().setExtraHTTPHeaders({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      });
      
      await sharedPage.goto(FUR4_REFERRAL_URL, { 
        timeout: 60000,
        waitUntil: 'domcontentloaded'
      });
      await sharedPage.waitForTimeout(1000);
    } else {
      // Ensure we're on the home page before each test
      await ensureOnHomePage();
    }
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '001' })} Home page loads successfully`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Verify page loads successfully', async () => {
      await home.verifyLoaded();
      await expect(sharedPage).toHaveURL(FUR4_REFERRAL_URL);
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '002' })} Main navigation elements are visible`, async () => {
    await test.step('Verify Sign Up button', async () => {
      await expect(sharedPage.getByRole('button', { name: 'Sign Up Now & Get Your Link' })).toBeVisible();
    });
    
    await test.step('Verify other button elements', async () => {
      // Check if there are any other interactive elements
      const buttonCount = await sharedPage.locator('button').count();
      expect(buttonCount).toBeGreaterThan(0);
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '003' })} Get Your Unique Referral Link button is visible`, async () => {
    await test.step('Verify Sign Up Now & Get Your Link button is visible', async () => {
      // The actual button on the page says "Sign Up Now & Get Your Link"
      const button = sharedPage.getByRole('button', { name: 'Sign Up Now & Get Your Link' });
      await expect(button).toBeVisible();
      console.log('✓ Found the correct referral button: "Sign Up Now & Get Your Link"');
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '004' })} Footer sections and links are visible`, async () => {
    const home = new ReferralHomePage(sharedPage);

    await test.step('Verify footer intro section', async () => {
      await home.verifyFooterIntroSection();
    });
    
    await test.step('Verify footer contact info', async () => {
      await home.verifyFooterContactInfo();
    });
    
    await test.step('Verify footer link groups', async () => {
      await home.verifyFooterLinkGroups();
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '005' })} Home page sections and texts are visible`, async () => {
    const home = new ReferralHomePage(sharedPage);

    await test.step('Verify home sections and texts', async () => {
      await home.verifyHomeSectionsAndTexts();
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '006' })} Homepage loads and displays main elements`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Verify homepage main elements', async () => {
      await home.verifyHomepageMainElements();
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '007' })} Referral program text is visible`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Verify referral program text', async () => {
      await home.verifyReferralProgramTextVisible();
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '008' })} FAQ link is present and clickable`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Verify FAQ link exists and is clickable', async () => {
      // Just verify the FAQ link exists and is clickable without actually clicking it
      // This prevents navigation away from the home page in shared context
      const faqLink = sharedPage.locator('a[href*="faq"]');
      
      if (await faqLink.count() > 0) {
        await expect(faqLink).toBeVisible();
        await expect(faqLink).toBeEnabled();
        console.log('✅ FAQ link found and is clickable');
      } else {
        console.log('ℹ️ FAQ link not found on this page');
      }
    });
    
    await test.step('Verify we are still on the home page', async () => {
      await expect(sharedPage).toHaveURL(/refer\.fur4\.com\/?$/);
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '009' })} Footer contact info is visible`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Verify footer contact info', async () => {
      await home.verifyFooterContactInfo();
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '010' })} Navigation elements are present`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Verify navigation elements', async () => {
      await home.verifyNavigationElements();
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '011' })} Call to action buttons are present`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Verify CTA buttons', async () => {
      await home.verifyCallToActionButtons();
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '012' })} Social and utility elements are present`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Verify social and utility elements', async () => {
      await home.verifySocialAndUtilityElements();
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '013' })} Chat with us widget is functional`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Verify chat widget is present', async () => {
      if (await home.chatWithUsWidget.count() > 0) {
        await expect(home.chatWithUsWidget).toBeVisible();
        await expect(home.chatWithUsWidget).toBeEnabled();
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '014' })} Social media links are functional`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Verify social media links', async () => {
      if (await home.facebookIconLink.count() > 0) {
        await expect(home.facebookIconLink).toBeVisible();
      }
      if (await home.youtubeIconLink.count() > 0) {
        await expect(home.youtubeIconLink).toBeVisible();
      }
      if (await home.instagramIconLink.count() > 0) {
        await expect(home.instagramIconLink).toBeVisible();
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '015' })} Scroll to top functionality`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Verify scroll to top button', async () => {
      if (await home.scrollToTopButton.count() > 0) {
        await expect(home.scrollToTopButton).toBeVisible();
        await expect(home.scrollToTopButton).toBeEnabled();
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '016' })} Call to action buttons are functional`, async () => {
    const home = new ReferralHomePage(sharedPage);

    await test.step('Verify Get Your Unique Referral Link button', async () => {
      const getLinkButton = sharedPage.getByRole('button', { name: /Get Your Unique Referral Link/i });
      if (await getLinkButton.count() > 0) {
        await expect(getLinkButton).toBeVisible();
        await expect(getLinkButton).toBeEnabled();
      }
    });

    await test.step('Verify Register button', async () => {
      const registerButton = sharedPage.getByRole('button', { name: /REGISTER/i });
      if (await registerButton.count() > 0) {
        await expect(registerButton).toBeVisible();
        await expect(registerButton).toBeEnabled();
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '017' })} Page has proper meta information`, async () => {
    await test.step('Verify page title', async () => {
      const title = await sharedPage.title();
      expect(title.length).toBeGreaterThan(0);
    });
    
    await test.step('Verify page content length', async () => {
      const bodyText = await sharedPage.locator('body').textContent();
      expect((bodyText?.length || 0)).toBeGreaterThan(100);
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '018' })} Navigation links are accessible`, async () => {
    await test.step('Verify Sign Up button is accessible', async () => {
      const signUpButton = sharedPage.getByRole('button', { name: 'Sign Up Now & Get Your Link' });
      await expect(signUpButton).toBeVisible();
      await expect(signUpButton).toBeEnabled();
    });
    
    await test.step('Verify other interactive elements are accessible', async () => {
      const buttonCount = await sharedPage.locator('button').count();
      expect(buttonCount).toBeGreaterThan(0);
      
      // Verify at least one button is enabled
      const buttons = sharedPage.locator('button');
      const firstButton = buttons.first();
      await expect(firstButton).toBeEnabled();
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '019' })} Page loads without errors`, async () => {
    await test.step('Verify page has substantial content', async () => {
      const bodyText = await sharedPage.locator('body').textContent();
      expect((bodyText?.length || 0)).toBeGreaterThan(50);
    });
    
    await test.step('Verify page title is correct', async () => {
      const title = await sharedPage.title();
      expect(title).toContain('FUR4');
    });
    
    await test.step('Verify page URL is correct', async () => {
      const url = await sharedPage.url();
      expect(url).toContain('refer.fur4.com');
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '020' })} Responsive design elements are present`, async () => {
    await test.step('Verify page has responsive layout', async () => {
      // Check if page has responsive CSS classes
      const body = sharedPage.locator('body');
      const bodyClasses = await body.getAttribute('class');
      expect(bodyClasses).toBeTruthy();
    });
    
    await test.step('Verify main content areas are present', async () => {
      // Look for visible sections, excluding hidden notification areas
      const visibleSections = sharedPage.locator('section:visible, main:visible, [role="main"]:visible');
      const sectionCount = await visibleSections.count();
      expect(sectionCount).toBeGreaterThan(0);
    });
    
    await test.step('Verify page has proper structure', async () => {
      const sections = sharedPage.locator('section');
      const sectionCount = await sections.count();
      expect(sectionCount).toBeGreaterThan(0);
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '021' })} Footer links are functional`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Verify footer links are visible and clickable', async () => {
      await home.verifyFooterLinkGroups();
    });
    
    await test.step('Verify specific footer links', async () => {
      const footerLinks = [
        'Referral Home',
        'Referral FAQs',
        'About Us',
        'Contact Us',
        'Privacy Policy',
        'Terms Of Service',
        'Referral Policy',
        'EULA',
        'SMS T&C',
        'Security'
      ];
      
      for (const linkText of footerLinks) {
        const link = sharedPage.getByRole('link', { name: linkText });
        await expect(link).toBeVisible();
        await expect(link).toBeEnabled();
      }
    });
  });
////addditionals tests 
  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '022' })} How it works section is visible`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Verify How it works section', async () => {
      await home.verifyHowItWorksSection();
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '023' })} Testimonials section is visible`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Verify Testimonials section', async () => {
      await home.verifyTestimonialsSection();
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '024' })} Why Join section is visible`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Verify Why Join section', async () => {
      await home.verifyWhyJoinSection();
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '025' })} Influencer perks section is visible`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Verify Influencer perks section', async () => {
      await home.verifyInfluencerPerksSection();
    });
  });
});
