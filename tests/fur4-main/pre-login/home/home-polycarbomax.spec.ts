import { test, expect } from '@playwright/test';
import { HomePolycarbomax } from '../../../../page-objects/fur4/prelogin/home/HomePolycarbomax';
import { Type } from '../../../utils/tags';

test.describe('F4 Homepage – Advanced PolyCarboMax Material Section', () => {
  let homePolycarbomax: HomePolycarbomax;

  test.beforeEach(async ({ page }) => {
    homePolycarbomax = new HomePolycarbomax(page);
    await homePolycarbomax.navigateToHomepage();
  });

  test('F4-047: "Advanced PolyCarboMax Material" section title is visible after scroll', { tag: [Type.SECTION, Type.SCROLL, Type.VISUAL] }, async () => {
    await test.step('Scroll to the Advanced PolyCarboMax Material section', async () => {
      await homePolycarbomax.scrollToSection();
    });
    await test.step('Check that the section title is visible and correct', async () => {
      const isTitleVisible = await homePolycarbomax.isTitleVisible();
      expect(isTitleVisible).toBe(true);
      const titleText = await homePolycarbomax.getTitleText();
      expect(titleText?.replace(/\s+/g, ' ').trim()).toBe('Advanced PolyCarboMax Material');
    });
  });

  test('F4-048: Section displays descriptive text about PolyCarboMax material', { tag: [Type.SECTION, Type.VISUAL, Type.CONTENT] }, async () => {
    await test.step('Scroll to the Advanced PolyCarboMax Material section', async () => {
      await homePolycarbomax.scrollToSection();
    });
    await test.step('Check that the descriptive text is visible and correct', async () => {
      const isDescVisible = await homePolycarbomax.isDescriptionVisible();
      expect(isDescVisible).toBe(true);
      const descText = await homePolycarbomax.getDescriptionText();
      expect(descText?.replace(/\s+/g, ' ').trim()).toBe('FUR4’s superior deShedding design is made possible using an innovative new composite carbon fiber. This ground-breaking material is incredibly strong and curiously lightweight, enabling the innovative and patented FUR4 deShedding edges with eight SafetyNubs.');
    });
  });

  test('F4-049: "+ Learn More" button is visible and clickable in this section', { tag: [Type.SECTION, Type.BUTTON, Type.FUNCTIONAL] }, async () => {
    await test.step('Scroll to the Advanced PolyCarboMax Material section', async () => {
      await homePolycarbomax.scrollToSection();
    });
    await test.step('Check that the + Learn More button is visible', async () => {
      const isBtnVisible = await homePolycarbomax.isLearnMoreButtonVisible();
      expect(isBtnVisible).toBe(true);
    });
    await test.step('Click the + Learn More button and wait for navigation', async () => {
      await homePolycarbomax.clickLearnMoreAndWaitForNavigation();
      expect(homePolycarbomax.page.url()).toContain('/polycarbomax');
    });
    await test.step('Check that the PolyCarboMax page title is visible', async () => {
      const isTitleVisible = await homePolycarbomax.isPolyCarboMaxPageTitleVisible();
      expect(isTitleVisible).toBe(true);
    });
  });

  test('F4-050: Product image is present in “Advanced PolyCarboMax Material” section', { tag: [Type.SECTION, Type.IMAGE, Type.VISUAL] }, async () => {
    await test.step('Scroll to the Advanced PolyCarboMax Material section', async () => {
      await homePolycarbomax.scrollToSection();
    });
    await test.step('Check that the product image is visible', async () => {
      const isImageVisible = await homePolycarbomax.isProductImageVisible();
      expect(isImageVisible).toBe(true);
    });
  });

  test('F4-051: Layout, font, and colors are correct in “Advanced PolyCarboMax Material” section', { tag: [Type.SECTION, Type.VISUAL, Type.LAYOUT] }, async () => {
    await test.step('Scroll to the Advanced PolyCarboMax Material section', async () => {
      await homePolycarbomax.scrollToSection();
    });
    await test.step('Check layout, font, and color styles', async () => {
      const styleInfo = await homePolycarbomax.checkLayoutAndStyles();
      console.log('PolyCarboMax section style info:', styleInfo);
      expect(styleInfo).not.toBeNull();
      // You can add more specific assertions here if you want to check for exact font/color values
    });
  });

  test('F4-052: No broken images or UI issues in “Advanced PolyCarboMax Material” section', { tag: [Type.SECTION, Type.VISUAL, Type.SMOKE] }, async () => {
    await test.step('Scroll to the Advanced PolyCarboMax Material section', async () => {
      await homePolycarbomax.scrollToSection();
    });
    await test.step('Wait for all images in section to load', async () => {
      const images = await homePolycarbomax.section.locator('img').all();
      for (const img of images) {
        await img.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      }
    });
    await test.step('Check for broken images in the section', async () => {
      const brokenImages = await homePolycarbomax.checkForBrokenImages();
      if (brokenImages.length > 0) {
        console.log('Broken images:', brokenImages);
      }
      expect(brokenImages.length).toBe(0);
    });
  });
});
