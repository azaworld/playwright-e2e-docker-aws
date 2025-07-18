import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

// All console.log statements removed

class AlwaysJsonReporter {
  options: any;
  constructor(options: any) {
    this.options = options;
  }

  async onEnd() {
    // Try to read the Playwright JSON report from the most likely locations
    let jsonReportPath = path.join(process.cwd(), 'test-results', 'results.json');
    if (!fs.existsSync(jsonReportPath)) {
      jsonReportPath = path.join(process.cwd(), 'test-results', 'playwright-report.json');
    }
    // Do NOT check playwright-report/report.json anymore
    let report;
    try {
      if (fs.existsSync(jsonReportPath)) {
        report = JSON.parse(fs.readFileSync(jsonReportPath, 'utf-8'));
      } else {
        return; // Exit gracefully if no results file exists
      }
    } catch (e) {
      return;
    }

    // Collect all test results
    const allTests: Array<{
      title: string;
      file: string;
      line: number;
      status: string;
      error: string;
      attachments: any[];
      isFailure: boolean;
    }> = [];
    function collect(suites: any[]) {
      if (!suites) return;
      for (const suite of suites) {
        if (suite.suites) collect(suite.suites);
        if (suite.specs) {
          for (const spec of suite.specs) {
            for (const test of spec.tests) {
              for (const result of test.results) {
                // Treat any non-passed status as a failure for reporting
                const isFailure = result.status !== 'passed' && result.status !== 'skipped';
                allTests.push({
                  title: spec.title,
                  file: spec.file,
                  line: spec.line,
                  status: result.status,
                  error: result.error?.message || (result.errors && result.errors[0]?.message) || '',
                  attachments: result.attachments || [],
                  isFailure
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

    // Include all failures, not just 'failed' but also 'timedOut', 'unexpected', etc.
    const failedTests = allTests.filter((t) => t.isFailure);
    const passedTests = allTests.filter((t) => t.status === 'passed');

    let messageText = `**Test Results**\n- Passed: ${counts.passed}\n- Failed: ${counts.failed}\n- Skipped: ${counts.skipped}\n`;

    if (failedTests.length > 0) {
      messageText += `\n**❌ Failed Tests:**\n`;
      messageText += failedTests.map((f) => {
        let msg = `**${f.title}**\nFile: ${f.file}:${f.line}\nStatus: ${f.status}\nError: ${f.error}`;
        const screenshots = (f.attachments || []).filter((a: any) => a.name && a.name.toLowerCase().includes('screenshot') && a.path);
        const logs = (f.attachments || []).filter((a: any) => a.name && a.name.toLowerCase().includes('log') && a.path);
        if (screenshots.length > 0) {
          // msg += `\nScreenshots: ${screenshots.map((s: any) => `[${path.basename(s.path)}](${s.path})`).join(', ')}`;
        }
        if (logs.length > 0) {
          msg += `\nLogs: ${logs.map((l: any) => `[${path.basename(l.path)}](${l.path})`).join(', ')}`;
        }
        return msg;
      }).join('\n\n');
    } else {
      messageText += `\n✅ All tests passed!`;
    }

    if (passedTests.length > 0) {
      messageText += `\n\n**✅ Passed Tests:**\n`;
      messageText += passedTests.map((f) => {
        let msg = `**${f.title}**\nFile: ${f.file}:${f.line}`;
        return msg;
      }).join('\n\n');
    }

    // Print the full summary and details to the console for local review
    // console.log('DEBUG: Test counts:', counts);
    // console.log('DEBUG: Failed tests:', JSON.stringify(failedTests, null, 2));
    // console.log('DEBUG: Passed tests:', JSON.stringify(passedTests, null, 2));
    // console.log('DEBUG: Message text preview:\n', messageText);
    if (counts.failed !== failedTests.length) {
      // console.warn(`WARNING: Failed test count (${counts.failed}) does not match failed test details (${failedTests.length}). Some failures may not be listed.`);
    }

    // Only send to Teams if SEND_TEAMS env var is set to 'true'
    // Remove the following lines:
    // if (process.env.SEND_TEAMS !== 'true') {
    //   console.log('DEBUG: SEND_TEAMS is not set to "true". Skipping Teams notification.');
    //   return;
    // }

    // Teams webhook
    const webhookUrl = process.env.TEAMS_WEBHOOK_URL;
    // console.log('DEBUG: Using webhook URL:', webhookUrl);
    if (!webhookUrl) {
      // console.log('⚠️  No Teams webhook URL configured, skipping notification');
      return;
    }

    // Add HTML report link if available
    let htmlReportPath = path.join(process.cwd(), 'playwright-report', 'index.html');
    let htmlReportLink = '';
    if (fs.existsSync(htmlReportPath)) {
      htmlReportLink = `\n\n[View HTML Report](${htmlReportPath})`;
    }

    // S3 URL helpers (declare only once)
    const reportUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_S3_REPORT_PREFIX}/index.html`;
    const screenshotUrl = (filename: string) =>
      `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_S3_SCREENSHOT_PREFIX}/${filename}`;

    // --- Enhanced Notification Design ---
    const total = counts.passed + counts.failed + counts.skipped;
    const duration = process.env.TEST_START_TIME ? `${Math.round((Date.now() - new Date(process.env.TEST_START_TIME).getTime()) / 1000)}s` : '';
    const testDate = process.env.TEST_START_TIME ? new Date(process.env.TEST_START_TIME).toLocaleString() : new Date().toLocaleString();
    const passPercent = total > 0 ? ((counts.passed / total) * 100).toFixed(1) : '0.0';

    // Dynamic title and intro
    const hasFailures = failedTests.length > 0;
    const mainTitle = hasFailures ? '**🟢 Testing Report Prod - Issues Detected**' : '**🟢 Testing Now Prod - All Green!**';
    const introMsg = hasFailures
      ? `\n\n**❗ Issues detected in this run. Please review the failures below.**\n\n`
      : `\n\n✅ All tests passed. No issues detected.\n\n`;

    // Add a bold, clickable Markdown link for the report above the button
    const reportMarkdownLink = `**[🔎 View Detailed HTML Report](${reportUrl})**\n\n`;

    const message = {
      "@type": "MessageCard",
      "@context": "http://schema.org/extensions",
      "themeColor": hasFailures ? "FF0000" : "00FF00",
      "summary": hasFailures ? "Playwright Test Failures" : "Playwright All Tests Passed",
      "title": hasFailures ? "Playwright Test Failures" : "Playwright All Tests Passed",
      "sections": [
        {
          "activityTitle": mainTitle,
          "activitySubtitle": `Test Date: ${testDate}`,
          "text": reportMarkdownLink + introMsg +
            `**Test Results**\n\n` +
            `- **✅ Passed:** ${counts.passed}\n` +
            `- **❌ Failed:** ${counts.failed}\n` +
            `- **⏭️ Skipped:** ${counts.skipped}\n` +
            `- **🧮 Total:** ${total}\n` +
            `- **⏱️ Duration:** ${duration}\n` +
            `- **📅 Date:** ${testDate}\n` +
            `- **📊 Pass %:** ${passPercent}%\n\n`,
          "markdown": true
        },
        hasFailures ? {
          "activityTitle": "**❌ Failed Tests**",
          "activitySubtitle": `Showing ${failedTests.length} failure(s) below` + '\n',
          "facts": failedTests.map((f) => {
            // Only use the filename for screenshot links
            const screenshotAttachment = (f.attachments||[]).find((a: any) => a.name&&a.name.toLowerCase().includes('screenshot')&&a.path);
            let screenshotLink = '';
            if (screenshotAttachment && screenshotAttachment.path) {
              const filename = screenshotAttachment.path.split(/[\\/]/).pop();
              // screenshotLink = screenshotUrl(filename);
            }
            return {
              "name": f.title,
              "value": `File: ${f.file}:${f.line}\nStatus: ${f.status}\nError: ${f.error}` // + (screenshotLink ? `\n[Screenshot](${screenshotLink})` : '')
            };
          }),
          "markdown": true
        } : null
      ].filter(Boolean),
      "potentialAction": [
        {
          "@type": "OpenUri",
          "name": hasFailures ? "🔴 View Latest Test Report" : "🟢 View Latest Test Report",
          "targets": [
            { "os": "default", "uri": reportUrl }
          ]
        }
      ]
    };

    // Use global fetch if available, otherwise fallback to node-fetch
    const fetchFn: any = typeof fetch === 'function'
      ? fetch
      : (input: any, init?: any) =>
          import('node-fetch').then(({ default: fetch }) => fetch(input, init));

    try {
      // console.log('DEBUG: Sending Teams notification...');
      const response = await fetchFn(webhookUrl, {
        method: 'POST',
        body: JSON.stringify(message),
        headers: { 'Content-Type': 'application/json' }
      });
      // console.log('DEBUG: Teams response status:', response.status);
      if (response.ok) {
        // console.log('✅ Teams notification sent successfully');
      } else {
        const text = await response.text();
      }
    } catch (error) {
    }
  }
}

export default AlwaysJsonReporter; 