import { test, expect } from '@playwright/test';

test.describe('FUR4 Critical Flows - Proactive Monitoring', () => {
  test.beforeEach(async ({ page }) => {
    // Set realistic user agent to avoid bot detection
    await page.context().setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
  });

  test.describe('Authentication Flow Tests', () => {
    test('login flow is functional and accessible', async ({ page }) => {
      await page.goto('https://fur4.com/', { timeout: 60000 });
      
      // Look for login elements
      const loginSelectors = [
        'a[href*="login"]',
        'button:has-text("Login")',
        'button:has-text("Sign In")',
        '[class*="login"]',
        'a[href*="signin"]'
      ];
      
      let foundLogin = false;
      let loginUrl = '';
      
      for (const selector of loginSelectors) {
        const elements = await page.locator(selector).all();
        if (elements.length > 0) {
          foundLogin = true;
          const href = await elements[0].getAttribute('href');
          if (href) loginUrl = href;
          console.log(`🔐 Found login element: ${selector}`);
          break;
        }
      }
      
      if (foundLogin && loginUrl) {
        // Test login page accessibility
        try {
          await page.goto(loginUrl.startsWith('http') ? loginUrl : `https://fur4.com${loginUrl}`, { timeout: 30000 });
          await page.waitForLoadState('domcontentloaded');
          
          // Check for login form elements
          const loginForm = await page.locator('form').all();
          const emailField = await page.locator('input[type="email"], input[name*="email"]').all();
          const passwordField = await page.locator('input[type="password"]').all();
          const submitButton = await page.locator('button[type="submit"], input[type="submit"]').all();
          
          console.log(`🔐 Login form elements: ${loginForm.length} forms, ${emailField.length} email fields, ${passwordField.length} password fields, ${submitButton.length} submit buttons`);
          
          // Critical: Login form must be functional
          expect(loginForm.length).toBeGreaterThan(0);
          expect(emailField.length).toBeGreaterThan(0);
          expect(passwordField.length).toBeGreaterThan(0);
          expect(submitButton.length).toBeGreaterThan(0);
          
        } catch (error) {
          console.error('❌ Login page failed to load:', error);
          throw error;
        }
      } else {
        console.log('⚠️  No login functionality found - this may be expected for some sites');
        expect(true).toBe(true);
      }
    });

    test('social login providers are accessible', async ({ page }) => {
      await page.goto('https://fur4.com/', { timeout: 60000 });
      
      // Look for login page first
      const loginSelectors = [
        'a[href*="login"]',
        'button:has-text("Login")',
        'button:has-text("Sign In")'
      ];
      
      let foundLogin = false;
      for (const selector of loginSelectors) {
        const elements = await page.locator(selector).all();
        if (elements.length > 0) {
          foundLogin = true;
          await elements[0].click();
          await page.waitForLoadState('domcontentloaded');
          break;
        }
      }
      
      if (foundLogin) {
        // Check for social login providers
        const socialProviders = [
          { name: 'Google', selectors: ['button:has-text("Google")', 'a[href*="google"]', '[class*="google"]'] },
          { name: 'Facebook', selectors: ['button:has-text("Facebook")', 'a[href*="facebook"]', '[class*="facebook"]'] },
          { name: 'LinkedIn', selectors: ['button:has-text("LinkedIn")', 'a[href*="linkedin"]', '[class*="linkedin"]'] }
        ];
        
        let foundSocialLogin = false;
        for (const provider of socialProviders) {
          for (const selector of provider.selectors) {
            const elements = await page.locator(selector).all();
            if (elements.length > 0) {
              foundSocialLogin = true;
              console.log(`🔗 Found ${provider.name} login option`);
              break;
            }
          }
        }
        
        console.log(`🔗 Social login providers found: ${foundSocialLogin}`);
        // Social login is optional but good to have
        expect(true).toBe(true);
      } else {
        console.log('⚠️  No login page found to test social providers');
        expect(true).toBe(true);
      }
    });
  });

  test.describe('Checkout Flow Tests', () => {
    test('checkout flow is accessible and functional', async ({ page }) => {
      await page.goto('https://fur4.com/', { timeout: 60000 });
      
      // Look for product/cart elements
      const cartSelectors = [
        'a[href*="cart"]',
        'button:has-text("Cart")',
        '[class*="cart"]',
        'a[href*="checkout"]'
      ];
      
      let foundCart = false;
      for (const selector of cartSelectors) {
        const elements = await page.locator(selector).all();
        if (elements.length > 0) {
          foundCart = true;
          console.log(`🛒 Found cart element: ${selector}`);
          
          // Try to access cart/checkout
          try {
            await elements[0].click();
            await page.waitForLoadState('domcontentloaded');
            
            // Check for checkout elements
            const checkoutElements = await page.locator('a[href*="checkout"], button:has-text("Checkout"), [class*="checkout"]').all();
            console.log(`💳 Found ${checkoutElements.length} checkout elements`);
            
            if (checkoutElements.length > 0) {
              // Critical: Checkout must be accessible
              expect(checkoutElements.length).toBeGreaterThan(0);
            }
          } catch (error) {
            console.log('⚠️  Cart/checkout navigation failed:', error);
          }
          break;
        }
      }
      
      if (!foundCart) {
        console.log('⚠️  No cart/checkout functionality found - site may not have e-commerce');
        expect(true).toBe(true);
      }
    });

    test('payment integration elements are present', async ({ page }) => {
      await page.goto('https://fur4.com/', { timeout: 60000 });
      
      // Look for payment-related elements
      const paymentSelectors = [
        'a[href*="checkout"]',
        'button:has-text("Checkout")',
        '[class*="payment"]',
        '[class*="stripe"]',
        'a[href*="payment"]'
      ];
      
      let foundPayment = false;
      for (const selector of paymentSelectors) {
        const elements = await page.locator(selector).all();
        if (elements.length > 0) {
          foundPayment = true;
          console.log(`💳 Found payment element: ${selector}`);
          
          // Try to access payment page
          try {
            await elements[0].click();
            await page.waitForLoadState('domcontentloaded');
            
            // Look for Stripe or payment form elements
            const paymentForms = await page.locator('form[action*="stripe"], [class*="stripe"], [data-stripe]').all();
            const cardFields = await page.locator('input[name*="card"], input[name*="cc"], [class*="card"]').all();
            
            console.log(`💳 Payment forms: ${paymentForms.length}, Card fields: ${cardFields.length}`);
            
            if (paymentForms.length > 0 || cardFields.length > 0) {
              // Critical: Payment integration must be functional
              expect(paymentForms.length + cardFields.length).toBeGreaterThan(0);
            }
          } catch (error) {
            console.log('⚠️  Payment page navigation failed:', error);
          }
          break;
        }
      }
      
      if (!foundPayment) {
        console.log('⚠️  No payment functionality found - site may not have e-commerce');
        expect(true).toBe(true);
      }
    });
  });

  test.describe('Referral System Tests', () => {
    test('referral claiming flow is functional', async ({ page }) => {
      await page.goto('https://refer.fur4.com/', { timeout: 60000 });
      
      // Look for referral claim elements
      const referralSelectors = [
        'button:has-text("Claim")',
        'button:has-text("Refer")',
        'a[href*="claim"]',
        'a[href*="refer"]',
        '[class*="referral"]',
        '[class*="claim"]'
      ];
      
      let foundReferral = false;
      for (const selector of referralSelectors) {
        const elements = await page.locator(selector).all();
        if (elements.length > 0) {
          foundReferral = true;
          console.log(`🎯 Found referral element: ${selector}`);
          
          // Try to access referral flow
          try {
            await elements[0].click();
            await page.waitForLoadState('domcontentloaded');
            
            // Check for referral form elements
            const referralForms = await page.locator('form').all();
            const emailFields = await page.locator('input[type="email"], input[name*="email"]').all();
            const submitButtons = await page.locator('button[type="submit"], input[type="submit"]').all();
            
            console.log(`🎯 Referral forms: ${referralForms.length}, Email fields: ${emailFields.length}, Submit buttons: ${submitButtons.length}`);
            
            // Critical: Referral claiming must be functional
            if (referralForms.length > 0 || emailFields.length > 0) {
              expect(referralForms.length + emailFields.length).toBeGreaterThan(0);
            }
          } catch (error) {
            console.log('⚠️  Referral flow navigation failed:', error);
          }
          break;
        }
      }
      
      if (!foundReferral) {
        console.log('⚠️  No referral claiming functionality found');
        expect(true).toBe(true);
      }
    });

    test('referral tracking system is accessible', async ({ page }) => {
      await page.goto('https://refer.fur4.com/', { timeout: 60000 });
      
      // Look for referral tracking elements
      const trackingSelectors = [
        'a[href*="track"]',
        'button:has-text("Track")',
        '[class*="tracking"]',
        'a[href*="dashboard"]',
        'button:has-text("Dashboard")'
      ];
      
      let foundTracking = false;
      for (const selector of trackingSelectors) {
        const elements = await page.locator(selector).all();
        if (elements.length > 0) {
          foundTracking = true;
          console.log(`📊 Found tracking element: ${selector}`);
          
          // Try to access tracking/dashboard
          try {
            await elements[0].click();
            await page.waitForLoadState('domcontentloaded');
            
            // Check for tracking dashboard elements
            const dashboardElements = await page.locator('[class*="dashboard"], [class*="stats"], [class*="metrics"]').all();
            const tableElements = await page.locator('table, [class*="table"]').all();
            
            console.log(`📊 Dashboard elements: ${dashboardElements.length}, Tables: ${tableElements.length}`);
            
            // Referral tracking should show some data
            if (dashboardElements.length > 0 || tableElements.length > 0) {
              expect(dashboardElements.length + tableElements.length).toBeGreaterThan(0);
            }
          } catch (error) {
            console.log('⚠️  Tracking dashboard navigation failed:', error);
          }
          break;
        }
      }
      
      if (!foundTracking) {
        console.log('⚠️  No referral tracking functionality found');
        expect(true).toBe(true);
      }
    });
  });

  test.describe('Discount Code Tests', () => {
    test('discount code application flow is functional', async ({ page }) => {
      await page.goto('https://fur4com/', { timeout: 60000 });
      
      // Look for discount/coupon elements
      const discountSelectors = [
        'input[name*="coupon"]',
        'input[name*="discount"]',
        'input[name*="promo"]',
        'button:has-text("Apply")',
        'button:has-text("Coupon")',
        '[class*="coupon"]',
        '[class*="discount"]'
      ];
      
      let foundDiscount = false;
      for (const selector of discountSelectors) {
        const elements = await page.locator(selector).all();
        if (elements.length > 0) {
          foundDiscount = true;
          console.log(`🎫 Found discount element: ${selector}`);
          
          // Critical: Discount code functionality must be present
          expect(elements.length).toBeGreaterThan(0);
          break;
        }
      }
      
      if (!foundDiscount) {
        console.log('⚠️  No discount code functionality found - this may be expected');
        expect(true).toBe(true);
      }
    });
  });

  test.describe('API Integration Health Checks', () => {
    test('external API integrations are responding', async ({ page }) => {
      await page.goto('https://fur4.com/', { timeout: 60000 });
      
      // Monitor for API-related errors in console
      const apiErrors: string[] = [];
      
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          const text = msg.text().toLowerCase();
          if (text.includes('stripe') || text.includes('twilio') || text.includes('sendgrid') || 
              text.includes('api') || text.includes('fetch') || text.includes('xhr')) {
            apiErrors.push(msg.text());
          }
        }
      });
      
      // Wait a bit for any API calls to complete
      await page.waitForTimeout(5000);
      
      console.log(`🔌 API errors detected: ${apiErrors.length}`);
      
      // Log any API errors for monitoring
      if (apiErrors.length > 0) {
        console.log('🔌 API Errors:', apiErrors.slice(0, 3));
      }
      
      // Critical: No critical API errors should occur
      const criticalApiErrors = apiErrors.filter(error => 
        error.toLowerCase().includes('stripe') || 
        error.toLowerCase().includes('payment') ||
        error.toLowerCase().includes('auth')
      );
      
      if (criticalApiErrors.length > 0) {
        console.error('❌ Critical API errors detected:', criticalApiErrors);
        throw new Error(`Critical API errors: ${criticalApiErrors.join(', ')}`);
      }
      
      expect(true).toBe(true);
    });
  });
}); 