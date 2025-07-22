import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { generateTeamsMessage } from './teamsMessage';
import AWS from 'aws-sdk';
import dayjs from 'dayjs';

dotenv.config();

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_S3_BUCKET,
  AWS_S3_REPORT_PREFIX,
  AWS_S3_ALLURE_PREFIX,
  TEAMS_WEBHOOK_URL,
  ENV
} = process.env as Record<string, string>;

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION
});

const s3 = new AWS.S3();

function getS3Url(prefix: string) {
  return `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${prefix}/index.html`;
}

function walkDir(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  });
  return fileList;
}

async function uploadDirToS3(localDir: string, s3Prefix: string) {
  const files = walkDir(localDir);
  for (const filePath of files) {
    const s3Key = path.join(s3Prefix, path.relative(localDir, filePath)).replace(/\\/g, '/');
    const fileContent = fs.readFileSync(filePath);
    const params = {
      Bucket: AWS_S3_BUCKET!,
      Key: s3Key,
      Body: fileContent,
      ContentType: getContentType(filePath),
      CacheControl: 'no-cache, no-store, must-revalidate'
    };
    try {
      await s3.putObject(params as any).promise();
    } catch (err) {
      console.error(`Failed to upload ${filePath} to s3://${AWS_S3_BUCKET}/${s3Key}:`, err);
    }
  }
}

function getContentType(filePath: string): string {
  if (filePath.endsWith('.html')) return 'text/html';
  if (filePath.endsWith('.js')) return 'application/javascript';
  if (filePath.endsWith('.css')) return 'text/css';
  if (filePath.endsWith('.json')) return 'application/json';
  if (filePath.endsWith('.png')) return 'image/png';
  if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) return 'image/jpeg';
  return 'application/octet-stream';
}

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

function parseResults(resultsPath: string) {
  if (!fs.existsSync(resultsPath)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
    if (!data.suites) return null;
    const allTests = collectAllTests(data.suites);
    const total = allTests.length;
    const passed = allTests.filter((t: any) => t.results?.[0]?.status === 'passed').length;
    const failed = allTests.filter((t: any) => t.results?.[0]?.status === 'failed').length;
    const skipped = allTests.filter((t: any) => t.results?.[0]?.status === 'skipped').length;
    const totalMs = allTests.reduce((sum: number, t: any) => sum + (t.results?.[0]?.duration || 0), 0);
    const duration = totalMs > 0 ? `${Math.floor(totalMs / 60000)}m ${Math.round((totalMs % 60000) / 1000)}s` : 'N/A';
    return { total, passed, failed, skipped, duration };
  } catch (e) {
    return null;
  }
}

async function main() {
  // 1. Upload HTML and Allure reports to S3
  if (fs.existsSync('playwright-report')) {
    await uploadDirToS3('playwright-report', AWS_S3_REPORT_PREFIX);
  }
  if (fs.existsSync('allure-report')) {
    await uploadDirToS3('allure-report', AWS_S3_ALLURE_PREFIX);
  }

  // 2. Parse test results
  const resultsPath = path.join('test-results', 'playwright-report.json');
  const metrics = parseResults(resultsPath) || {
    total: 0, passed: 0, failed: 0, skipped: 0, duration: 'N/A'
  };

  // 3. Build URLs
  const htmlUrl = getS3Url(AWS_S3_REPORT_PREFIX);
  const allureUrl = getS3Url(AWS_S3_ALLURE_PREFIX);

  // 4. Build Teams message
  const now = dayjs();
  const teamsMsg = generateTeamsMessage({
    env: ENV || 'Production',
    ...metrics,
    htmlUrl,
    allureUrl,
    date: now.format('YYYY-MM-DD'),
    time: now.format('HH:mm')
  });

  // 5. Send to Teams
  if (TEAMS_WEBHOOK_URL) {
    const fetchFn: any = typeof fetch === 'function'
      ? fetch
      : (...args: any[]) => import('node-fetch').then(({ default: fetch }) => (fetch as any)(...args));
    const message = {
      '@type': 'MessageCard',
      '@context': 'http://schema.org/extensions',
      'text': teamsMsg
    };
    try {
      const response = await fetchFn(TEAMS_WEBHOOK_URL, {
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
}

main(); 