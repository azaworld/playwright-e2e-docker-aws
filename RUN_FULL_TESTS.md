# 🚀 Complete Guide: Run Full Test Suite with S3 Upload & Teams Notification

## 📋 Prerequisites

### 1. Set Environment Variables

Create a `.env` file in your project root with:

```bash
# Teams Webhook URL
TEAMS_WEBHOOK_URL=https://your-teams-webhook-url.com/webhook

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket-name
AWS_S3_REPORT_PREFIX=playwright-reports
AWS_S3_SCREENSHOT_PREFIX=playwright-screenshots

# Environment
ENV=Production
```

### 2. Or Export Variables in Terminal

```bash
export TEAMS_WEBHOOK_URL="https://your-teams-webhook-url.com/webhook"
export AWS_ACCESS_KEY_ID="your-aws-access-key"
export AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
export AWS_REGION="us-east-1"
export AWS_S3_BUCKET="your-s3-bucket-name"
export AWS_S3_REPORT_PREFIX="playwright-reports"
export AWS_S3_SCREENSHOT_PREFIX="playwright-screenshots"
export ENV="Production"
```

## 🎯 Run Full Test Suite

### Option 1: Complete Pipeline (Recommended)
```bash
npm run test:ci:full
```

### Option 2: Debug Mode (No S3 Upload)
```bash
npm run test:teams:debug
```

### Option 3: Manual Step-by-Step
```bash
# 1. Run tests with JSON reporter
npx playwright test --reporter=list,json,html --output-dir=test-results

# 2. Upload to S3
npx ts-node tests/utils/upload-playwright-report-to-s3.ts

# 3. Send Teams notification
npx ts-node tests/utils/notifyTeams.ts
```

## 📊 Expected Teams Message Format

You'll receive a comprehensive Teams notification like this:

```
🔴 Testing Report Prod - Issues Detected
Test Date: 2025-08-01, 10:30 PM
🔎 View Detailed HTML Report

❗ Issues detected in this run. Please review the failures below.

Test Results
✅ Passed: 129
❌ Failed: 5
⏭️ Skipped: 2
🧮 Total: 136
⏱️ Duration: 17:49
📅 Date: 2025-08-01, 10:30 PM
📊 Pass %: 94.9%

❌ Failed Tests
Showing 5 failure(s) below

F4-111: "Subscribe to our newsletter" text and input visible
File: fur4-main/pre-login/menu/menu.spec.ts Status: failed Error: expect(received).toBe(expected) // Object.is equality Expected: true Received: false

F4-112: Newsletter subscription input accepts text
File: fur4-main/pre-login/menu/menu.spec.ts Status: failed Error: locator.fill: Error: strict mode violation: locator('input[type="email"]').or(locator('input[placeholder*="email"]')).or(locator('input[placeholder*="Email"]')) resolved to 2 elements...

🔴 View Latest Test Report
```

## 🔧 Troubleshooting

### If Teams notification shows "0" for all counts:
- Check that `test-results/results.json` exists
- Verify the JSON structure matches expected format
- Run with debug mode: `npm run test:teams:debug`

### If S3 upload fails:
- Verify AWS credentials are correct
- Check S3 bucket permissions
- Ensure bucket allows public read access

### If Teams webhook fails:
- Verify webhook URL is correct
- Check Teams channel permissions
- Test webhook manually

## 📁 Generated Files

After running, you'll have:
- `test-results/` - Test artifacts and results
- `playwright-report/` - HTML report
- `test-results/` - Playwright test results
- S3 bucket with uploaded reports

## 🎉 Success Indicators

✅ **All working correctly when you see:**
- Teams notification with proper test counts
- S3 upload success messages
- HTML report accessible via S3 URL
- Detailed failure information in Teams message 