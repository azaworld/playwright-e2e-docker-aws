// tests/utils/notifyTeams.ts
import fs from 'fs';
import path from 'path';
import AWS from 'aws-sdk';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import type { PutObjectRequest } from 'aws-sdk/clients/s3';

dotenv.config();
dayjs.extend(utc);
dayjs.extend(timezone);

// --- ENV VARS ---
const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_S3_BUCKET,
  TEAMS_WEBHOOK_URL,
  ENV = 'Production',
  ALLURE_REPORT_URL // Optional: e.g. https://my-bucket.s3.amazonaws.com/allure-report/index.html
} = process.env;

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION
});
const s3 = new AWS.S3();

function parseResults(resultsPath: string) {
  if (!fs.existsSync(resultsPath)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
    const allTests: any[] = [];
    function collect(suites: any[]) {
      if (!suites) return;
      for (const suite of suites) {
        if (suite.suites) collect(suite.suites);
        if (suite.specs) {
          for (const spec of suite.specs) {
            for (const test of spec.tests) {
              allTests.push(test);
            }
          }
        }
      }
    }
    collect(data.suites);
    const total = allTests.length;
    const passed = allTests.filter(t => t.results?.[0]?.status === 'passed').length;
    const failed = allTests.filter(t => t.results?.[0]?.status === 'failed').length;
    const skipped = allTests.filter(t => t.results?.[0]?.status === 'skipped').length;
    const durationSec = allTests.reduce((sum, t) => sum + (t.results?.[0]?.duration || 0), 0) / 1000;
    const passPercent = total > 0 ? ((passed / total) * 100).toFixed(1) : 'N/A';
    return { total, passed, failed, skipped, durationSec, passPercent };
  } catch {
    return null;
  }
}

async function uploadHtmlReport(): Promise<string | null> {
  const possibleHtmlPaths = [
    path.join('playwright-report', 'index.html'),
    path.join('test-results', 'index.html')
  ];
  const localPath = possibleHtmlPaths.find(p => fs.existsSync(p));
  if (!localPath) return null;
  const s3Key = 'playwright-report/index.html';
  try {
    const fileContent = fs.readFileSync(localPath);
    const params = {
      Bucket: AWS_S3_BUCKET!,
      Key: s3Key,
      Body: fileContent,
      ContentType: 'text/html',
      ACL: 'public-read'
    };
    await s3.putObject(params as any).promise();
    return `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${s3Key}`;
  } catch (err) {
    console.error('S3 upload failed:', err);
    return null;
  }
}

/**
 * Build a beautiful, markdown-formatted Teams message.
 */
function buildTeamsMessage({
  passed, failed, skipped, total, durationSec, passPercent, env, dateStr, htmlUrl, allureUrl
}: {
  passed: number | string,
  failed: number | string,
  skipped: number | string,
  total: number | string,
  durationSec: number | string,
  passPercent: string,
  env: string,
  dateStr: string,
  htmlUrl: string | null,
  allureUrl?: string
}) {
  const allPassed = Number(failed) === 0 && Number(total) > 0;
  const statusLine = allPassed
    ? '🟢 **All Playwright Tests Passed!**'
    : '🔴 **Some Playwright Tests Failed!**';
  const statsLine = `✅ **Passed:** ${passed}  |  ❌ **Failed:** ${failed}  |  ⏭️ **Skipped:** ${skipped}  |  🧮 **Total:** ${total}`;
  const durationLine = `⏱️ **Duration:** ${durationSec !== 'N/A' ? durationSec + 's' : 'N/A'}  |  📊 **Pass %:** ${passPercent}%`;
  const envLine = `🌐 **Env:** ${env}  |  📅 **Date:** ${dateStr}`;
  const htmlLine = htmlUrl
    ? '🔵 [**View HTML Report**](' + htmlUrl + ')'
    : '🔎 **HTML Report unavailable**';
  const allureLine = allureUrl
    ? '🟣 [**View Allure Report**](' + allureUrl + ')'
    : '';
  return [
    statusLine,
    '',
    statsLine,
    durationLine,
    envLine,
    '',
    htmlLine,
    allureLine
  ].filter(Boolean).join('\n');
}

(async () => {
  // 1. Parse results
  const possibleResults = [
    path.join('test-results', 'results.json'),
    path.join('test-results', 'playwright-report.json'),
    path.join('playwright-report', 'results.json')
  ];
  const resultsPath = possibleResults.find(p => fs.existsSync(p));
  const metrics = resultsPath ? (parseResults(resultsPath) || {
    total: 0, passed: 0, failed: 0, skipped: 0, durationSec: 'N/A', passPercent: 'N/A'
  }) : {
    total: 0, passed: 0, failed: 0, skipped: 0, durationSec: 'N/A', passPercent: 'N/A'
  };

  // 2. Upload HTML report
  const htmlUrl = await uploadHtmlReport();

  // 3. Date in Asia/Dhaka
  const dateStr = dayjs().tz('Asia/Dhaka').format('YYYY-MM-DD, hh:mm A');

  // 4. Build message
  const teamsMsg = buildTeamsMessage({
    ...metrics,
    env: ENV,
    dateStr,
    htmlUrl,
    allureUrl: ALLURE_REPORT_URL
  });

  // 5. Send to Teams
  if (TEAMS_WEBHOOK_URL) {
    const message = {
      '@type': 'MessageCard',
      '@context': 'http://schema.org/extensions',
      'text': teamsMsg
    };
    try {
      const response = await fetch(TEAMS_WEBHOOK_URL, {
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
})(); 