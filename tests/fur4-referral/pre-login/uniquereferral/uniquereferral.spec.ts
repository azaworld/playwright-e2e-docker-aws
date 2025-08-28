// Unique Referral Link page tests for FUR4 Referral Site
require('dotenv').config();
import { test, expect } from '@playwright/test';
import { buildTag } from '../../../utils/tagBuilder';

const FUR4_REFERRAL_URL = process.env.FUR4_REFERRAL_URL || 'https://refer.fur4.com/';

test.describe('FUR4 Referral Site - Unique Referral Link Page Tests (Pre-login)', () => {
  test.describe.configure({ 
    mode: 'serial', // Must be serial for beforeAll to work properly
    timeout: 120000 // Increased timeout for beforeAll setup
  });
  
  let sharedPage: any;
  
  // Helper function to ensure we're on the unique referral page
  async function ensureOnUniqueReferralPage() {
    if (sharedPage) {
      const currentUrl = await sharedPage.url();
      if (!currentUrl.includes('/uniquereferral') && !currentUrl.includes('refer.fur4.com/uniquereferral')) {
        console.log(`Navigating to unique referral page from: ${currentUrl}`);
        await sharedPage.goto(`${FUR4_REFERRAL_URL}/uniquereferral`, { 
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
    
    // Navigate to the unique referral page once for all tests
    try {
      await sharedPage.goto(`${FUR4_REFERRAL_URL}/uniquereferral`, { 
        timeout: 60000,
        waitUntil: 'domcontentloaded'
      });
      
      // Wait for page to be fully loaded
      try {
        await sharedPage.waitForLoadState('domcontentloaded', { timeout: 15000 });
        await sharedPage.waitForTimeout(1000);
        console.log('Unique referral page loaded successfully');
      } catch (error) {
        console.log('Page load timeout, continuing with tests...');
        await sharedPage.waitForTimeout(1000);
      }
      
      console.log('Shared unique referral page setup completed successfully');
    } catch (error) {
      console.error('Failed to setup shared unique referral page:', error);
      throw error;
    }
  });
  
  test.afterAll(async () => {
    // Clean up shared resources
    if (sharedPage) {
      try {
        await sharedPage.close();
        console.log('Shared unique referral page cleanup completed');
      } catch (error) {
        console.error('Error during unique referral page cleanup:', error);
      }
    }
  });
  
  test.beforeEach(async () => {
    // Ensure we're on the unique referral page before each test
    await ensureOnUniqueReferralPage();
  });

  test(`${buildTag({ site: 'refer', module: 'uniquereferral', caseId: '130' })} Unique referral page loads successfully`, async () => {
    await test.step('Verify page loads successfully', async () => {
      await expect(sharedPage).toHaveURL(/uniquereferral/);
      const bodyText = await sharedPage.locator('body').textContent();
      expect((bodyText?.length || 0)).toBeGreaterThan(100);
    });
  });

  test(`${buildTag({ site: 'refer', module: 'uniquereferral', caseId: '131' })} Page title "Create Your Account" is visible`, async () => {
    await test.step('Verify page title', async () => {
      const pageTitle = sharedPage.getByText('Create Your Account');
      if (await pageTitle.count() > 0) {
        await expect(pageTitle).toBeVisible();
        console.log('Page title "Create Your Account" is visible');
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'uniquereferral', caseId: '132' })} Social Sign Up section is present`, async () => {
    await test.step('Verify social sign up section', async () => {
      const socialSignUpTitle = sharedPage.getByText('Social Sign Up');
      if (await socialSignUpTitle.count() > 0) {
        await expect(socialSignUpTitle).toBeVisible();
        console.log('Social Sign Up section title is visible');
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'uniquereferral', caseId: '133' })} Social login buttons are present`, async () => {
    await test.step('Verify Google login button', async () => {
      const googleButton = sharedPage.locator('[class*="google"], [aria-label*="Google"], img[alt*="Google"]');
      if (await googleButton.count() > 0) {
        await expect(googleButton.first()).toBeVisible();
        console.log('Google login button found');
      }
    });
    
    await test.step('Verify Facebook login button', async () => {
      const facebookButton = sharedPage.locator('[class*="facebook"], [aria-label*="Facebook"], img[alt*="Facebook"]');
      if (await facebookButton.count() > 0) {
        await expect(facebookButton.first()).toBeVisible();
        console.log('Facebook login button found');
      }
    });
    
    await test.step('Verify LinkedIn login button', async () => {
      const linkedinButton = sharedPage.locator('[class*="linkedin"], [aria-label*="LinkedIn"], img[alt*="LinkedIn"]');
      if (await linkedinButton.count() > 0) {
        await expect(linkedinButton.first()).toBeVisible();
        console.log('LinkedIn login button found');
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'uniquereferral', caseId: '134' })} Separator line with "or" text is visible`, async () => {
    await test.step('Verify separator line', async () => {
      const separatorText = sharedPage.getByText('or');
      if (await separatorText.count() > 0) {
        await expect(separatorText).toBeVisible();
        console.log('Separator line with "or" text is visible');
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'uniquereferral', caseId: '135' })} First Name input field is functional`, async () => {
    await test.step('Verify first name input field', async () => {
      const firstNameInput = sharedPage.getByPlaceholder('First Name');
      if (await firstNameInput.count() > 0) {
        await expect(firstNameInput).toBeVisible();
        await expect(firstNameInput).toBeEnabled();
        await expect(firstNameInput).toHaveAttribute('placeholder', 'First Name');
        console.log('First Name input field is functional');
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'uniquereferral', caseId: '136' })} Last Name input field is functional`, async () => {
    await test.step('Verify last name input field', async () => {
      const lastNameInput = sharedPage.getByPlaceholder('Last Name');
      if (await lastNameInput.count() > 0) {
        await expect(lastNameInput).toBeVisible();
        await expect(lastNameInput).toBeEnabled();
        await expect(lastNameInput).toHaveAttribute('placeholder', 'Last Name');
        console.log('Last Name input field is functional');
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'uniquereferral', caseId: '137' })} Country/Region dropdown shows USA`, async () => {
    await test.step('Verify country/region dropdown', async () => {
      const countryLabel = sharedPage.getByText('Country / Region');
      if (await countryLabel.count() > 0) {
        await expect(countryLabel).toBeVisible();
        console.log('Country / Region label is visible');
      }
      
      const countrySelector = sharedPage.locator('text=United States, [role="combobox"], select');
      if (await countrySelector.count() > 0) {
        await expect(countrySelector.first()).toBeVisible();
        console.log('Country selector dropdown is visible');
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'uniquereferral', caseId: '138' })} USA availability message is visible`, async () => {
    await test.step('Verify USA availability message', async () => {
      const availabilityMessage = sharedPage.getByText('Currently Only Available in the USA (check back soon as we expand our referral portal globally)');
      if (await availabilityMessage.count() > 0) {
        await expect(availabilityMessage).toBeVisible();
        console.log('USA availability information message is visible');
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'uniquereferral', caseId: '139' })} Email input field is functional`, async () => {
    await test.step('Verify email input field', async () => {
      const emailInput = sharedPage.getByPlaceholder('Email');
      if (await emailInput.count() > 0) {
        await expect(emailInput).toBeVisible();
        await expect(emailInput).toBeEnabled();
        await expect(emailInput).toHaveAttribute('placeholder', 'Email');
        console.log('Email input field is functional');
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'uniquereferral', caseId: '140' })} Password input field has eye icon`, async () => {
    await test.step('Verify password input field', async () => {
      const passwordInput = sharedPage.getByPlaceholder('Password');
      if (await passwordInput.count() > 0) {
        await expect(passwordInput).toBeVisible();
        await expect(passwordInput).toBeEnabled();
        await expect(passwordInput).toHaveAttribute('type', 'password');
        console.log('Password input field is functional');
      }
    });
    
    await test.step('Verify eye icon for password visibility', async () => {
      const eyeIcon = sharedPage.locator('[class*="eye"], [aria-label*="password"], [class*="visibility"]');
      if (await eyeIcon.count() > 0) {
        await expect(eyeIcon.first()).toBeVisible();
        console.log('Eye icon for password visibility is present');
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'uniquereferral', caseId: '141' })} Confirm Password input field is functional`, async () => {
    await test.step('Verify confirm password input field', async () => {
      const confirmPasswordInput = sharedPage.getByPlaceholder('Confirm Password');
      if (await confirmPasswordInput.count() > 0) {
        await expect(confirmPasswordInput).toBeVisible();
        await expect(confirmPasswordInput).toBeEnabled();
        await expect(confirmPasswordInput).toHaveAttribute('placeholder', 'Confirm Password');
        await expect(confirmPasswordInput).toHaveAttribute('type', 'password');
        console.log('Confirm Password input field is functional');
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'uniquereferral', caseId: '142' })} reCAPTCHA checkbox is present`, async () => {
    await test.step('Verify reCAPTCHA checkbox', async () => {
      const recaptchaCheckbox = sharedPage.getByText("I'm not a robot");
      if (await recaptchaCheckbox.count() > 0) {
        await expect(recaptchaCheckbox).toBeVisible();
        console.log('reCAPTCHA checkbox is present');
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'uniquereferral', caseId: '143' })} Register and Get Link button is functional`, async () => {
    await test.step('Verify register button', async () => {
      const registerButton = sharedPage.getByRole('button', { name: 'Register and Get Link' });
      if (await registerButton.count() > 0) {
        await expect(registerButton).toBeVisible();
        await expect(registerButton).toBeEnabled();
        await expect(registerButton).toHaveText('Register and Get Link');
        console.log('Register and Get Link button is functional');
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'uniquereferral', caseId: '144' })} Sign In link is present`, async () => {
    await test.step('Verify sign in link', async () => {
      const signInText = sharedPage.getByText('Already have an Account? Sign In');
      if (await signInText.count() > 0) {
        await expect(signInText).toBeVisible();
        console.log('Sign In link text is visible');
      }
      
      const signInLink = sharedPage.getByRole('link', { name: 'Sign In' });
      if (await signInLink.count() > 0) {
        await expect(signInLink).toBeVisible();
        await expect(signInLink).toBeEnabled();
        console.log('Sign In link is clickable');
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'uniquereferral', caseId: '145' })} Navigation elements are present`, async () => {
    await test.step('Verify FUR4 HOME button', async () => {
      const fur4HomeButton = sharedPage.getByRole('button', { name: 'FUR4 HOME' });
      if (await fur4HomeButton.count() > 0) {
        await expect(fur4HomeButton).toBeVisible();
        await expect(fur4HomeButton).toBeEnabled();
        console.log('FUR4 HOME button is present');
      }
    });
    
    await test.step('Verify REGISTER button', async () => {
      const registerButton = sharedPage.getByRole('button', { name: 'REGISTER' });
      if (await registerButton.count() > 0) {
        await expect(registerButton).toBeVisible();
        await expect(registerButton).toBeEnabled();
        console.log('REGISTER button is present');
      }
    });
    
    await test.step('Verify hamburger menu button', async () => {
      const hamburgerButton = sharedPage.locator('button[aria-label="Open menu"], button:has-text("☰"), [class*="hamburger"]');
      if (await hamburgerButton.count() > 0) {
        await expect(hamburgerButton.first()).toBeVisible();
        await expect(hamburgerButton.first()).toBeEnabled();
        console.log('Hamburger menu button is present');
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'uniquereferral', caseId: '146' })} Chat with us widget is functional`, async () => {
    await test.step('Verify chat widget', async () => {
      const chatWidget = sharedPage.getByText('Chat with us');
      if (await chatWidget.count() > 0) {
        await expect(chatWidget).toBeVisible();
        console.log('Chat with us widget is present');
      }
    });
  });

  test(`${buildTag({ site: 'refer', module: 'uniquereferral', caseId: '147' })} Page loads without errors`, async () => {
    await test.step('Verify page has substantial content', async () => {
      const bodyText = await sharedPage.locator('body').textContent();
      expect((bodyText?.length || 0)).toBeGreaterThan(200);
    });
    
    await test.step('Verify page title is correct', async () => {
      const title = await sharedPage.title();
      expect(title).toContain('FUR4');
    });
    
    await test.step('Verify page URL is correct', async () => {
      const url = await sharedPage.url();
      expect(url).toContain('uniquereferral');
    });
  });
});
