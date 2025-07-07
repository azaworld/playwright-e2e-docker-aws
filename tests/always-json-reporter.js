const fs = require('fs');
const path = require('path');
require('dotenv').config();

class AlwaysJsonReporter {
  constructor(options) {
    this.options = options;
  }

  async onEnd(result) {
    // Debug: inspect the result object structure
    console.log('DEBUG: result object keys:', Object.keys(result));
    console.log('DEBUG: result.suites:', JSON.stringify(result.suites, null, 2));

    // Write the full result object to a known location
    const outputDir = path.join(process.cwd(), 'test-results');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    const outputFile = path.join(outputDir, 'results.json');
    fs.writeFileSync(outputFile, JSON.stringify(result, null, 2), 'utf-8');
    console.log('✅ [AlwaysJsonReporter] Wrote test results to', outputFile);

    // Teams webhook
    const webhookUrl = process.env.TEAMS_WEBHOOK_URL;
    console.log('DEBUG: Using webhook URL:', webhookUrl);
    if (!webhookUrl) {
      console.log('⚠️  No Teams webhook URL configured, skipping notification');
      return;
    }

    // Helper to collect all test results
    function collectAllTests(suites, arr = []) {
      if (!suites) return arr;
      if (Array.isArray(suites)) {
        suites.forEach(suite => collectAllTests(suite, arr));
        return arr;
      }
      if (suites.specs) {
        suites.specs.forEach(spec => {
          spec.tests.forEach(test => {
            test.results.forEach(result => {
              arr.push({
                title: spec.title,
                status: result.status,
                error: result.error?.message || '',
                file: spec.file || '',
                line: spec.line || '',
                attachments: result.attachments || []
              });
            });
          });
        });
      }
      if (suites.suites) collectAllTests(suites.suites, arr);
      return arr;
    }

    const allTests = collectAllTests(result.suites);
    const counts = { passed: 0, failed: 0, skipped: 0 };
    allTests.forEach(t => {
      if (t.status === 'passed') counts.passed++;
      if (t.status === 'failed') counts.failed++;
      if (t.status === 'skipped') counts.skipped++;
    });

    const failedTests = allTests.filter(t => t.status === 'failed');
    const passedTests = allTests.filter(t => t.status === 'passed');

    // Build the message
    let messageText = `**Test Results**\n- Passed: ${counts.passed}\n- Failed: ${counts.failed}\n- Skipped: ${counts.skipped}\n`;

    if (failedTests.length > 0) {
      messageText += `\n**❌ Failed Tests:**\n`;
      messageText += failedTests.map(f => {
        let msg = `**${f.title}**\nFile: ${f.file}:${f.line}\nError: ${f.error}`;
        // Separate screenshots and logs
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

    const message = {
      "@type": "MessageCard",
      "@context": "http://schema.org/extensions",
      "themeColor": failedTests.length > 0 ? "FF0000" : "00FF00",
      "summary": failedTests.length > 0 ? "Playwright Test Failures" : "Playwright All Tests Passed",
      "title": failedTests.length > 0 ? "Playwright Test Failures" : "Playwright All Tests Passed",
      "text": messageText,
    };

    // Use global fetch if available, otherwise fallback to node-fetch
    let fetchFn = typeof fetch === 'function'
      ? fetch
      : (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

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
  }
}

module.exports = AlwaysJsonReporter; 