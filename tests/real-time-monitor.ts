import { chromium, Browser, Page } from 'playwright';

interface MonitoringResult {
  timestamp: string;
  status: 'healthy' | 'warning' | 'critical';
  checks: {
    name: string;
    status: 'pass' | 'fail' | 'warning';
    duration: number;
    error?: string;
    details?: any;
  }[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
  };
}

class RealTimeMonitor {
  private browser: Browser | null = null;
  private webhookUrl: string;

  constructor() {
    this.webhookUrl = process.env.TEAMS_WEBHOOK_URL || '';
  }

  async initialize() {
    this.browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async checkCriticalFlow(page: Page, name: string, url: string, checks: (page: Page) => Promise<any>): Promise<any> {
    const startTime = Date.now();
    try {
      await page.goto(url, { timeout: 30000 });
      await page.waitForLoadState('domcontentloaded');
      
      const result = await checks(page);
      const duration = Date.now() - startTime;
      
      return {
        name,
        status: 'pass',
        duration,
        details: result
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        name,
        status: 'fail',
        duration,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  async checkLoginFlow(page: Page): Promise<any> {
    const loginSelectors = [
      'a[href*="login"]',
      'button:has-text("Login")',
      'button:has-text("Sign In")',
      '[class*="login"]'
    ];
    
    for (const selector of loginSelectors) {
      const elements = await page.locator(selector).all();
      if (elements.length > 0) {
        const href = await elements[0].getAttribute('href');
        if (href) {
          await page.goto(href.startsWith('http') ? href : `https://fur4.com${href}`, { timeout: 15000 });
          await page.waitForLoadState('domcontentloaded');
          
          const forms = await page.locator('form').all();
          const emailFields = await page.locator('input[type="email"], input[name*="email"]').all();
          const passwordFields = await page.locator('input[type="password"]').all();
          
          return {
            loginFound: true,
            forms: forms.length,
            emailFields: emailFields.length,
            passwordFields: passwordFields.length,
            functional: forms.length > 0 && emailFields.length > 0 && passwordFields.length > 0
          };
        }
      }
    }
    
    return { loginFound: false };
  }

  async checkCheckoutFlow(page: Page): Promise<any> {
    const cartSelectors = [
      'a[href*="cart"]',
      'button:has-text("Cart")',
      '[class*="cart"]',
      'a[href*="checkout"]'
    ];
    
    for (const selector of cartSelectors) {
      const elements = await page.locator(selector).all();
      if (elements.length > 0) {
        await elements[0].click();
        await page.waitForLoadState('domcontentloaded');
        
        const checkoutElements = await page.locator('a[href*="checkout"], button:has-text("Checkout"), [class*="checkout"]').all();
        const paymentForms = await page.locator('form[action*="stripe"], [class*="stripe"], [data-stripe]').all();
        
        return {
          cartFound: true,
          checkoutElements: checkoutElements.length,
          paymentForms: paymentForms.length,
          functional: checkoutElements.length > 0 || paymentForms.length > 0
        };
      }
    }
    
    return { cartFound: false };
  }

  async checkReferralFlow(page: Page): Promise<any> {
    const referralSelectors = [
      'button:has-text("Claim")',
      'button:has-text("Refer")',
      'a[href*="claim"]',
      'a[href*="refer"]',
      '[class*="referral"]'
    ];
    
    for (const selector of referralSelectors) {
      const elements = await page.locator(selector).all();
      if (elements.length > 0) {
        await elements[0].click();
        await page.waitForLoadState('domcontentloaded');
        
        const forms = await page.locator('form').all();
        const emailFields = await page.locator('input[type="email"], input[name*="email"]').all();
        
        return {
          referralFound: true,
          forms: forms.length,
          emailFields: emailFields.length,
          functional: forms.length > 0 || emailFields.length > 0
        };
      }
    }
    
    return { referralFound: false };
  }

  async checkAPIIntegrations(page: Page): Promise<any> {
    const apiErrors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text().toLowerCase();
        if (text.includes('stripe') || text.includes('twilio') || text.includes('sendgrid') || 
            text.includes('api') || text.includes('fetch') || text.includes('xhr')) {
          apiErrors.push(msg.text());
        }
      }
    });
    
    // Wait for any API calls to complete
    await page.waitForTimeout(3000);
    
    const criticalErrors = apiErrors.filter(error => 
      error.toLowerCase().includes('stripe') || 
      error.toLowerCase().includes('payment') ||
      error.toLowerCase().includes('auth')
    );
    
    return {
      totalErrors: apiErrors.length,
      criticalErrors: criticalErrors.length,
      healthy: criticalErrors.length === 0
    };
  }

  async runMonitoringCycle(): Promise<MonitoringResult> {
    if (!this.browser) {
      throw new Error('Browser not initialized');
    }

    const page = await this.browser.newPage();
    await page.context().setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });

    const checks = [
      await this.checkCriticalFlow(page, 'FUR4 Homepage', 'https://fur4.com/', async (p) => {
        const title = await p.title();
        return { title, loaded: title.length > 0 };
      }),
      await this.checkCriticalFlow(page, 'FUR4 Login Flow', 'https://fur4.com/', this.checkLoginFlow.bind(this)),
      await this.checkCriticalFlow(page, 'FUR4 Checkout Flow', 'https://fur4.com/', this.checkCheckoutFlow.bind(this)),
      await this.checkCriticalFlow(page, 'Referral Homepage', 'https://refer.fur4.com/', async (p) => {
        const title = await p.title();
        return { title, loaded: title.length > 0 };
      }),
      await this.checkCriticalFlow(page, 'Referral Claim Flow', 'https://refer.fur4.com/', this.checkReferralFlow.bind(this)),
      await this.checkCriticalFlow(page, 'API Integrations', 'https://fur4.com/', this.checkAPIIntegrations.bind(this))
    ];

    await page.close();

    const summary = {
      total: checks.length,
      passed: checks.filter(c => c.status === 'pass').length,
      failed: checks.filter(c => c.status === 'fail').length,
      warnings: checks.filter(c => c.status === 'warning').length
    };

    const status = summary.failed > 0 ? 'critical' : summary.warnings > 0 ? 'warning' : 'healthy';

    return {
      timestamp: new Date().toISOString(),
      status,
      checks,
      summary
    };
  }

  async sendAlert(result: MonitoringResult) {
    if (!this.webhookUrl) {
      console.log('⚠️  No Teams webhook URL configured, skipping alert');
      return;
    }

    const color = result.status === 'critical' ? '#ff0000' : result.status === 'warning' ? '#ffa500' : '#00ff00';
    const emoji = result.status === 'critical' ? '🚨' : result.status === 'warning' ? '⚠️' : '✅';

    const criticalFailures = result.checks.filter(c => c.status === 'fail' && 
      (c.name.includes('Login') || c.name.includes('Checkout') || c.name.includes('Payment') || c.name.includes('API')));

    const message = {
      "@type": "MessageCard",
      "@context": "http://schema.org/extensions",
      "themeColor": color,
      "summary": `${emoji} FUR4 Real-Time Monitor - ${result.status.toUpperCase()}`,
      "sections": [
        {
          "activityTitle": `${emoji} FUR4 Real-Time Monitoring Alert`,
          "activitySubtitle": `Status: ${result.status.toUpperCase()} | ${result.timestamp}`,
          "activityImage": "https://playwright.dev/img/playwright-logo.svg",
          "facts": [
            {
              "name": "📊 Overall Status",
              "value": `${result.status.toUpperCase()}`
            },
            {
              "name": "✅ Passed",
              "value": `${result.summary.passed}/${result.summary.total}`
            },
            {
              "name": "❌ Failed",
              "value": `${result.summary.failed}/${result.summary.total}`
            },
            {
              "name": "⚠️ Warnings",
              "value": `${result.summary.warnings}/${result.summary.total}`
            }
          ],
          "markdown": true
        }
      ]
    };

    // Add critical failures section
    if (criticalFailures.length > 0) {
      const criticalSection = {
        "activityTitle": "🚨 CRITICAL FAILURES - IMMEDIATE ACTION REQUIRED",
        "activitySubtitle": `${criticalFailures.length} critical flows broken`,
        "activityImage": "https://playwright.dev/img/playwright-logo.svg",
        "facts": criticalFailures.map(f => ({
          "name": `❌ ${f.name}`,
          "value": f.error || 'Unknown error'
        })),
        "markdown": true
      };
      message.sections.push(criticalSection);
    }

    // Add all failures section
    const allFailures = result.checks.filter(c => c.status === 'fail');
    if (allFailures.length > 0) {
      const failuresSection = {
        "activityTitle": "📋 All Failed Checks",
        "activitySubtitle": `${allFailures.length} total failures`,
        "activityImage": "https://playwright.dev/img/playwright-logo.svg",
        "facts": allFailures.slice(0, 5).map(f => ({
          "name": `❌ ${f.name}`,
          "value": f.error || 'Unknown error'
        })),
        "markdown": true
      };
      message.sections.push(failuresSection);
    }

    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
      
      if (response.ok) {
        console.log('✅ Real-time alert sent successfully');
      } else {
        console.error('❌ Failed to send real-time alert:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('❌ Error sending real-time alert:', error);
    }
  }

  async runContinuousMonitoring(intervalMinutes: number = 5) {
    console.log(`🚀 Starting continuous monitoring with ${intervalMinutes}-minute intervals`);
    
    while (true) {
      try {
        console.log(`\n🔄 Running monitoring cycle at ${new Date().toISOString()}`);
        const result = await this.runMonitoringCycle();
        
        console.log(`📊 Monitoring Results: ${result.status.toUpperCase()}`);
        console.log(`   Passed: ${result.summary.passed}/${result.summary.total}`);
        console.log(`   Failed: ${result.summary.failed}/${result.summary.total}`);
        console.log(`   Warnings: ${result.summary.warnings}/${result.summary.total}`);
        
        // Send alert if there are failures or warnings
        if (result.status !== 'healthy') {
          await this.sendAlert(result);
        }
        
        // Wait for next cycle
        console.log(`⏰ Waiting ${intervalMinutes} minutes until next cycle...`);
        await new Promise(resolve => setTimeout(resolve, intervalMinutes * 60 * 1000));
        
      } catch (error) {
        console.error('❌ Monitoring cycle failed:', error);
        
        // Send error alert
        const errorResult: MonitoringResult = {
          timestamp: new Date().toISOString(),
          status: 'critical',
          checks: [{
            name: 'Monitoring System',
            status: 'fail',
            duration: 0,
            error: error instanceof Error ? error.message : String(error)
          }],
          summary: { total: 1, passed: 0, failed: 1, warnings: 0 }
        };
        
        await this.sendAlert(errorResult);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 60000)); // 1 minute
      }
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const interval = parseInt(args[1]) || 5;

  const monitor = new RealTimeMonitor();
  
  try {
    await monitor.initialize();
    
    if (command === 'continuous') {
      await monitor.runContinuousMonitoring(interval);
    } else if (command === 'single') {
      const result = await monitor.runMonitoringCycle();
      console.log('📊 Single monitoring cycle results:', JSON.stringify(result, null, 2));
      
      if (result.status !== 'healthy') {
        await monitor.sendAlert(result);
      }
    } else {
      console.log('Usage:');
      console.log('  npm run monitor:single    - Run single monitoring cycle');
      console.log('  npm run monitor:continuous [interval] - Run continuous monitoring (default: 5 minutes)');
    }
  } finally {
    await monitor.cleanup();
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { RealTimeMonitor }; 