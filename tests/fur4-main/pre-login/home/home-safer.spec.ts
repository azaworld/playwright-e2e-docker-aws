import { test, expect } from '@playwright/test';
import { HomeSafter } from '../../../../page-objects/fur4/prelogin/home/HomeSafer';
import { Type } from '../../../utils/tags';

test.describe('F4 Homepage - Safer Section', () => {
  let homeSafter: HomeSafter;

  test.beforeEach(async ({ page }) => {
    homeSafter = new HomeSafter(page);
    await homeSafter.navigateToHomepage();
  });

  test('F4-022: "Safer" section is visible after scrolling down', { tag: [Type.SECTION, Type.SCROLL, Type.VISUAL] }, async () => {
    await test.step('Scroll down the homepage until "Safer" is visible', async () => {
      await homeSafter.scrollToSaferSection();
    });
    await test.step('Verify the "Safer" section is visible', async () => {
      const isSaferSectionVisible = await homeSafter.isSaferSectionVisible();
      expect(isSaferSectionVisible).toBe(true);
    });
  });

  test('F4-023: "The safer way to deShed your pet" tagline is visible in Safer section', { tag: [Type.SECTION, Type.VISUAL, Type.CONTENT] }, async () => {
    await test.step('Scroll to the Safer section', async () => {
      await homeSafter.scrollToSaferSection();
    });
    await test.step('Check that the tagline is visible and correct', async () => {
      const taglineText = await homeSafter.getSaferTaglineText();
      expect(taglineText?.trim()).toBe('The safer way to deShed your pet');
    });
  });

  test('F4-024: "NO HARSH METAL BLADES" warning is present with icon', { tag: [Type.SECTION, Type.CONTENT, Type.ICON] }, async () => {
    await test.step('Scroll to the Safer section', async () => {
      await homeSafter.scrollToSaferSection();
    });
    await test.step('Check that the warning text is visible and correct', async () => {
      const warningText = await homeSafter.getNoHarshBladesWarningText();
      expect(warningText?.trim()).toBe('NO HARSH METAL BLADES');
    });
  });
});

