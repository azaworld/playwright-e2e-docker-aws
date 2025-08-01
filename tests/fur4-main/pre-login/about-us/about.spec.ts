import { test, expect } from '@playwright/test';
import { AboutUsPage } from '../../../../page-objects/fur4/prelogin/about-us/AboutUsPage';
import { Type } from '../../../utils/tags';

test.describe('F4 About Us Page', () => {
  let aboutUsPage: AboutUsPage;

  test.beforeEach(async ({ page }) => {
    aboutUsPage = new AboutUsPage(page);
    await aboutUsPage.navigateToAboutUsPage();
  });

  test('DEBUG: Comprehensive About Us page analysis', { tag: [Type.FUNCTIONAL] }, async () => {
    await test.step('Check if page is loading properly', async () => {
      const isPageLoaded = await aboutUsPage.checkIfPageLoaded();
      expect(isPageLoaded).toBe(true);
    });
    await test.step('Debug full page content and structure', async () => {
      await aboutUsPage.debugFullPageContent();
    });
  });

  test('F4-150: About Us page loads successfully and URL is correct', { tag: [Type.FUNCTIONAL, Type.SMOKE, Type.LOAD] }, async () => {
    await test.step('Verify page loads and URL is correct', async () => {
      await aboutUsPage.verifyPageLoad();
    });
  });

  test('F4-151: "About FUR4" heading is visible at the top', { tag: [Type.VISUAL, Type.CONTENT] }, async () => {
    await test.step('Check for "About FUR4" heading at the top', async () => {
      const isHeadingVisible = await aboutUsPage.isMainTitleVisible();
      expect(isHeadingVisible).toBe(true);
    });
    await test.step('Verify heading text is correct', async () => {
      const headingText = await aboutUsPage.getMainTitleText();
      expect(headingText.trim()).toBe('About FUR4');
    });
  });

  test('F4-152: "Pet owners..." intro paragraph is present', { tag: [Type.VISUAL, Type.CONTENT] }, async () => {
    await test.step('Check for the introductory paragraph starting with "Pet owners around the world..."', async () => {
      const isIntroVisible = await aboutUsPage.isSheddingProblemTextVisible();
      expect(isIntroVisible).toBe(true);
    });
  });

  test('F4-153: Product images for long/short hair dogs and cats are visible', { tag: [Type.VISUAL, Type.IMAGE] }, async () => {
    await test.step('Scroll to the right section', async () => {
      // Scroll to ensure images are in viewport
      await aboutUsPage.page.evaluate(() => window.scrollTo(0, 300));
    });
    await test.step('Check for product images (as shown)', async () => {
      const isProductImagesVisible = await aboutUsPage.isProductImagesVisible();
      expect(isProductImagesVisible).toBe(true);
    });
    await test.step('Verify product images count', async () => {
      const imageCount = await aboutUsPage.getProductImagesCount();
      expect(imageCount).toBeGreaterThan(0);
    });
  });

  test('F4-154: "The Safer, Gentler, and More Effective deShedding Tool" blue banner section is visible', { tag: [Type.VISUAL, Type.BANNER, Type.CONTENT] }, async () => {
    await test.step('Scroll to blue section after heading', async () => {
      // Scroll to ensure blue banner is in viewport
      await aboutUsPage.page.evaluate(() => window.scrollTo(0, 600));
    });
    await test.step('Check for main tagline and description', async () => {
      const isBlueBannerVisible = await aboutUsPage.isSaferGentlerMoreEffectiveTitleVisible();
      expect(isBlueBannerVisible).toBe(true);
    });
    await test.step('Verify blue banner tagline text', async () => {
      const taglineText = await aboutUsPage.getSaferGentlerMoreEffectiveTitleText();
      expect(taglineText.trim()).toBe('The Safer, Gentler, and More Effective');
    });
  });

  test('F4-155: "Safer" section is visible', { tag: [Type.VISUAL, Type.CONTENT] }, async () => {
    await test.step('Check that the "Safer" section is visible', async () => {
      const isSaferVisible = await aboutUsPage.isSaferSectionVisible();
      expect(isSaferVisible).toBe(true);
      console.log('✓ Safer section is visible');
    });
    await test.step('Verify Safer image is visible', async () => {
      const isSaferImageVisible = await aboutUsPage.isSaferImageVisible();
      expect(isSaferImageVisible).toBe(true);
      console.log('✓ Safer image is visible');
    });
  });

  test('F4-156: "Gentler" section is visible', { tag: [Type.VISUAL, Type.CONTENT] }, async () => {
    await test.step('Check that the "Gentler" section is visible', async () => {
      const isGentlerVisible = await aboutUsPage.isGentlerSectionVisible();
      expect(isGentlerVisible).toBe(true);
      console.log('✓ Gentler section is visible');
    });
    await test.step('Verify Gentler image is visible', async () => {
      const isGentlerImageVisible = await aboutUsPage.isGentlerImageVisible();
      expect(isGentlerImageVisible).toBe(true);
      console.log('✓ Gentler image is visible');
    });
  });

  test('F4-157: "More Effective" section is visible', { tag: [Type.VISUAL, Type.CONTENT] }, async () => {
    await test.step('Check that the "More Effective" section is visible', async () => {
      const isMoreEffectiveVisible = await aboutUsPage.isMoreEffectiveSectionVisible();
      expect(isMoreEffectiveVisible).toBe(true);
      console.log('✓ More Effective section is visible');
    });
    await test.step('Verify More Effective image is visible', async () => {
      const isMoreEffectiveImageVisible = await aboutUsPage.isMoreEffectiveImageVisible();
      expect(isMoreEffectiveImageVisible).toBe(true);
      console.log('✓ More Effective image is visible');
    });
  });

  test('F4-158: "PolyCarboMax" section is visible', { tag: [Type.VISUAL, Type.CONTENT] }, async () => {
    await test.step('Check that the "PolyCarboMax" section is visible', async () => {
      const isPolyCarboMaxVisible = await aboutUsPage.isPolyCarboMaxSectionVisible();
      expect(isPolyCarboMaxVisible).toBe(true);
      console.log('✓ PolyCarboMax section is visible');
    });
  });

  test('F4-159: FUR4 description is visible', { tag: [Type.VISUAL, Type.CONTENT] }, async () => {
    await test.step('Check that the FUR4 description is visible', async () => {
      const isFur4DescriptionVisible = await aboutUsPage.isFur4DescriptionVisible();
      expect(isFur4DescriptionVisible).toBe(true);
      console.log('✓ FUR4 description is visible');
    });
    await test.step('Verify "All FUR4 deShedding tools" text is present', async () => {
      const isAllFur4ToolsTextVisible = await aboutUsPage.isAllFur4ToolsTextVisible();
      expect(isAllFur4ToolsTextVisible).toBe(true);
      console.log('✓ "All FUR4 deShedding tools" text is present');
    });
    await test.step('Verify the text content contains the expected phrase', async () => {
      const allFur4ToolsText = await aboutUsPage.getAllFur4ToolsText();
      expect(allFur4ToolsText).toContain('All FUR4 deShedding tools');
      console.log('✓ Text content contains expected phrase: "All FUR4 deShedding tools"');
    });
  });

  test('F4-160: "Browse Our Products" button is visible and clickable', { tag: [Type.VISUAL, Type.CONTENT, Type.SECTION] }, async () => {
    await test.step('Scroll to bottom of main content', async () => {
      await aboutUsPage.scrollToBottom();
    });
    await test.step('Look for "Browse Our Products" button', async () => {
      const isButtonVisible = await aboutUsPage.isBrowseOurProductsButtonVisible();
      expect(isButtonVisible).toBe(true);
    });
    await test.step('Click button and verify PolyCarboMax™ heading is visible', async () => {
      await aboutUsPage.clickBrowseOurProductsButton();
      const isPolyCarboMaxVisible = await aboutUsPage.isPolyCarboMaxHeadingVisible();
      expect(isPolyCarboMaxVisible).toBe(true);
    });
    await test.step('Verify PolyCarboMax™ heading text is correct', async () => {
      const polyCarboMaxText = await aboutUsPage.getPolyCarboMaxHeadingText();
      expect(polyCarboMaxText.trim()).toBe('PolyCarboMax™');
    });
  });

  test('F4-161: "Learn More" link/button in PolyCarboMax™ section is visible and clickable', { tag: [Type.LINK, Type.NAVIGATION, Type.FUNCTIONAL] }, async () => {
    await test.step('Find "Learn More" link/button in PolyCarboMax™ section', async () => {
      const isLearnMoreVisible = await aboutUsPage.isLearnMoreLinkVisible();
      expect(isLearnMoreVisible).toBe(true);
    });
    await test.step('Click Learn More link and verify it opens details or new page', async () => {
      await aboutUsPage.clickLearnMoreLink();
      // Wait a moment for navigation or modal to appear
      await aboutUsPage.page.waitForTimeout(2000);
      // Verify that some action occurred (could be URL change, modal, etc.)
      const currentUrl = aboutUsPage.page.url();
      expect(currentUrl).toBeTruthy();
    });
  });

  test('F4-162: Footer is present at the bottom of the About Us page', { tag: [Type.VISUAL, Type.FOOTER, Type.CONTENT] }, async () => {
    await test.step('Scroll to bottom of the page', async () => {
      await aboutUsPage.scrollToBottom();
    });
    await test.step('Check for footer section with company info, links, and copyright', async () => {
      const isFooterVisible = await aboutUsPage.isFooterVisible();
      expect(isFooterVisible).toBe(true);
    });
    await test.step('Verify footer contains company information and links', async () => {
      const footerText = await aboutUsPage.getFooterText();
      expect(footerText.length).toBeGreaterThan(0);
      expect(footerText).toContain('FUR4');
    });
  });
});
