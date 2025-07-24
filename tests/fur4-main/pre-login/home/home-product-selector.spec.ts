import { test, expect, Page } from '@playwright/test';
import { ProductSelector } from '../../../../page-objects/fur4/prelogin/home/productSelector';
import { Type } from '../../../utils/tags';
import { navigateToHomepage } from '../../../utils/helpers';

test.describe('F4 Homepage – Product Selector Cards Section', () => {
  let productSelector: ProductSelector;

  test.beforeEach(async ({ page }) => {
    await navigateToHomepage(page);
    productSelector = new ProductSelector(page);
  });

  test('F4-058: "The best tool FUR your FOUR Legged friends" section title is visible after scroll', { tag: [Type.SECTION, Type.SCROLL, Type.VISUAL] }, async () => {
    await productSelector.scrollToSection();
    const titleText = await productSelector.getSectionTitleText();
    expect(titleText).toBe('The best tool FUR your FOUR Legged friends');
  });


  test('F4-059: 1st card Learn More navigates to Long Hair Dog product page', { tag: [Type.SECTION, Type.BUTTON, Type.FUNCTIONAL] }, async () => {
    await productSelector.scrollToSection();
    await test.step('Click 1st card + Learn More and assert navigation', async () => {
      await productSelector.clickLearnMoreButtonAndAssertNavigation(
        0,
        '/products/fur4-deshedding-tool-long-hair-dog',
        'FUR4 deShedding Tool - Long Hair Dog'
      );
    });
  });

  test('F4-060: 2nd card Learn More navigates to Short Hair Dog product page', { tag: [Type.SECTION, Type.BUTTON, Type.FUNCTIONAL] }, async () => {
    await productSelector.scrollToSection();
    await test.step('Click 2nd card + Learn More and assert navigation', async () => {
      await productSelector.clickLearnMoreButtonAndAssertNavigation(
        1,
        '/products/fur4-deshedding-tool-short-hair-dog',
        'FUR4 deShedding Tool - Short Hair Dog'
      );
    });
  });

  test('F4-061: 3rd card Learn More navigates to Long Hair Cat product page', { tag: [Type.SECTION, Type.BUTTON, Type.FUNCTIONAL] }, async () => {
    await productSelector.scrollToSection();
    await test.step('Click 3rd card + Learn More and assert navigation', async () => {
      await productSelector.clickLearnMoreButtonAndAssertNavigation(
        2,
        '/products/fur4-deshedding-tool-long-hair-cat',
        'FUR4 deShedding Tool - Long Hair Cat'
      );
    });
  });

  test('F4-62: 4th card Learn More navigates to Short Hair Cat product page', { tag: [Type.SECTION, Type.BUTTON, Type.FUNCTIONAL] }, async () => {
    await productSelector.scrollToSection();
    await test.step('Click 4th card + Learn More and assert navigation', async () => {
      await productSelector.clickLearnMoreButtonAndAssertNavigation(
        3,
        '/products/fur4-deshedding-tool-short-hair-cat',
        'FUR4 deShedding Tool - Short Hair Cat'
      );
    });
  });

  test('F4-065: No broken images or UI issues in product selector cards section', { tag: [Type.SECTION, Type.VISUAL, Type.SMOKE] }, async () => {
    await productSelector.scrollToSection();
    const brokenImages = await productSelector.checkForBrokenImages();
    if (brokenImages.length > 0) {
      console.log('Broken images:', brokenImages);
    }
    expect(brokenImages.length).toBe(0);
  });
});
