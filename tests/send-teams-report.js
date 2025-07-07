const fs = require('fs');
const path = require('path');
require('dotenv').config();

const jsonReportPath = path.join(process.cwd(), 'test-results', 'playwright-report.json');
let report;
try {
  report = JSON.parse(fs.readFileSync(jsonReportPath, 'utf-8'));
} catch (e) {
  console.error('❌ Could not read Playwright JSON report:', e);
  process.exit(1);
}

// Collect all test results
const allTests = [];
function collect(suites) {
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
allTests.forEach(t => {
  if (t.status === 'passed') counts.passed++;
  if (t.status === 'failed') counts.failed++;
  if (t.status === 'skipped') counts.skipped++;
});

const failedTests = allTests.filter(t => t.status === 'failed');
const passedTests = allTests.filter(t => t.status === 'passed');

let messageText = `**Test Results**\n- Passed: ${counts.passed}\n- Failed: ${counts.failed}\n- Skipped: ${counts.skipped}\n`;

if (failedTests.length > 0) {
  messageText += `\n**❌ Failed Tests:**\n`;
  messageText += failedTests.map(f => {
    let msg = `**${f.title}**\nFile: ${f.file}:${f.line}\nError: ${f.error}`;
    const screenshots = (f.attachments || []).filter(a => a.name && a.name.toLowerCase().includes('screenshot') && a.path);
    const logs = (f.attachments || []).filter(a => a.name && a.name.toLowerCase().includes('log') && a.path);
    if (screenshots.length > 0) {
      msg += `\nScreenshots: ${screenshots.map(s => `[${path.basename(s.path)}](${s.path})`).join(', ')}`;
    }
    if (logs.length > 0) {
      msg += `\nLogs: ${logs.map(l => `[${path.basename(l.path)}](${l.path})`).join(', ')}`;
    }
    return msg;
  }).join('\n\n');
} else {
  messageText += `\n✅ All tests passed!`;
}

if (passedTests.length > 0) {
  messageText += `\n\n**✅ Passed Tests:**\n`;
  messageText += passedTests.map(f => {
    let msg = `**${f.title}**\nFile: ${f.file}:${f.line}`;
    return msg;
  }).join('\n\n');
}

// Add HTML report link if available
let htmlReportPath = path.join(process.cwd(), 'playwright-report', 'index.html');
let htmlReportLink = '';
if (fs.existsSync(htmlReportPath)) {
  htmlReportLink = `\n\n[View HTML Report](${htmlReportPath})`;
}

const message = {
  "@type": "MessageCard",
  "@context": "http://schema.org/extensions",
  "themeColor": failedTests.length > 0 ? "FF0000" : "00FF00",
  "summary": failedTests.length > 0 ? "Playwright Test Failures" : "Playwright All Tests Passed",
  "title": failedTests.length > 0 ? "Playwright Test Failures" : "Playwright All Tests Passed",
  "text": messageText + htmlReportLink,
};

// Use global fetch if available, otherwise fallback to node-fetch
let fetchFn = typeof fetch === 'function'
  ? fetch
  : (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const webhookUrl = process.env.TEAMS_WEBHOOK_URL;
if (!webhookUrl) {
  console.log('⚠️  No Teams webhook URL configured, skipping notification');
  process.exit(0);
}

(async () => {
  try {
    console.log('DEBUG: Sending Teams notification...');
    const response = await fetchFn(webhookUrl, {
      method: 'POST',
      body: JSON.stringify(message),
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('DEBUG: Teams response status:', response.status);
    if (response.ok) {
      console.log('✅ Teams notification sent successfully');
    } else {
      console.error('❌ Failed to send Teams notification:', response.status, response.statusText);
      const text = await response.text();
      console.error('❌ Teams response body:', text);
    }
  } catch (error) {
    console.error('❌ Error sending Teams notification:', error);
  }
})(); 