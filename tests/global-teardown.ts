import { FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

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

async function sendTeamsNotification(results: any, config: FullConfig) {
  const webhookUrl = process.env.TEAMS_WEBHOOK_URL;
  console.log('DEBUG: Entered sendTeamsNotification, webhook:', webhookUrl);
  if (!webhookUrl) {
    console.log('⚠️  No Teams webhook URL configured, skipping notification');
    return;
  }

  const totalTests = results.stats.total;
  const passedTests = results.stats.passed;
  const failedTests = results.stats.failed;
  const skippedTests = results.stats.skipped;
  
  const testRunId = process.env.TEST_RUN_ID || 'unknown';
  const startTime = process.env.TEST_START_TIME || new Date().toISOString();
  const endTime = new Date().toISOString();
  
  // Calculate duration
  const start = new Date(startTime);
  const end = new Date(endTime);
  const duration = Math.round((end.getTime() - start.getTime()) / 1000);
  
  // Determine status and color
  const status = failedTests > 0 ? '❌ FAILED' : '✅ PASSED';
  const color = failedTests > 0 ? '#ff0000' : '#00ff00';
  
  // Analyze failures for proactive alerts
  const failedTestsWithAnalysis = results.suites
    ?.flatMap((suite: any) => suite.specs)
    ?.flatMap((spec: any) => spec.tests)
    ?.filter((test: any) => test.results?.[0]?.status === 'failed')
    ?.map((test: any) => {
      const analysis = analyzeFailure(test.title, test.results[0].error?.message || 'Unknown error');
      return {
        title: test.title,
        error: test.results[0].error?.message || 'Unknown error',
        analysis
      };
    })
    ?.sort((a: any, b: any) => {
      const priority = { critical: 4, high: 3, medium: 2, low: 1 };
      return priority[b.analysis.category] - priority[a.analysis.category];
    }) || [];
  
  // Group failures by category
  const criticalFailures = failedTestsWithAnalysis.filter((f: any) => f.analysis.category === 'critical');
  const highFailures = failedTestsWithAnalysis.filter((f: any) => f.analysis.category === 'high');
  const mediumFailures = failedTestsWithAnalysis.filter((f: any) => f.analysis.category === 'medium');
  
  const message = {
    "@type": "MessageCard",
    "@context": "http://schema.org/extensions",
    "themeColor": color,
    "summary": `FUR4 Test Results - ${status}`,
    "sections": [
      {
        "activityTitle": `🚨 FUR4 Automated Test Suite - ${status}`,
        "activitySubtitle": `Test Run ID: ${testRunId}`,
        "activityImage": "https://playwright.dev/img/playwright-logo.svg",
        "facts": [
          {
            "name": "📊 Test Results",
            "value": `Passed: ${passedTests} | Failed: ${failedTests} | Skipped: ${skippedTests}`
          },
          {
            "name": "⏱️ Duration",
            "value": `${duration} seconds`
          },
          {
            "name": "🕐 Start Time",
            "value": new Date(startTime).toLocaleString()
          },
          {
            "name": "🕐 End Time",
            "value": new Date(endTime).toLocaleString()
          }
        ],
        "markdown": true
      }
    ],
    "potentialAction": [
      {
        "@type": "OpenUri",
        "name": "View HTML Report",
        "targets": [
          {
            "os": "default",
            "uri": "file://" + path.resolve(process.cwd(), 'playwright-report/index.html')
          }
        ]
      }
    ]
  };
  
  // Add critical failures section
  if (criticalFailures.length > 0) {
    const criticalSection = {
      "activityTitle": "🚨 CRITICAL FAILURES - IMMEDIATE ACTION REQUIRED",
      "activitySubtitle": `${criticalFailures.length} critical issues detected`,
      "activityImage": "https://playwright.dev/img/playwright-logo.svg",
      "facts": criticalFailures.slice(0, 3).map((f: any) => ({
        "name": `❌ ${f.analysis.description}`,
        "value": `Impact: ${f.analysis.impact}\nRecommendation: ${f.analysis.recommendation}`
      })),
      "markdown": true
    };
    message.sections.push(criticalSection);
  }
  
  // Add high priority failures section
  if (highFailures.length > 0) {
    const highSection = {
      "activityTitle": "⚠️ HIGH PRIORITY FAILURES",
      "activitySubtitle": `${highFailures.length} high priority issues detected`,
      "activityImage": "https://playwright.dev/img/playwright-logo.svg",
      "facts": highFailures.slice(0, 3).map((f: any) => ({
        "name": `⚠️ ${f.analysis.description}`,
        "value": `Impact: ${f.analysis.impact}\nRecommendation: ${f.analysis.recommendation}`
      })),
      "markdown": true
    };
    message.sections.push(highSection);
  }
  
  // Add medium priority failures section
  if (mediumFailures.length > 0) {
    const mediumSection = {
      "activityTitle": "📋 MEDIUM PRIORITY ISSUES",
      "activitySubtitle": `${mediumFailures.length} medium priority issues detected`,
      "activityImage": "https://playwright.dev/img/playwright-logo.svg",
      "facts": mediumFailures.slice(0, 3).map((f: any) => ({
        "name": `📋 ${f.analysis.description}`,
        "value": `Impact: ${f.analysis.impact}\nRecommendation: ${f.analysis.recommendation}`
      })),
      "markdown": true
    };
    message.sections.push(mediumSection);
  }
  
  // Add proactive monitoring insights
  if (failedTests > 0) {
    const insightsSection = {
      "activityTitle": "🔍 PROACTIVE MONITORING INSIGHTS",
      "activitySubtitle": "Key areas requiring attention",
      "activityImage": "https://playwright.dev/img/playwright-logo.svg",
      "facts": [
        {
          "name": "💰 Revenue Impact",
          "value": criticalFailures.length > 0 ? "CRITICAL - Immediate revenue impact detected" : "Monitor closely"
        },
        {
          "name": "👥 User Experience",
          "value": highFailures.length > 0 ? "DEGRADED - User flows affected" : "Good"
        },
        {
          "name": "🔧 System Health",
          "value": failedTests > 3 ? "POOR - Multiple system issues" : "Stable"
        }
      ],
      "markdown": true
    };
    message.sections.push(insightsSection);
  }
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
    
    if (response.ok) {
      console.log('✅ Enhanced Teams notification sent successfully');
    } else {
      console.error('❌ Failed to send Teams notification:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('❌ Error sending Teams notification:', error);
  }
}

async function globalTeardown(config: FullConfig) {
  console.log('🏁 Test suite completed, processing results...');
  
  // Read test results from JSON file
  let resultsPath = path.join(process.cwd(), 'test-results', 'results.json');
  if (!fs.existsSync(resultsPath)) {
    // Fallback to playwright-report/results.json if not found in test-results
    resultsPath = path.join(process.cwd(), 'playwright-report', 'results.json');
    console.log('DEBUG: test-results/results.json not found, trying playwright-report/results.json');
  }
  if (!fs.existsSync(resultsPath)) {
    // Fallback to test-results/report.json (Playwright default for --output)
    resultsPath = path.join(process.cwd(), 'test-results', 'report.json');
    console.log('DEBUG: playwright-report/results.json not found, trying test-results/report.json');
  }
  console.log('DEBUG: Looking for test results at', resultsPath);
  let testResults = null;
  
  try {
    if (fs.existsSync(resultsPath)) {
      const resultsData = fs.readFileSync(resultsPath, 'utf8');
      testResults = JSON.parse(resultsData);
      console.log('DEBUG: Test results loaded:', testResults);
    } else {
      console.log('DEBUG: Test results file does not exist.');
    }
  } catch (error) {
    console.error('❌ Error reading test results:', error);
  }
  
  // Send enhanced Teams notification
  if (testResults) {
    console.log('DEBUG: Calling sendTeamsNotification...');
    await sendTeamsNotification(testResults, config);
  } else {
    console.log('DEBUG: No test results to send.');
  }
  
  // Print summary
  console.log('📊 Test Summary:');
  console.log(`   Duration: ${Math.round((Date.now() - new Date(process.env.TEST_START_TIME || Date.now()).getTime()) / 1000)}s`);
  
  console.log('✅ Enhanced global teardown completed');
}

export default globalTeardown; 