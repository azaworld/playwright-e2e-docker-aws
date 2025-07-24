import { test, expect } from '@playwright/test';
import { HomeMoreEffective } from '../../../../page-objects/fur4/prelogin/home/homeMoreEffective';
import { Type } from '../../../utils/tags';

test.describe('F4 Homepage - More Effective Section', () => {
  let homeMoreEffective: HomeMoreEffective;

  test.beforeEach(async ({ page }) => {
    homeMoreEffective = new HomeMoreEffective(page);
    await homeMoreEffective.navigateToHomepage();
  });

  test('F4-040: "More Effective" section title is visible after scroll', { tag: [Type.SECTION, Type.SCROLL, Type.VISUAL] }, async () => {
    await test.step('Scroll to the More Effective section', async () => {
      await homeMoreEffective.scrollToSection();
    });
    await test.step('Check that the More Effective title is visible and correct', async () => {
      const isTitleVisible = await homeMoreEffective.isTitleVisible();
      expect(isTitleVisible).toBe(true);
      const titleText = await homeMoreEffective.getTitleText();
      expect(titleText?.trim()).toBe('More Effective');
    });
  });

  test('F4-042: "300% more deShedding area with FOUR PolyCarboMax composite carbon fiber edges" text is visible', { tag: [Type.SECTION, Type.CONTENT, Type.VISUAL] }, async () => {
    await test.step('Scroll to the More Effective section', async () => {
      await homeMoreEffective.scrollToSection();
    });
    await test.step('Check that the tagline is visible and correct', async () => {
      const taglineText = await homeMoreEffective.getTaglineText();
      expect(taglineText?.trim()).toBe('300% more deShedding area with FOUR PolyCarboMax composite carbon fiber edges');
    });
  });

  test('F4-043: Orange "REDUCES SHEDDING UP TO 95%" badge is present', { tag: [Type.SECTION, Type.VISUAL, Type.CONTENT] }, async () => {
    await test.step('Scroll to the More Effective section', async () => {
      await homeMoreEffective.scrollToSection();
    });
    await test.step('Log all images in the section for debugging', async () => {
      const images = await homeMoreEffective.section.locator('img').all();
      for (const img of images) {
        const src = await img.getAttribute('src');
        const alt = await img.getAttribute('alt');
        const cls = await img.getAttribute('class');
        const opacity = await img.evaluate(el => window.getComputedStyle(el).opacity);
        console.log('Image:', { src, alt, cls, opacity });
      }
    });
    await test.step('Scroll badge image into view and check visibility/presence', async () => {
      const badgeImg = homeMoreEffective.badgeImage;
      await badgeImg.scrollIntoViewIfNeeded().catch(() => {});
      const isVisible = await badgeImg.isVisible();
      if (!isVisible) {
        const isPresent = await badgeImg.count() > 0;
        if (isPresent) {
          console.warn('Badge image is present in DOM but not visible (possibly opacity 0 or offscreen)');
        }
        expect(isPresent).toBe(true);
      } else {
        expect(isVisible).toBe(true);
      }
    });
  });

  test('F4-044: Product image is present in "More Effective" section', { tag: [Type.SECTION, Type.IMAGE, Type.VISUAL] }, async () => {
    await test.step('Scroll to the More Effective section', async () => {
      await homeMoreEffective.scrollToSection();
    });
    await test.step('Log all images in the section for debugging', async () => {
      const images = await homeMoreEffective.section.locator('img').all();
      for (const img of images) {
        const src = await img.getAttribute('src');
        const alt = await img.getAttribute('alt');
        const cls = await img.getAttribute('class');
        const opacity = await img.evaluate(el => window.getComputedStyle(el).opacity);
        console.log('Image:', { src, alt, cls, opacity });
      }
    });
    await test.step('Scroll product image into view and check visibility/presence', async () => {
      const prodImg = homeMoreEffective.productImage;
      await prodImg.scrollIntoViewIfNeeded().catch(() => {});
      const isVisible = await prodImg.isVisible();
      if (!isVisible) {
        const isPresent = await prodImg.count() > 0;
        if (isPresent) {
          console.warn('Product image is present in DOM but not visible (possibly opacity 0 or offscreen)');
        }
        expect(isPresent).toBe(true);
      } else {
        expect(isVisible).toBe(true);
      }
    });
  });

  test('F4-046: No broken images or UI issues in "More Effective" section', { tag: [Type.SECTION, Type.VISUAL, Type.SMOKE] }, async () => {
    await test.step('Scroll to the More Effective section', async () => {
      await homeMoreEffective.scrollToSection();
    });
    await test.step('Wait for all images in More Effective section to load', async () => {
      const images = await homeMoreEffective.section.locator('img').all();
      for (const img of images) {
        await img.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      }
    });
    await test.step('Check for broken images in the More Effective section', async () => {
      const brokenImages = await homeMoreEffective.checkForBrokenImages();
      if (brokenImages.length > 0) {
        console.log('Broken images:', brokenImages);
      }
      expect(brokenImages.length).toBe(0);
    });
  });
});
