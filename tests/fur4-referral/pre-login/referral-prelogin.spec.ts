// Pre-login (guest) test cases for FUR4 Referral Site
require('dotenv').config();
import { test, expect } from '@playwright/test';
import { ReferralHomePage } from '../../../page-objects/refer/ReferralHomePage';
import { SignupPage } from '../../../page-objects/refer/SignupPage';
import { DealerPage } from '../../../page-objects/refer/DealerPage';
import { NavigationPage } from '../../../page-objects/refer/NavigationPage';
import { SocialLoginPage } from '../../../page-objects/refer/SocialLoginPage';
import { buildTag } from '../../utils/tagBuilder';

const FUR4_REFERRAL_URL = process.env.FUR4_REFERRAL_URL;
if (!FUR4_REFERRAL_URL) throw new Error('FUR4_REFERRAL_URL is not set in environment variables');

test.describe('FUR4 Referral Site - Guest User Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
  });
}); 