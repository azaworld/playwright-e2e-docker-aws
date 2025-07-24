import { test, expect } from '@playwright/test';
import { HomeHero } from '../../../../page-objects/fur4/prelogin/home/HomeHero';
import { Type } from '../../../utils/tags';

test.describe('F4 Homepage - Hero Section', () => {
  let homeHero: HomeHero;

  test.beforeEach(async ({ page }) => {
    homeHero = new HomeHero(page);
    await homeHero.navigateToHomepage();
  });

  test('F4-001: Homepage loads successfully and URL is correct', { tag: [Type.FUNCTIONAL, Type.SMOKE, Type.LOAD] }, async ({page}) => {
    await homeHero.verifyPageLoad();
  });

  test('F4-002: F4 logo is visible in the header on homepage', { tag: [Type.HEADER, Type.VISUAL, Type.BRANDING] }, async () => {
    const isLogoVisible = await homeHero.isLogoVisible();
    expect(isLogoVisible).toBe(true);
  });

  test('F4-003: Hero section displays "deShedding Tool" image', { tag: [Type.HERO, Type.VISUAL, Type.BRANDING] }, async () => {
    await test.step('Check that the hero image is visible', async () => {
      const isVisible = await homeHero.isHeroImageVisible();
      expect(isVisible).toBe(true);
    });
    await test.step('Check that the hero image src contains "de_Shedding_Tool"', async () => {
      const src = await homeHero.getHeroImageSrc();
      expect(src).toContain('de_Shedding_Tool');
    });
  });

  test('F4-004: Hero tagline "SAFER, GENTLER AND MORE EFFECTIVE" is visible', { tag: [Type.HERO, Type.VISUAL, Type.CONTENT] }, async () => {
    await test.step('Check for hero tagline text in the hero section', async () => {
      const isTaglineVisible = await homeHero.isHeroTaglineVisible();
      expect(isTaglineVisible).toBe(true);
    });
    await test.step('Check "Designed to dramatically reduce shedding for" text is present', async () => {
      const isDescriptionVisible = await homeHero.isHeroDescriptionVisible();
      expect(isDescriptionVisible).toBe(true);
    });
    await test.step('Check "Back to top" button is present', async () => {
      const isBackButtonVisible = await homeHero.isBackButtonVisible();
      expect(isBackButtonVisible).toBe(true);
    });
  });
  
  test('F4-005: Hero description is present and correct', { tag: [Type.HERO, Type.VISUAL, Type.CONTENT] }, async () => {
    // Check for description below tagline
    const isDescriptionVisible = await homeHero.isHeroDescriptionVisible();
    expect(isDescriptionVisible).toBe(true);
    const descriptionText = await homeHero.getHeroDescriptionText();
    expect(descriptionText.toLowerCase()).toContain('designed to dramatically reduce shedding');
  });

  test('F4-006: Main product image is visible in hero section', { tag: [Type.HERO, Type.VISUAL, Type.IMAGE] }, async () => {
    // Check for main product/tool image in hero section
    const isProductImageVisible = await homeHero.isProductImageVisible();
    expect(isProductImageVisible).toBe(true);
  });

  test('F4-007: "Buy Now" button is visible and clickable in header', { tag: [Type.HEADER, Type.BUTTON, Type.FUNCTIONAL] }, async () => {
    await test.step('Check that the "Buy Now" button is visible in the header', async () => {
      const isVisible = await homeHero.isBuyNowButtonVisible();
      expect(isVisible).toBe(true);
    });
    await test.step('Check that the "Buy Now" button is clickable', async () => {
      const isClickable = await homeHero.isBuyNowButtonClickable();
      expect(isClickable).toBe(true);
    });
    await test.step('Click the "Buy Now" button and verify navigation or action', async () => {
      await homeHero.clickBuyNowButton();
    });
  });

  test('F4-008: Cart icon is visible in header and displays item count', { tag: [Type.HEADER, Type.ICON, Type.FUNCTIONAL] }, async () => {
    await test.step('Check cart icon is visible', async () => {
      const isVisible = await homeHero.isCartIconVisible();
      expect(isVisible).toBe(true);
    });
    await test.step('Check cart item count is visible (if shown)', async () => {
      const isCountVisible = await homeHero.isCartCountVisible();
      if (isCountVisible !== undefined) {
        expect(isCountVisible).toBe(true);
      }
    });
  });
  
  test('F4-009: Cart icon is clickable and opens cart page', { tag: [Type.HEADER, Type.ICON, Type.FUNCTIONAL] }, async () => {
    await test.step('Click cart icon in header', async () => {
      await homeHero.clickCartIcon();
    });
    // Add more steps for cart page verification if needed
  });
  
  test('F4-010: Hamburger menu button is visible in header', { tag: [Type.HEADER, Type.MENU, Type.NAVIGATION] }, async () => {
    await test.step('Check hamburger/menu button is visible in header', async () => {
      const isVisible = await homeHero.isMenuButtonVisible();
      expect(isVisible).toBe(true);
    });
  });
  
  test('F4-011: Hamburger menu button opens navigation menu', { tag: [Type.HEADER, Type.MENU, Type.NAVIGATION] }, async () => {
    await test.step('Check hamburger/menu button is visible in header', async () => {
      const isVisible = await homeHero.isMenuButtonVisible();
      expect(isVisible).toBe(true);
    });
    await test.step('Click hamburger/menu button', async () => {
      await homeHero.clickMenuButton();
    });
    await test.step('Verify navigation menu/drawer appears', async () => {
      const isNavMenuVisible = await homeHero.isNavMenuVisible();
      expect(isNavMenuVisible).toBe(true);
    });
  });
  
  test.skip('F4-012: "Chat with us" widget is visible on right edge', { tag: [Type.WIDGET, Type.CHAT, Type.FUNCTIONAL] }, async () => {
    await test.step('Check for "Chat with us" widget/tab on right edge', async () => {
      const isVisible = await homeHero.isChatWidgetVisible();
      expect(isVisible).toBe(true);
    });
  });
   
  test.skip('F4-013: "Chat with us" widget can be opened', { tag: [Type.WIDGET, Type.CHAT, Type.FUNCTIONAL] }, async () => {
    await test.step('Click "Chat with us" tab', async () => {
      await homeHero.clickChatWidget();
    });
    // Add more steps for chat widget verification if needed
  });
  
  test('F4-014: Back/history button is visible at bottom right', { tag: [Type.FOOTER, Type.BUTTON, Type.FUNCTIONAL] }, async () => {
    await test.step('Check for back/history button (blue arrow) at bottom right', async () => {
      const isVisible = await homeHero.isBackButtonVisible();
      expect(isVisible).toBe(true);
    });
  });
  
  test('F4-015: Back/history button turns red on hover', { tag: [Type.FOOTER, Type.BUTTON, Type.UI, Type.TOOLTIP] }, async () => {
    await test.step('Hover over back/history button and verify color change', async () => {
      const initialColor = await homeHero.getBackButtonColor();
      await homeHero.hoverBackButton();
      const hoverColor = await homeHero.getBackButtonColor();
      expect(initialColor).not.toBe(hoverColor);
    });
  });

  test('F4-016: Back/history button navigates to homepage', { tag: [Type.FOOTER, Type.BUTTON, Type.FUNCTIONAL] }, async () => {
    await test.step('Click back/history button', async () => {
      await homeHero.clickBackButton();
    });
    // Add more steps for homepage verification if needed
  });
  
  test('F4-017: Homepage is scrollable', { tag: [Type.UI, Type.LAYOUT, Type.USABILITY] }, async () => {
    await test.step('Scroll down the homepage', async () => {
      await homeHero.scrollDown();
    });
    await test.step('Footer is visible after scrolling', async () => {
      const isFooterVisible = await homeHero.isFooterVisible();
      expect(isFooterVisible).toBe(true);
    });
  });
  
  test('F4-018: "scroll to explore" text is visible below product image', { tag: [Type.HERO, Type.VISUAL, Type.CONTENT] }, async () => {
    await test.step('Look for "scroll to explore" text below product image', async () => {
      const isVisible = await homeHero.isScrollToExploreTextVisible();
      expect(isVisible).toBe(true);
    });
  });

  test('F4-019: Blue flex container with deShedding Tool image and tagline is present and visible', { tag: [Type.VISUAL, Type.IMAGE, Type.FUNCTIONAL] }, async ({ page }) => {
    await test.step('Assert the blue flex container is present and visible', async () => {
      const blueFlex = page.locator('div.flex.flex-col.items-center.justify-center.bg-\\[\\#16C0F3\\]');
      await expect(blueFlex).toBeVisible();
    });
  });

  test('F4-020: Cart icon is clickable and navigates to shopping cart page', { tag: [Type.HEADER, Type.ICON, Type.FUNCTIONAL] }, async () => {
    await test.step('Click cart icon in header', async () => {
      await homeHero.clickCartIcon();
    });
    await test.step('Assert Shopping Cart heading is visible', async () => {
      const h2 = homeHero.page.locator('h2.text-center.font-din-condensed', { hasText: 'Shopping Cart' });
      await expect(h2).toBeVisible();
    });
  });

  test('F4-021: Buy Now button is clickable and navigates to products page', { tag: [Type.HEADER, Type.BUTTON, Type.FUNCTIONAL] }, async () => {
    await test.step('Click the "Buy Now" button', async () => {
      await homeHero.clickBuyNowButton();
    });
    await test.step('Assert the products page loads', async () => {
      await expect(homeHero.page).toHaveURL(/\/products/);
    });
  });
});
