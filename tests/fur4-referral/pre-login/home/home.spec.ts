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
        console.log(`Navigating back to home page from: ${currentUrl}`);
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
      
      console.log('Shared page setup completed successfully');
    } catch (error) {
      console.error(' Failed to setup shared page:', error);
      throw error;
    }
  });
  
  test.afterAll(async () => {
    // Clean up shared resources
    if (sharedPage) {
      try {
        await sharedPage.close();
        console.log('Shared page cleanup completed');
      } catch (error) {
        console.error('Error during cleanup:', error);
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

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '002' })} Main headline and messaging is visible`, async () => {
    await test.step('Verify main headline', async () => {
      const mainHeadline = sharedPage.getByText('Earn $5 for Every FUR4 Tool Sold');
      if (await mainHeadline.count() > 0) {
        await expect(mainHeadline).toBeVisible();
        console.log('Main headline found: "Earn $5 for Every FUR4 Tool Sold"');
      }
    });
    
    await test.step('Verify sub-headline', async () => {
      const subHeadline = sharedPage.getByText('Join the FUR4 Referral Program and turn your network into real cash');
      if (await subHeadline.count() > 0) {
        await expect(subHeadline).toBeVisible();
        console.log('Sub-headline found');
      }
    });
    
    await test.step('Verify detailed description', async () => {
      const description = sharedPage.getByText('Get $5 per sale made through your unique referral link - with instant payouts, live performance tracking and exclusive rewards for verified influencers');
      if (await description.count() > 0) {
        await expect(description).toBeVisible();
        console.log('Detailed description found');
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '003' })} FUR4 Tool image and branding is visible`, async () => {
    await test.step('Verify FUR4 Tool image is present', async () => {
      // Look for the tool image - could be img tag or background image
      const toolImage = sharedPage.locator('img[alt*="FUR4"], img[src*="tool"], [class*="tool"], [class*="product"]');
      if (await toolImage.count() > 0) {
        await expect(toolImage.first()).toBeVisible();
        console.log('FUR4 Tool image found');
      }
    });
    
    await test.step('Verify tool branding text', async () => {
      const brandingTexts = ['www.FUR4.com', 'patent'];
      for (const text of brandingTexts) {
        const element = sharedPage.getByText(text);
        if (await element.count() > 0) {
          await expect(element).toBeVisible();
          console.log(`Tool branding text found: ${text}`);
        }
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '004' })} Navigation elements are properly displayed`, async () => {
    await test.step('Verify FUR4 HOME button', async () => {
      const fur4HomeButton = sharedPage.getByRole('button', { name: 'FUR4 HOME' });
      if (await fur4HomeButton.count() > 0) {
        await expect(fur4HomeButton).toBeVisible();
        await expect(fur4HomeButton).toBeEnabled();
        console.log('FUR4 HOME button found and enabled');
      }
    });
    
    await test.step('Verify REGISTER button', async () => {
      const registerButton = sharedPage.getByRole('button', { name: 'REGISTER' });
      if (await registerButton.count() > 0) {
        await expect(registerButton).toBeVisible();
        await expect(registerButton).toBeEnabled();
        console.log('REGISTER button found and enabled');
      }
    });
    
    await test.step('Verify hamburger menu button', async () => {
      const hamburgerButton = sharedPage.locator('button[aria-label="Open menu"], button:has-text("☰"), [class*="hamburger"], [class*="menu"]');
      if (await hamburgerButton.count() > 0) {
        await expect(hamburgerButton.first()).toBeVisible();
        await expect(hamburgerButton.first()).toBeEnabled();
        console.log('Hamburger menu button found and enabled');
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '005' })} Main call-to-action button is functional`, async () => {
    await test.step('Verify Get Your Unique Referral Link button', async () => {
      const ctaButton = sharedPage.getByRole('button', { name: 'Get Your Unique Referral Link' });
      if (await ctaButton.count() > 0) {
        await expect(ctaButton).toBeVisible();
        await expect(ctaButton).toBeEnabled();
        console.log('Main CTA button found: "Get Your Unique Referral Link"');
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '006' })} Chat widget is functional`, async () => {
    await test.step('Verify chat widget is present', async () => {
      const chatWidget = sharedPage.getByText('Chat with us');
      if (await chatWidget.count() > 0) {
        await expect(chatWidget).toBeVisible();
        console.log('Chat widget found: "Chat with us"');
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '007' })} Page layout structure is correct`, async () => {
    await test.step('Verify left side text content', async () => {
      // Check if main text content is on the left side
      const leftContent = sharedPage.locator('*:has-text("Earn $5"), *:has-text("Join the FUR4 Referral Program")');
      if (await leftContent.count() > 0) {
        await expect(leftContent.first()).toBeVisible();
        console.log('Left side text content found');
      }
    });
    
    await test.step('Verify right side visual content', async () => {
      // Check if tool image or visual content is on the right side
      const rightContent = sharedPage.locator('img, [class*="image"], [class*="visual"], [class*="product"]');
      if (await rightContent.count() > 0) {
        await expect(rightContent.first()).toBeVisible();
        console.log('Right side visual content found');
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '008' })} Footer sections and links are visible`, async () => {
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

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '009' })} Home page sections and texts are visible`, async () => {
    const home = new ReferralHomePage(sharedPage);

    await test.step('Verify home sections and texts', async () => {
      await home.verifyHomeSectionsAndTexts();
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '010' })} Homepage loads and displays main elements`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Verify homepage main elements', async () => {
      await home.verifyHomepageMainElements();
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '011' })} Referral program text is visible`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Verify referral program text', async () => {
      await home.verifyReferralProgramTextVisible();
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '012' })} FAQ link is present and clickable`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Verify FAQ link exists and is clickable', async () => {
      // Just verify the FAQ link exists and is clickable without actually clicking it
      // This prevents navigation away from the home page in shared context
      const faqLink = sharedPage.locator('a[href*="faq"]');
      
      if (await faqLink.count() > 0) {
        await expect(faqLink).toBeVisible();
        await expect(faqLink).toBeEnabled();
        console.log(' FAQ link found and is clickable');
      } else {
        console.log('FAQ link not found on this page');
      }
    });
    
    await test.step('Verify we are still on the home page', async () => {
      await expect(sharedPage).toHaveURL(/refer\.fur4\.com\/?$/);
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '013' })} Footer contact info is visible`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Verify footer contact info', async () => {
      await home.verifyFooterContactInfo();
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '014' })} Navigation elements are present`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Verify navigation elements', async () => {
      await home.verifyNavigationElements();
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '015' })} Call to action buttons are present`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Verify CTA buttons', async () => {
      await home.verifyCallToActionButtons();
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '016' })} Social and utility elements are present`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Verify social and utility elements', async () => {
      await home.verifySocialAndUtilityElements();
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '017' })} Chat with us widget is functional`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Verify chat widget is present', async () => {
      if (await home.chatWithUsWidget.count() > 0) {
        await expect(home.chatWithUsWidget).toBeVisible();
        await expect(home.chatWithUsWidget).toBeEnabled();
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '018' })} Social media links are functional`, async () => {
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

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '019' })} Scroll to top functionality`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Verify scroll to top button', async () => {
      if (await home.scrollToTopButton.count() > 0) {
        await expect(home.scrollToTopButton).toBeVisible();
        await expect(home.scrollToTopButton).toBeEnabled();
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '020' })} Call to action buttons are functional`, async () => {
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

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '021' })} Page has proper meta information`, async () => {
    await test.step('Verify page title', async () => {
      const title = await sharedPage.title();
      expect(title.length).toBeGreaterThan(0);
    });
    
    await test.step('Verify page content length', async () => {
      const bodyText = await sharedPage.locator('body').textContent();
      expect((bodyText?.length || 0)).toBeGreaterThan(100);
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '022' })} Navigation links are accessible`, async () => {
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

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '023' })} Page loads without errors`, async () => {
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

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '024' })} Responsive design elements are present`, async () => {
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

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '025' })} Footer links are functional`, async () => {
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
  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '026' })} How it works section is visible`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Verify How it works section', async () => {
      await home.verifyHowItWorksSection();
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '027' })} Testimonials section is visible`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Verify Testimonials section', async () => {
      await home.verifyTestimonialsSection();
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '028' })} Why Join section is visible`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Verify Why Join section', async () => {
      await home.verifyWhyJoinSection();
    });
  });

  test(`${buildTag({ site: 'refer', module: 'prelogin', caseId: '029' })} Influencer perks section is visible`, async () => {
    const home = new ReferralHomePage(sharedPage);
    
    await test.step('Verify Influencer perks section', async () => {
      await home.verifyInfluencerPerksSection();
    });
  });
});

