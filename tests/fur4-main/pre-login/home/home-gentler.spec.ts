import { test, expect } from '@playwright/test';
import { HomeGentler } from '../../../../page-objects/fur4/prelogin/home/HomeGentler';
import { Type } from '../../../utils/tags';

test.describe('F4 Homepage - Gentler Section', () => {
  let homeGentler: HomeGentler;

  test.beforeEach(async ({ page }) => {
    homeGentler = new HomeGentler(page);
    await homeGentler.navigateToHomepage();
  });

  test('F4-034: "Gentler" section title is visible after scroll', { tag: [Type.SECTION, Type.SCROLL, Type.VISUAL] }, async () => {
    await test.step('Scroll to the Gentler section', async () => {
      await homeGentler.scrollToGentlerSection();
    });
    await test.step('Check that the Gentler title is visible and correct', async () => {
      const isTitleVisible = await homeGentler.isGentlerTitleVisible();
      expect(isTitleVisible).toBe(true);
      const titleText = await homeGentler.getGentlerTitleText();
      expect(titleText?.trim()).toBe('Gentler');
    });
  });

  test('F4-035: "Four deShedding edges spread out pressure for a comfortable grooming experience" text is visible', { tag: [Type.SECTION, Type.CONTENT, Type.VISUAL] }, async () => {
    await test.step('Scroll to the Gentler section', async () => {
      await homeGentler.scrollToGentlerSection();
    });
    await test.step('Check that the tagline is visible and correct', async () => {
      const taglineText = await homeGentler.getGentlerTaglineText();
      expect(taglineText?.trim()).toBe('Four deShedding edges spread out pressure for a comfortable grooming experience');
    });
  });

  test('F4-036: Product image is present in "Gentler" section', { tag: [Type.SECTION, Type.IMAGE, Type.VISUAL] }, async () => {
    await test.step('Scroll to the Gentler section', async () => {
      await homeGentler.scrollToGentlerSection();
    });
    await test.step('Check that the product image is visible', async () => {
      const isImageVisible = await homeGentler.isGentlerProductImageVisible();
      expect(isImageVisible).toBe(true);
    });
  });
});
