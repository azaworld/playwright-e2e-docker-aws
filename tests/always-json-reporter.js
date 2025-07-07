const fs = require('fs');
const path = require('path');
require('dotenv').config();

class AlwaysJsonReporter {
  constructor(options) {
    this.options = options;
  }

  async onEnd(result) {
    // Write the full result object to a known location
    const outputDir = path.join(process.cwd(), 'test-results');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    const outputFile = path.join(outputDir, 'results.json');
    fs.writeFileSync(outputFile, JSON.stringify(result, null, 2), 'utf-8');
    console.log('✅ [AlwaysJsonReporter] Wrote test results to', outputFile);

    // Send Teams alert if there are failures
    const webhookUrl = process.env.TEAMS_WEBHOOK_URL;
    if (!webhookUrl) {
      console.log('⚠️  No Teams webhook URL configured, skipping notification');
      return;
    }

    // Check for any failed tests
    const hasFailed = (obj) => {
      if (!obj) return false;
      if (Array.isArray(obj)) return obj.some(hasFailed);
      if (obj.status === 'failed') return true;
      if (obj.suites) return hasFailed(obj.suites);
      if (obj.specs) return hasFailed(obj.specs);
      if (obj.tests) return hasFailed(obj.tests);
      if (obj.results) return hasFailed(obj.results);
      return false;
    };

    if (hasFailed(result)) {
      const message = {
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        "themeColor": "FF0000",
        "summary": "Playwright Test Failures",
        "title": "Playwright Test Failures",
        "text": "Some Playwright tests have failed. Please check the report.",
      };

      // Use global fetch if available, otherwise fallback to node-fetch
      let fetchFn = typeof fetch === 'function'
        ? fetch
        : (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

      try {
        const response = await fetchFn(webhookUrl, {
          method: 'POST',
          body: JSON.stringify(message),
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
          console.log('✅ Teams notification sent successfully');
        } else {
          console.error('❌ Failed to send Teams notification:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('❌ Error sending Teams notification:', error);
      }
    } else {
      console.log('✅ All tests passed, no Teams alert sent.');
    }
  }
}

module.exports = AlwaysJsonReporter; 