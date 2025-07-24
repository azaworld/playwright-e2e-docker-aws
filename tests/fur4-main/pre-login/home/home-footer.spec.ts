import { test, expect, Page } from '@playwright/test';
import { HomeFooter } from '../../../../page-objects/fur4/prelogin/home/HomeFooter';
import { Type } from '../../../utils/tags';
import { navigateToHomepage } from '../../../utils/helpers';

test.describe('F4 Homepage – Footer Section', () => {
  let homeFooter: HomeFooter;

  test.beforeEach(async ({ page }) => {
    await navigateToHomepage(page);
    homeFooter = new HomeFooter(page);
  });

  test('F4-073: Footer is visible after scrolling to bottom', { tag: [Type.FOOTER, Type.VISUAL, Type.LAYOUT] }, async () => {
    await test.step('Scroll to the bottom of the homepage', async () => {
      await homeFooter.scrollToFooter();
    });
    await test.step('Check that the footer is visible', async () => {
      const isVisible = await homeFooter.isFooterVisible();
      expect(isVisible).toBe(true);
    });
  });

  test('F4-074: FUR4 company description is present in footer', { tag: [Type.FOOTER, Type.CONTENT] }, async () => {
    await test.step('Scroll to the bottom of the homepage', async () => {
      await homeFooter.scrollToFooter();
    });
    await test.step('Check that the FUR4 description is visible and correct', async () => {
      const isVisible = await homeFooter.isDescriptionVisible();
      expect(isVisible).toBe(true);
      const descText = await homeFooter.getDescriptionText();
      expect(descText).toContain('The FUR4 deShedding tool is the Safer, Gentler, and More Effective way to dramatically reduce shedding in dogs and cats. Don\'t let your home turn into a Shed Show!');
    });
  });

  test('F4-075: Social media icons (Facebook, YouTube, Instagram) are visible and correct', { tag: [Type.FOOTER, Type.CONTENT, Type.ICON] }, async () => {
    await test.step('Scroll to the bottom of the homepage', async () => {
      await homeFooter.scrollToFooter();
    });
    await test.step('Check that all social icons are visible', async () => {
      const [fbVisible, ytVisible, igVisible] = await homeFooter.areSocialIconsVisible();
      expect(fbVisible).toBe(true);
      expect(ytVisible).toBe(true);
      expect(igVisible).toBe(true);
    });
    await test.step('Check that all social icons have correct hrefs', async () => {
      const hrefs = await homeFooter.getSocialIconHrefs();
      expect(hrefs).toContain('https://www.facebook.com/FUR4pets/');
      expect(hrefs).toContain('https://www.youtube.com/@FUR4PETS');
      expect(hrefs).toContain('https://www.instagram.com/fur4pets');
    });
  });

  test('F4-076: Contact info (company, address, phone, country) is visible in footer', { tag: [Type.FOOTER, Type.CONTENT] }, async () => {
    await test.step('Scroll to the bottom of the homepage', async () => {
      await homeFooter.scrollToFooter();
    });
    await test.step('Check that all contact info is visible and correct', async () => {
      const contactInfo = await homeFooter.getContactInfoTexts();
      const expectedInfo = [
        'FUR4, LLC',
        '3920 Lindell Blvd',
        'Suite 209 PMB1015',
        'St. Louis, MO 63108',
        '(314) 744-4800',
        'United States',
      ];
      for (const info of expectedInfo) {
        expect(contactInfo).toContain(info);
      }
    });
  });

  test('F4-077: Each QUICK LINK is clickable and navigates to correct page', { tag: [Type.FOOTER, Type.CONTENT, Type.NAVIGATION] }, async () => {
    await test.step('Scroll to the bottom of the homepage', async () => {
      await homeFooter.scrollToFooter();
    });
    await test.step('Check that all QUICK LINKS are present and correct', async () => {
      const links = await homeFooter.getQuickLinksTextsAndHrefs();
      const expected = [
        { text: 'Home', href: '/' },
        { text: 'Products', href: '/products' },
        { text: 'FAQs', href: '/faq' },
        { text: 'Blog', href: '/blog' },
        { text: 'Login', href: '/login' },
        { text: 'Register', href: '/register' },
      ];
      for (const exp of expected) {
        expect(links.some(link => link.text === exp.text && link.href === exp.href)).toBe(true);
      }
    });
  });

  test('F4-078: QUICK LINK "Home" navigates to homepage', { tag: [Type.FOOTER, Type.CONTENT, Type.NAVIGATION] }, async () => {
    await test.step('Scroll to the bottom of the homepage', async () => {
      await homeFooter.scrollToFooter();
    });
    await test.step('Click the Home QUICK LINK', async () => {
      await homeFooter.clickQuickLinkByText('Home');
    });
    await test.step('Assert the homepage logo is visible', async () => {
      const logo = homeFooter.page.locator('img[alt="Fur4 logo"]');
      await expect(logo).toBeVisible();
    });
  });

  test('F4-079: QUICK LINK "Products" navigates to products page', { tag: [Type.FOOTER, Type.CONTENT, Type.NAVIGATION] }, async () => {
    await test.step('Scroll to the bottom of the homepage', async () => {
      await homeFooter.scrollToFooter();
    });
    await test.step('Click the Products QUICK LINK', async () => {
      await homeFooter.clickQuickLinkByText('Products');
    });
    await test.step('Assert the products page H1 is visible', async () => {
      const h1 = homeFooter.page.locator('h1.font-din-condensed', { hasText: 'FUR4 deShedding Tools' });
      await expect(h1).toBeVisible();
    });
  });

  test('F4-080: QUICK LINK "FAQs" navigates to FAQs page', { tag: [Type.FOOTER, Type.CONTENT, Type.NAVIGATION] }, async () => {
    await test.step('Scroll to the bottom of the homepage', async () => {
      await homeFooter.scrollToFooter();
    });
    await test.step('Click the FAQs QUICK LINK', async () => {
      await homeFooter.clickQuickLinkByText('FAQs');
    });
    await test.step('Assert the FAQs page H2 is visible', async () => {
      const h2 = homeFooter.page.locator('h2.font-din-condensed', { hasText: 'Frequently Asked Questions' });
      await expect(h2).toBeVisible();
    });
  });

  test('F4-081: QUICK LINK "Blog" navigates to Blog page', { tag: [Type.FOOTER, Type.CONTENT, Type.NAVIGATION] }, async () => {
    await test.step('Scroll to the bottom of the homepage', async () => {
      await homeFooter.scrollToFooter();
    });
    await test.step('Click the Blog QUICK LINK', async () => {
      await homeFooter.clickQuickLinkByText('Blog');
    });
    await test.step('Assert the Blog page has "View All" link', async () => {
      const viewAll = homeFooter.page.locator('a.text-blue[href="/blog/all"]', { hasText: 'View All' });
      await expect(viewAll).toBeVisible();
    });
  });

  test('F4-082: QUICK LINK "Login" navigates to Login page', { tag: [Type.FOOTER, Type.CONTENT, Type.NAVIGATION] }, async () => {
    await test.step('Scroll to the bottom of the homepage', async () => {
      await homeFooter.scrollToFooter();
    });
    await test.step('Click the Login QUICK LINK', async () => {
      await homeFooter.clickQuickLinkByText('Login');
    });
    await test.step('Assert the Login page H1 is visible', async () => {
      const h1 = homeFooter.page.locator('h1.text-center', { hasText: 'Sign In' });
      await expect(h1).toBeVisible();
    });
  });

  test('F4-083: QUICK LINK "Register" navigates to Register page', { tag: [Type.FOOTER, Type.CONTENT, Type.NAVIGATION] }, async () => {
    await test.step('Scroll to the bottom of the homepage', async () => {
      await homeFooter.scrollToFooter();
    });
    await test.step('Click the Register QUICK LINK', async () => {
      await homeFooter.clickQuickLinkByText('Register');
    });
    await test.step('Assert the Register page H1 is visible', async () => {
      const h1 = homeFooter.page.locator('h1.text-center', { hasText: 'Create Your Account' });
      await expect(h1).toBeVisible();
    });
  });

  test('F4-084: USEFUL LINKS section displays all informational links', { tag: [Type.FOOTER, Type.CONTENT] }, async () => {
    await test.step('Scroll to the bottom of the homepage', async () => {
      await homeFooter.scrollToFooter();
    });
    await test.step('Check that all USEFUL LINKS are present and correct', async () => {
      const links = await homeFooter.getUsefulLinksTextsAndHrefs();
      const expected = [
        { text: 'Dealer Locator', href: '/dealer/locator' },
        { text: 'About Us', href: '/about-us' },
        { text: 'Patents', href: '/patents' },
        { text: 'Contact Us', href: '/contact-us' },
        { text: 'Submit your Pet Product Idea', href: '/innovative-idea' },
        { text: 'Become a Dealer | Login', href: 'https://dealer.fur4.com' },
        { text: 'Become a Referral Partner', href: 'https://refer.fur4.com' },
      ];
      for (const exp of expected) {
        expect(links.some(link => link.text === exp.text && link.href === exp.href)).toBe(true);
      }
    });
  });

  test('F4-085: USEFUL LINK "Dealer Locator" navigates to Dealer Locator page', { tag: [Type.FOOTER, Type.CONTENT, Type.NAVIGATION] }, async () => {
    await test.step('Scroll to the bottom of the homepage', async () => {
      await homeFooter.scrollToFooter();
    });
    await test.step('Click the Dealer Locator USEFUL LINK', async () => {
      const { isExternal, url } = await homeFooter.clickUsefulLinkByText('Dealer Locator');
      expect(isExternal).toBe(false);
      expect(url).toContain('/dealer/locator');
    });
  });

  test('F4-086: USEFUL LINK "About Us" navigates to About Us page', { tag: [Type.FOOTER, Type.CONTENT, Type.NAVIGATION] }, async () => {
    await test.step('Scroll to the bottom of the homepage', async () => {
      await homeFooter.scrollToFooter();
    });
    await test.step('Click the About Us USEFUL LINK', async () => {
      const { isExternal, url } = await homeFooter.clickUsefulLinkByText('About Us');
      expect(isExternal).toBe(false);
      expect(url).toContain('/about-us');
    });
  });

  test('F4-087: USEFUL LINK "Patents" navigates to Patents page', { tag: [Type.FOOTER, Type.CONTENT, Type.NAVIGATION] }, async () => {
    await test.step('Scroll to the bottom of the homepage', async () => {
      await homeFooter.scrollToFooter();
    });
    await test.step('Click the Patents USEFUL LINK', async () => {
      const { isExternal, url } = await homeFooter.clickUsefulLinkByText('Patents');
      expect(isExternal).toBe(false);
      expect(url).toContain('/patents');
    });
  });

  test('F4-088: USEFUL LINK "Contact Us" navigates to Contact Us page', { tag: [Type.FOOTER, Type.CONTENT, Type.NAVIGATION] }, async () => {
    await test.step('Scroll to the bottom of the homepage', async () => {
      await homeFooter.scrollToFooter();
    });
    await test.step('Click the Contact Us USEFUL LINK', async () => {
      const { isExternal, url } = await homeFooter.clickUsefulLinkByText('Contact Us');
      expect(isExternal).toBe(false);
      expect(url).toContain('/contact-us');
    });
  });

  test('F4-089: USEFUL LINK "Submit your Pet Product Idea" navigates to Submit Idea page', { tag: [Type.FOOTER, Type.CONTENT, Type.NAVIGATION] }, async () => {
    await test.step('Scroll to the bottom of the homepage', async () => {
      await homeFooter.scrollToFooter();
    });
    await test.step('Wait for loading overlay to disappear if present', async () => {
      const overlay = homeFooter.page.locator('div[role="status"][aria-label="Loading screen"]');
      if (await overlay.isVisible({ timeout: 2000 }).catch(() => false)) {
        await overlay.waitFor({ state: 'hidden', timeout: 10000 });
      }
    });
    await test.step('Click the Submit your Pet Product Idea USEFUL LINK', async () => {
      const { isExternal, url } = await homeFooter.clickUsefulLinkByText('Submit your Pet Product Idea');
      expect(isExternal).toBe(false);
      expect(url).toContain('/innovative-idea');
    });
    await test.step('Assert the Submit Innovative Ideas heading is visible', async () => {
      const h2 = homeFooter.page.locator('h2.text-primary.text-center.font-din-condensed', { hasText: 'Submit Innovative Ideas' });
      await expect(h2).toBeVisible();
    });
  });

  test('F4-090: USEFUL LINK "Become a Dealer | Login" opens correct external page', { tag: [Type.FOOTER, Type.CONTENT, Type.NAVIGATION] }, async () => {
    await test.step('Scroll to the bottom of the homepage', async () => {
      await homeFooter.scrollToFooter();
    });
    await test.step('Click the Become a Dealer | Login USEFUL LINK', async () => {
      const { isExternal, url } = await homeFooter.clickUsefulLinkByText('Become a Dealer | Login');
      expect(isExternal).toBe(true);
      expect(url).toContain('dealer.fur4.com');
    });
  });

  test('F4-091: USEFUL LINK "Become a Referral Partner" opens correct external page', { tag: [Type.FOOTER, Type.CONTENT, Type.NAVIGATION] }, async () => {
    await test.step('Scroll to the bottom of the homepage', async () => {
      await homeFooter.scrollToFooter();
    });
    await test.step('Click the Become a Referral Partner USEFUL LINK', async () => {
      const { isExternal, url } = await homeFooter.clickUsefulLinkByText('Become a Referral Partner');
      expect(isExternal).toBe(true);
      expect(url).toContain('refer.fur4.com');
    });
  });

  test('F4-092: POLICIES section displays all policy-related links', { tag: [Type.FOOTER, Type.CONTENT] }, async () => {
    await test.step('Scroll to the bottom of the homepage', async () => {
      await homeFooter.scrollToFooter();
    });
    await test.step('Check that all POLICIES links are present and correct', async () => {
      const links = await homeFooter.getPoliciesLinksTextsAndHrefs();
      const expected = [
        { text: 'Privacy Policy', href: '/privacy' },
        { text: 'Terms Of Service', href: '/terms' },
        { text: 'Refund & Return Policy', href: '/refund' },
        { text: 'Referral Policy', href: '/referral' },
        { text: 'Returns and Warranties', href: '/returns' },
        { text: 'EULA', href: '/eula' },
        { text: 'SMS T&C', href: '/sms-t-c' },
        { text: 'Security', href: '/security' },
      ];
      for (const exp of expected) {
        expect(links.some(link => link.text === exp.text && link.href === exp.href)).toBe(true);
      }
    });
  });

  test('F4-093: POLICIES link "Privacy Policy" navigates to Privacy Policy page', { tag: [Type.FOOTER, Type.CONTENT, Type.NAVIGATION] }, async () => {
    await test.step('Scroll to the bottom of the homepage', async () => {
      await homeFooter.scrollToFooter();
    });
    await test.step('Click the Privacy Policy link', async () => {
      const url = await homeFooter.clickPoliciesLinkByText('Privacy Policy');
      expect(url).toContain('/privacy');
    });
  });

  test('F4-094: POLICIES link "Terms Of Service" navigates to Terms Of Service page', { tag: [Type.FOOTER, Type.CONTENT, Type.NAVIGATION] }, async () => {
    await test.step('Scroll to the bottom of the homepage', async () => {
      await homeFooter.scrollToFooter();
    });
    await test.step('Click the Terms Of Service link', async () => {
      const url = await homeFooter.clickPoliciesLinkByText('Terms Of Service');
      expect(url).toContain('/terms');
    });
  });

  test('F4-095: POLICIES link "Refund & Return Policy" navigates to Refund & Return Policy page', { tag: [Type.FOOTER, Type.CONTENT, Type.NAVIGATION] }, async () => {
    await test.step('Scroll to the bottom of the homepage', async () => {
      await homeFooter.scrollToFooter();
    });
    await test.step('Click the Refund & Return Policy link', async () => {
      const url = await homeFooter.clickPoliciesLinkByText('Refund & Return Policy');
      expect(url).toContain('/refund');
    });
  });

  test('F4-096: POLICIES link "Referral Policy" navigates to Referral Policy page', { tag: [Type.FOOTER, Type.CONTENT, Type.NAVIGATION] }, async () => {
    await test.step('Scroll to the bottom of the homepage', async () => {
      await homeFooter.scrollToFooter();
    });
    await test.step('Click the Referral Policy link', async () => {
      const url = await homeFooter.clickPoliciesLinkByText('Referral Policy');
      expect(url).toContain('/referral');
    });
  });

  test('F4-097: POLICIES link "Returns and Warranties" navigates to Returns and Warranties page', { tag: [Type.FOOTER, Type.CONTENT, Type.NAVIGATION] }, async () => {
    await test.step('Scroll to the bottom of the homepage', async () => {
      await homeFooter.scrollToFooter();
    });
    await test.step('Click the Returns and Warranties link', async () => {
      const url = await homeFooter.clickPoliciesLinkByText('Returns and Warranties');
      expect(url).toContain('/returns');
    });
  });

  test('F4-098: POLICIES link "EULA" navigates to EULA page', { tag: [Type.FOOTER, Type.CONTENT, Type.NAVIGATION] }, async () => {
    await test.step('Scroll to the bottom of the homepage', async () => {
      await homeFooter.scrollToFooter();
    });
    await test.step('Click the EULA link', async () => {
      const url = await homeFooter.clickPoliciesLinkByText('EULA');
      expect(url).toContain('/eula');
    });
  });

  test('F4-099: POLICIES link "SMS T&C" navigates to SMS T&C page', { tag: [Type.FOOTER, Type.CONTENT, Type.NAVIGATION] }, async () => {
    await test.step('Scroll to the bottom of the homepage', async () => {
      await homeFooter.scrollToFooter();
    });
    await test.step('Click the SMS T&C link', async () => {
      const url = await homeFooter.clickPoliciesLinkByText('SMS T&C');
      expect(url).toContain('/sms-t-c');
    });
  });

  test('F4-100: POLICIES link "Security" navigates to Security page', { tag: [Type.FOOTER, Type.CONTENT, Type.NAVIGATION] }, async () => {
    await test.step('Scroll to the bottom of the homepage', async () => {
      await homeFooter.scrollToFooter();
    });
    await test.step('Click the Security link', async () => {
      const url = await homeFooter.clickPoliciesLinkByText('Security');
      expect(url).toContain('/security');
    });
  });

  test('F4-101: Copyright notice is present at the very bottom', { tag: [Type.FOOTER, Type.CONTENT] }, async () => {
    await test.step('Scroll to the bottom of the homepage', async () => {
      await homeFooter.scrollToFooter();
    });
    await test.step('Check that the copyright notice is visible and correct', async () => {
      const text = await homeFooter.getCopyrightText();
      expect(text).toMatch(/FUR4, LLC/);
    });
  });
});
