import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const possibleReportPaths = [
  path.join(process.cwd(), 'playwright-report.json'),
  path.join(process.cwd(), 'test-results', 'playwright-report.json'),
  path.join(process.cwd(), 'test-results', 'results.json'),
  path.join(process.cwd(), 'playwright-report', 'report.json'),
];
let report;
let foundPath = '';
for (const p of possibleReportPaths) {
  try {
    if (fs.existsSync(p)) {
      report = JSON.parse(fs.readFileSync(p, 'utf-8'));
      foundPath = p;
      break;
    }
  } catch (e) {
    // continue
  }
}
console.log('DEBUG: Attempted report paths:', possibleReportPaths);
if (foundPath) {
  console.log('DEBUG: Loaded report from', foundPath);
} else {
  console.error('ERROR: No Playwright JSON report found in any known location.');
  process.exit(1);
}

// Collect all test results
const allTests: Array<{
  title: string;
  file: string;
  line: number;
  status: string;
  error: string;
  attachments: any[];
}> = [];
function collect(suites: any[]) {
  if (!suites) return;
  for (const suite of suites) {
    if (suite.suites) collect(suite.suites);
    if (suite.specs) {
      for (const spec of suite.specs) {
        for (const test of spec.tests) {
          for (const result of test.results) {
            allTests.push({
              title: spec.title,
              file: spec.file,
              line: spec.line,
              status: result.status,
              error: result.error?.message || '',
              attachments: result.attachments || []
            });
          }
        }
      }
    }
  }
}
collect(report.suites);

const counts = { passed: 0, failed: 0, skipped: 0 };
allTests.forEach((t) => {
  if (t.status === 'passed') counts.passed++;
  else if (t.status === 'skipped') counts.skipped++;
  else counts.failed++;
});

const failedTests = allTests.filter((t) => t.status !== 'passed' && t.status !== 'skipped');
const passedTests = allTests.filter((t) => t.status === 'passed');

// S3 URL helpers
const reportUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_S3_REPORT_PREFIX}/index.html`;
const screenshotUrl = (filename: string) =>
  `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_S3_SCREENSHOT_PREFIX}/${filename}`;

// Add HTML report link at the top
let htmlReportLink = `[View HTML Report](${reportUrl})\n\n`;

let messageText = htmlReportLink + `**Test Results**\n- Passed: ${counts.passed}\n- Failed: ${counts.failed}\n- Skipped: ${counts.skipped}\n`;

if (failedTests.length > 0) {
  messageText += `\n**❌ Failed Tests:**\n`;
  messageText += failedTests.map((f) => {
    let msg = `---\n**${f.title}**\nFile: \`${f.file}:${f.line}\`\nStatus: \`${f.status}\`\n**Error:** \`${f.error}\``;
    const screenshots = (f.attachments || []).filter((a: any) => a.name && a.name.toLowerCase().includes('screenshot') && a.path);
    if (screenshots.length > 0) {
      // msg += `\n**Screenshots:** ${screenshots.map((s: any) => `[${path.basename(s.path)}](${screenshotUrl(path.basename(s.path))})`).join(', ')}`;
    }
    return msg;
  }).join('\n\n');
} else {
  messageText += `\n✅ All tests passed!`;
}

// In Teams message, add a visually clear button for the report:
const message = {
  "@type": "MessageCard",
  "@context": "http://schema.org/extensions",
  "themeColor": failedTests.length > 0 ? "FF0000" : "00FF00",
  "summary": failedTests.length > 0 ? "Playwright Test Failures" : "Playwright All Tests Passed",
  "title": failedTests.length > 0 ? "Playwright Test Failures" : "Playwright All Tests Passed",
  "text": messageText,
  "potentialAction": [
    {
      "@type": "OpenUri",
      "name": failedTests.length > 0 ? "🔴 View Latest Test Report" : "🟢 View Latest Test Report",
      "targets": [
        { "os": "default", "uri": reportUrl }
      ]
    }
  ]
};

// Use global fetch if available, otherwise fallback to node-fetch
let fetchFn: any = typeof fetch === 'function'
  ? fetch
  : (...args: any[]) => import('node-fetch').then(({default: fetch}) => (fetch as any)(...args));

const webhookUrl = process.env.TEAMS_WEBHOOK_URL;
console.log('DEBUG: TEAMS_WEBHOOK_URL is', webhookUrl ? webhookUrl.slice(0, 30) + '...' : 'NOT SET');
if (!webhookUrl) {
  console.log('⚠️  No Teams webhook URL configured, skipping notification');
  process.exit(0);
}

(async () => {
  try {
    const response = await fetchFn(webhookUrl, {
      method: 'POST',
      body: JSON.stringify(message),
      headers: { 'Content-Type': 'application/json' }
    });
    if (response.ok) {
    } else {
      const text = await response.text();
    }
  } catch (error) {
  }
})();