import { FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
dotenv.config();
// Removed teamsMessage import - using inline function instead

console.log('DEBUG: global-teardown.ts started');

interface TestResult {
  status: 'passed' | 'failed' | 'skipped';
  title: string;
  duration: number;
  error?: string;
}

interface FailureAnalysis {
  category: 'critical' | 'high' | 'medium' | 'low';
  type: 'flow' | 'ui' | 'api' | 'integration' | 'content';
  description: string;
  impact: string;
  recommendation: string;
}

function analyzeFailure(testTitle: string, errorMessage: string): FailureAnalysis {
  const title = testTitle.toLowerCase();
  const error = errorMessage.toLowerCase();
  
  // Critical flow failures
  if (title.includes('checkout') || title.includes('payment') || title.includes('stripe')) {
    return {
      category: 'critical',
      type: 'flow',
      description: 'Checkout/Payment flow failure',
      impact: 'Users cannot complete purchases - immediate revenue impact',
      recommendation: 'Check Stripe integration, payment processing, and checkout flow immediately'
    };
  }
  
  if (title.includes('login') || title.includes('auth')) {
    return {
      category: 'critical',
      type: 'flow',
      description: 'Authentication flow failure',
      impact: 'Users cannot access accounts - complete service disruption',
      recommendation: 'Check authentication providers, session management, and login endpoints'
    };
  }
  
  if (title.includes('referral') || title.includes('claim')) {
    return {
      category: 'critical',
      type: 'flow',
      description: 'Referral tracking/claiming failure',
      impact: 'Referral program broken - marketing and user acquisition affected',
      recommendation: 'Check referral tracking system, database connections, and claim processing'
    };
  }
  
  // API integration failures
  if (error.includes('stripe') || error.includes('payment')) {
    return {
      category: 'critical',
      type: 'api',
      description: 'Stripe API failure',
      impact: 'Payment processing down - immediate revenue impact',
      recommendation: 'Check Stripe API status, webhook configurations, and payment endpoints'
    };
  }
  
  if (error.includes('twilio') || error.includes('sms') || error.includes('phone')) {
    return {
      category: 'high',
      type: 'api',
      description: 'Twilio SMS/Phone API failure',
      impact: 'SMS notifications and phone verification down',
      recommendation: 'Check Twilio API status, phone number configurations, and SMS delivery'
    };
  }
  
  if (error.includes('sendgrid') || error.includes('email') || error.includes('mail')) {
    return {
      category: 'high',
      type: 'api',
      description: 'SendGrid Email API failure',
      impact: 'Email notifications and marketing emails not sending',
      recommendation: 'Check SendGrid API status, email templates, and delivery configurations'
    };
  }
  
  // UI element failures
  if (title.includes('cta') || title.includes('button') || title.includes('form')) {
    return {
      category: 'high',
      type: 'ui',
      description: 'Critical UI element missing',
      impact: 'User conversion flows broken - potential revenue loss',
      recommendation: 'Check UI rendering, CSS loading, and JavaScript functionality'
    };
  }
  
  if (title.includes('image') || title.includes('loading')) {
    return {
      category: 'medium',
      type: 'ui',
      description: 'UI rendering issue',
      impact: 'Poor user experience - potential conversion impact',
      recommendation: 'Check image CDN, loading states, and frontend performance'
    };
  }
  
  // Content failures
  if (title.includes('content') || title.includes('404') || error.includes('not found')) {
    return {
      category: 'medium',
      type: 'content',
      description: 'Content loading failure',
      impact: 'Users see broken pages - poor user experience',
      recommendation: 'Check content delivery, CDN status, and page routing'
    };
  }
  
  // Default analysis
  return {
    category: 'low',
    type: 'integration',
    description: 'General test failure',
    impact: 'Unknown impact - requires investigation',
    recommendation: 'Review test logs and investigate root cause'
  };
}

// Helper to collect all tests from nested suites
function collectAllTests(suites: any[]): any[] {
  let tests: any[] = [];
  for (const suite of suites) {
    if (suite.specs && suite.specs.length > 0) {
      for (const spec of suite.specs) {
        if (spec.tests) {
          tests = tests.concat(spec.tests);
        }
      }
    }
    if (suite.suites && suite.suites.length > 0) {
      tests = tests.concat(collectAllTests(suite.suites));
    }
  }
  return tests;
}

async function sendTeamsNotification(results: any, config: FullConfig) {
  try {
    const webhookUrl = process.env.TEAMS_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error('ERROR: TEAMS_WEBHOOK_URL not set');
      return;
    }
    // Fix stats extraction for Playwright JSON structure
    const totalTests = results.stats.expected;
    const failedTests = results.stats.unexpected;
    const skippedTests = results.stats.skipped;
    const passedTests = totalTests - failedTests - skippedTests;
    const testRunId = process.env.TEST_RUN_ID || 'unknown';
    const startTime = process.env.TEST_START_TIME || new Date().toISOString();
    const endTime = new Date().toISOString();
    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = Math.round((end.getTime() - start.getTime()) / 1000);
    const status = failedTests > 0 ? '❌ FAILED' : '✅ PASSED';
    const color = failedTests > 0 ? '#ff0000' : '#00ff00';
    // S3 report link
    const reportUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_S3_REPORT_PREFIX}/index.html`;
    // Collect failed test details using recursive test collection
    const allTests = collectAllTests(results.suites || []);
    const failedDetails = allTests
      .filter((test: any) => test.results?.[0]?.status === 'failed')
      .map((test: any) => `**${test.title}**\nError: ${test.results[0].error?.message || 'Unknown error'}`)
      .join('\n\n') || '';
    // Teams message card
    const message = {
      "@type": "MessageCard",
      "@context": "http://schema.org/extensions",
      "themeColor": color,
      "summary": `FUR4 Test Results - ${status}`,
      "title": `FUR4 Automated Test Suite - ${status}`,
      "sections": [
        {
          "activityTitle": `FUR4 Test Run - ${status}`,
          "activitySubtitle": `Test Run ID: ${testRunId}`,
          "facts": [
            { "name": "📊 Test Results", "value": `Passed: ${passedTests} | Failed: ${failedTests} | Skipped: ${skippedTests}` },
            { "name": "⏱️ Duration", "value": `${duration} seconds` },
            { "name": "🕐 Start Time", "value": new Date(startTime).toLocaleString() },
            { "name": "🕐 End Time", "value": new Date(endTime).toLocaleString() },
            { "name": "🔗 HTML Report", "value": `[View Latest Test Report](${reportUrl})` }
          ],
          "markdown": true
        },
        failedTests > 0 ? {
          "activityTitle": "❌ Failed Tests",
          "text": failedDetails || 'No details',
          "markdown": true
        } : null
      ].filter(Boolean),
      "potentialAction": [
        {
          "@type": "OpenUri",
          "name": failedTests > 0 ? "🔴 View Latest Test Report" : "🟢 View Latest Test Report",
          "targets": [
            { "os": "default", "uri": reportUrl }
          ]
        }
      ]
    };
    // Send to Teams
    const fetchFn: any = typeof fetch === 'function'
      ? fetch
      : (...args: any[]) => import('node-fetch').then(({default: fetch}) => (fetch as any)(...args));
    const response = await fetchFn(webhookUrl, {
      method: 'POST',
      body: JSON.stringify(message),
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('Teams response status:', response.status);
    let responseText = '';
    try { responseText = await response.text(); } catch {}
    console.log('Teams response body:', responseText);
    if (response.ok) {
      console.log('Teams notification sent successfully.');
    } else {
      console.log('Teams notification failed to send.');
    }
  } catch (err) {
    console.error('ERROR in sendTeamsNotification:', err);
  }
}

async function waitForFileWithValidJson(filePath: string, retries = 10, delayMs = 500): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content && content.trim().length > 0) {
          JSON.parse(content); // will throw if not valid JSON
          return true;
        }
      } catch (e) {
        console.log(`DEBUG: File exists but not valid JSON yet (attempt ${i+1})`);
      }
    }
    await new Promise(res => setTimeout(res, delayMs));
  }
  return false;
}

// Inline Teams message generator (replacing deleted teamsMessage.ts)
function generateTeamsMessage({
  env = 'N/A',
  total = 0,
  passed = 0,
  failed = 0,
  skipped = 0,
  duration = 'N/A',
  htmlUrl = '#',
  // allureUrl = '#',
  date,
  time
}: {
  env: string;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: string;
  htmlUrl: string;
  // allureUrl: string;
  date?: string;
  time?: string;
}): string {
  const passPercent = total > 0 ? ((passed / total) * 100).toFixed(1) : 'N/A';
  const now = new Date();
  const dateStr = date || now.toISOString().slice(0, 10);
  const timeStr = time || now.toTimeString().slice(0, 5);
  const isPassed = failed === 0 && passed > 0;
  const statusLine = isPassed ? '🟢 **All Playwright Tests Passed!**' : '🔴 **Some Playwright Tests Failed!**';
  const statsLine = `✅ **Passed:** ${passed}\n❌ **Failed:** ${failed}\n⏭️ **Skipped:** ${skipped}\n🧮 **Total:** ${total}`;
  const durationLine = `⏱️ **Duration:** ${duration}\n📊 **Pass %:** ${passPercent}%`;
  const envLine = `🌐 **Env:** ${env}\n📅 **Date:** ${dateStr}, ${timeStr}`;
  const htmlLine = htmlUrl && htmlUrl !== '#' ? '🔎 [**View HTML Report**](' + htmlUrl + ')' : '🔎 **HTML Report unavailable**';
  // const allureLine = allureUrl && allureUrl !== '#' ? '📊 [**View Allure Report**](' + allureUrl + ')' : '';
  return [
    statusLine,
    '',
    statsLine,
    durationLine,
    envLine,
    '',
    htmlLine,
    // allureLine
  ].filter(Boolean).join('\n\n');
}

async function globalTeardown(config: FullConfig) {
  console.log('DEBUG: globalTeardown called');
  // Robustly find the JSON report
  const possiblePaths = [
    path.join(process.cwd(), 'test-results', 'playwright-report.json'),
    path.join(process.cwd(), 'test-results', 'results.json'),
    path.join(process.cwd(), 'playwright-report', 'results.json'),
    path.join(process.cwd(), 'test-results', 'report.json'),
  ];
  let testResults = null;
  let foundPath = '';
  for (const p of possiblePaths) {
    try {
      if (await waitForFileWithValidJson(p)) {
        const resultsData = fs.readFileSync(p, 'utf8');
        testResults = JSON.parse(resultsData);
        foundPath = p;
        break;
      }
    } catch (error) {
      console.error('ERROR reading test results at', p, error);
    }
  }

  // Wait for Allure report upload (assume index.html is the marker)
  // const allureReportPath = path.join(process.cwd(), 'allure-report', 'index.html');
  // await waitForFileWithValidJson(allureReportPath, 10, 500);

  // S3 URLs
  const htmlUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_S3_REPORT_PREFIX}/index.html`;
  // const allureUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_S3_ALLURE_PREFIX}/index.html`;
  const env = process.env.TEST_ENV || 'Production';

  // Parse test results for metrics
  let total = 0, passed = 0, failed = 0, skipped = 0, duration = 'N/A';
  if (testResults && testResults.suites) {
    // Recursively collect all tests
    function collectAllTests(suites: any[]): any[] {
      let tests: any[] = [];
      for (const suite of suites) {
        if (suite.specs && suite.specs.length > 0) {
          for (const spec of suite.specs) {
            if (spec.tests) {
              tests = tests.concat(spec.tests);
            }
          }
        }
        if (suite.suites && suite.suites.length > 0) {
          tests = tests.concat(collectAllTests(suite.suites));
        }
      }
      return tests;
    }
    const allTests = collectAllTests(testResults.suites);
    total = allTests.length;
    passed = allTests.filter((t: any) => t.results?.[0]?.status === 'passed').length;
    failed = allTests.filter((t: any) => t.results?.[0]?.status === 'failed').length;
    skipped = allTests.filter((t: any) => t.results?.[0]?.status === 'skipped').length;
    // Duration (sum of all test durations in seconds)
    const totalMs = allTests.reduce((sum: number, t: any) => sum + (t.results?.[0]?.duration || 0), 0);
    duration = totalMs > 0 ? `${Math.floor(totalMs / 60000)}m ${Math.round((totalMs % 60000) / 1000)}s` : 'N/A';
  }
  // Date/time
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const time = now.toTimeString().slice(0, 5);

  // Generate Teams message
  const teamsMsg = generateTeamsMessage({
    env,
    total,
    passed,
    failed,
    skipped,
    duration,
    htmlUrl,
    // allureUrl,
    date,
    time
  });

  // Teams notification is now handled by notifyTeams.ts script
  // This prevents duplicate notifications when using test:complete or test:ci scripts
  console.log('📢 Teams notification will be handled by the notifyTeams.ts script');
  
  // Uncomment below if you want global teardown to also send Teams notifications
  /*
  const webhookUrl = process.env.TEAMS_WEBHOOK_URL;
  if (webhookUrl) {
    const fetchFn: any = typeof fetch === 'function'
      ? fetch
      : (...args: any[]) => import('node-fetch').then(({default: fetch}) => (fetch as any)(...args));
    const message = {
      '@type': 'MessageCard',
      '@context': 'http://schema.org/extensions',
      'text': teamsMsg
    };
    try {
      const response = await fetchFn(webhookUrl, {
        method: 'POST',
        body: JSON.stringify(message),
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Teams response status:', response.status);
      let responseText = '';
      try { responseText = await response.text(); } catch {}
      console.log('Teams response body:', responseText);
      if (response.ok) {
        console.log('Teams notification sent successfully.');
      } else {
        console.log('Teams notification failed to send.');
      }
    } catch (err) {
      console.error('ERROR posting to Teams:', err);
    }
  } else {
    console.error('ERROR: TEAMS_WEBHOOK_URL not set');
  }
  */

  // Print summary
  console.log('📊 Test Summary:');
  console.log(`   Duration: ${Math.round((Date.now() - new Date(process.env.TEST_START_TIME || Date.now()).getTime()) / 1000)}s`);
  console.log('✅ Enhanced global teardown completed');
}

export default globalTeardown; 