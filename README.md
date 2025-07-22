# FUR4 Automated Test Suite

Automated Playwright tests for guest-visible areas of [fur4.com](https://fur4.com/) and [refer.fur4.com](https://refer.fur4.com/).

## 🎯 Test Objectives

- **Homepage loads correctly** (no missing content or 404s)
- **Referral and dealer landing pages** display expected CTAs
- **Registration forms** load and validate
- **Social login buttons** (Google, Facebook, LinkedIn) appear
- **Product pages** render fully with images and pricing
- **Add to cart and start checkout** (guest flow)

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd FUR-Refer

# Install dependencies
npm install

# Install Playwright browsers
npm run install-browsers
```

### Environment Setup

Create a `.env` file in the root directory:

```env
# Teams webhook URL for notifications (optional)
TEAMS_WEBHOOK_URL=https://platformzus.webhook.office.com/webhookb2/....

# Test configuration
TEST_TIMEOUT=60000
```

## 🐳 Docker Deployment

### Local Docker Setup

```bash
# Build Docker image
npm run docker:build

# Run tests in Docker
npm run docker:run

# Or use Docker Compose
npm run docker:compose:up
npm run docker:compose:logs
```

### AWS Server Deployment

The project is fully containerized and ready for AWS deployment with automated scheduling.

#### Prerequisites
- AWS EC2 instance (Ubuntu 20.04+ recommended)
- SSH access to the server
- Docker and Docker Compose (installed automatically by deploy script)

#### Quick Deployment

```bash
# 1. Ensure your .env file is configured
echo "TEAMS_WEBHOOK_URL=your_webhook_url" > .env

# 2. Run the deployment script
npm run deploy:aws
```

#### Manual Deployment Steps

```bash
# 1. SSH to your AWS server
ssh arifuz@54.215.243.212

# 2. Create project directory
mkdir -p ~/fur4-playwright
cd ~/fur4-playwright

# 3. Copy project files (from your local machine)
scp -r . arifuz@54.215.243.212:~/fur4-playwright/

# 4. Build and start containers
docker-compose build
docker-compose up -d

# 5. Set up PM2 for scheduling
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Server Configuration

- **Server IP:** 54.215.243.212
- **Username:** arifuz
- **Port:** 22
- **Test Schedule:** Every 15 minutes
- **Logs:** `/home/arifuz/fur4-playwright/logs/`

#### Monitoring Commands

```bash
# View container logs
ssh arifuz@54.215.243.212 'cd ~/fur4-playwright && docker-compose logs -f'

# Check PM2 status
ssh arifuz@54.215.243.212 'pm2 status'

# View PM2 logs
ssh arifuz@54.215.243.212 'pm2 logs'

# Restart services
ssh arifuz@54.215.243.212 'cd ~/fur4-playwright && docker-compose restart'
```

## 🧪 Running Tests

### Run All Tests
```bash
npm run test:all
```

### Run Specific Test Suites
```bash
# Main site tests only
npm run test:fur4

# Referral site tests only
npm run test:refer

# Critical flows only (login, checkout, referrals)
npm run test:critical
```

### Debug Mode
```bash
# Run with headed browser (visible)
npm run test:headed

# Run with debug mode
npm run test:debug
```

### View Reports
```bash
# Open HTML report
npm run report
```
> **Note:** Do not run `npx playwright show-report` as part of your automated test scripts (like `npm run test:teams`). Let the script finish completely to ensure Teams notifications and S3 uploads work. Run `npx playwright show-report` separately if you want to view the report locally.

## 🔍 Real-Time Monitoring

### Single Monitoring Cycle
Run a one-time check of all critical flows:
```bash
npm run monitor:single
```

### Continuous Monitoring
Start continuous monitoring with 5-minute intervals:
```bash
npm run monitor:start
```

Or specify custom interval (in minutes):
```bash
npm run monitor:continuous 10
```

### Monitoring Features
- **Critical Flow Detection**: Login, checkout, referral claims, payment processing
- **API Health Checks**: Stripe, Twilio, SendGrid integration monitoring
- **Real-Time Alerts**: Immediate Teams notifications for failures
- **Proactive Insights**: Revenue impact analysis and recommendations

## 📋 Test Coverage

### Main Site (fur4.com)
- ✅ Homepage loading and content verification
- ✅ CTA buttons and navigation
- ✅ Product page rendering with images and pricing
- ✅ Add to cart functionality
- ✅ Guest checkout flow
- ✅ Registration forms
- ✅ Social login integration

### Referral Site (refer.fur4.com)
- ✅ Referral landing page functionality
- ✅ Dealer landing page CTAs
- ✅ Registration form validation
- ✅ Social login buttons
- ✅ Navigation and footer links

## 🔔 Teams Integration

The test suite automatically sends notifications to Microsoft Teams when tests complete.

> **Important:** For `npm run test:teams`, do not interrupt the process. Let it finish on its own. If you stop it early (e.g., with Ctrl+C), the upload and Teams notification steps will not run.

### Setup Teams Webhook

1. In your Teams channel, go to **Connectors**
2. Add an **Incoming Webhook**
3. Copy the webhook URL
4. Add to your `.env` file:
   ```env
   TEAMS_WEBHOOK_URL=https://platformzus.webhook.office.com/webhookb2/
   ```

### Notification Features

- ✅ **Pass/Fail status** with color coding
- 📊 **Test statistics** (passed/failed/skipped)
- ⏱️ **Execution duration**
- 🕐 **Start/End timestamps**
- 🚨 **Critical failure analysis** with impact assessment
- 💰 **Revenue impact alerts** for broken flows
- 🔧 **Actionable recommendations** for each failure
- 🔗 **Direct link to HTML report**

## 📅 Daily Test Execution

### Manual Daily Run
```bash
npm run test:daily
```

### Automated Daily Execution

#### Using GitHub Actions
Create `.github/workflows/daily-tests.yml`:

```yaml
name: Daily FUR4 Tests

on:
  schedule:
    - cron: '0 9 * * *'  # Daily at 9 AM UTC
  workflow_dispatch:  # Manual trigger

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run install-browsers
      - run: npm run test:daily
        env:
          TEAMS_WEBHOOK_URL: ${{ secrets.TEAMS_WEBHOOK_URL }}
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results
          path: test-results/
```

#### Using Cron (Linux/Mac)
Add to crontab:
```bash
# Edit crontab
crontab -e

# Add daily test at 9 AM
0 9 * * * cd /path/to/FUR-Refer && npm run test:daily
```

## 📊 Test Reports

### HTML Report
- Location: `playwright-report/index.html`
- View: `npm run report`
- Features: Interactive test results, screenshots, videos

### JSON Report
- Location: `test-results/results.json`
- Used for: Teams notifications, CI integration

### JUnit Report
- Location: `test-results/results.xml`
- Used for: CI/CD pipeline integration

## 🔧 Configuration

### Playwright Config
- **Browsers**: Chrome (Chromium)
- **Viewport**: 1280x720
- **Timeout**: 60 seconds for navigation
- **Retries**: 2 on CI, 0 locally
- **Screenshots**: On failure only
- **Videos**: On failure only

### Test Structure
```
tests/
├── fur4-main/                # Main site test suites
│   ├── fur4-main-site.spec.ts
│   ├── critical-flows.spec.ts
├── fur4-referral/            # Referral site test suites
│   └── fur4-referral-site.spec.ts
├── utils/                    # Shared utility/helper functions and reporters
│   ├── helpers.ts
│   ├── always-json-reporter.ts
│   ├── always-json-reporter.js
│   ├── real-time-monitor.ts
│   └── send-teams-report.ts
└── fixtures/                 # Test data, mock files, etc. (optional, for future use)
```

## 🐛 Troubleshooting

### Common Issues

#### Tests Timeout
- Increase timeout in `playwright.config.ts`
- Check site availability manually
- Verify network connectivity

#### Bot Detection
- Tests use realistic user agents
- Consider running in headed mode: `npm run test:headed`

#### Teams Notifications Not Working
- Verify webhook URL is correct
- Check Teams channel permissions
- Review console logs for errors

#### Docker Issues
- Ensure Docker and Docker Compose are installed
- Check container logs: `docker-compose logs`
- Verify environment variables are set correctly

### Debug Mode
```bash
# Run specific test with debug
npx playwright test tests/fur4-main-site.spec.ts --debug

# Run with headed browser
npx playwright test --headed

# Debug Docker container
docker-compose exec playwright-tests bash
```

## 📈 Monitoring

### Key Metrics
- **Test Pass Rate**: Should be >95%
- **Execution Time**: Typically 2-5 minutes
- **Site Availability**: All pages should load within 60s

### Alert Thresholds
- ⚠️ **Warning**: >1 test failure
- 🚨 **Critical**: >3 test failures or site down

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit pull request

## 📝 License

ISC License - see LICENSE file for details. 

## Project Structure

```
FUR-Refer/
├── tests/
│   ├── fur4-main/                # Main site test suites
│   ├── fur4-referral/            # Referral site test suites
│   ├── utils/                    # Shared utility/helper functions and reporters
│   │   ├── helpers.ts
│   │   ├── always-json-reporter.ts
│   │   ├── always-json-reporter.js
│   │   ├── real-time-monitor.ts
│   │   └── send-teams-report.ts
│   └── fixtures/                 # Test data, mock files, etc. (optional, for future use)
├── page-objects/
│   ├── fur4/                     # Main site page objects
│   └── refer/                    # Referral site page objects
├── playwright.config.ts          # Playwright configuration
├── .env                          # Environment variables
├── Dockerfile, docker-compose.yml
├── upload-playwright-report-to-s3.js
├── tests/send-teams-report.js
├── test-results/                 # Test output (ignored by git)
├── playwright-report/            # HTML report output (ignored by git)
└── ...
```

- **tests/utils/**: Place any shared helper functions here (e.g., random data generators, custom assertions).
- **tests/fixtures/**: Place any static test data, mock files, or fixtures here.
- **page-objects/**: All POM classes, organized by domain.
- **test-results/** and **playwright-report/**: Output folders, auto-generated.

This structure follows industry best practices for scalable, maintainable Playwright E2E projects. 