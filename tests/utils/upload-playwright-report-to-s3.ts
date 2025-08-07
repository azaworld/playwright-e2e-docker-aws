import dotenv from 'dotenv';
dotenv.config();
import AWS from 'aws-sdk';
import type { PutObjectRequest } from 'aws-sdk/clients/s3';
import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_S3_BUCKET,
  AWS_S3_REPORT_PREFIX,
  AWS_S3_SCREENSHOT_PREFIX
} = process.env as Record<string, string>;

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION
});

const s3 = new AWS.S3();

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
  console.log(`Uploading files from ${localDir} to s3://${AWS_S3_BUCKET}/${s3Prefix}`);
  for (const filePath of files) {
    const s3Key = path.join(s3Prefix, path.relative(localDir, filePath)).replace(/\\/g, '/');
    console.log(`Uploading ${filePath} to s3://${AWS_S3_BUCKET}/${s3Key}`);
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
      console.log(`✅ Successfully uploaded: ${s3Key}`);
    } catch (err) {
      console.error(`❌ Failed to upload ${filePath} to s3://${AWS_S3_BUCKET}/${s3Key}:`, err);
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

(async () => {
  try {
    console.log('Starting Playwright report upload to S3...');
    
    // Create unique timestamp for this report (matches notifyTeams.ts)
    const timestamp = dayjs().format('YYYY-MM-DD-HH-mm-ss');
    const timestampedPrefix = `${AWS_S3_REPORT_PREFIX}/${timestamp}`;
    console.log(`📅 Using timestamp: ${timestamp}`);
    
    if (fs.existsSync('playwright-report')) {
      console.log('Uploading playwright-report directory...');
      await uploadDirToS3('playwright-report', timestampedPrefix);
      console.log('✅ Playwright report uploaded successfully');
      console.log(`🔗 Report URL: https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${timestampedPrefix}/index.html`);
    } else {
      console.log('⚠️ playwright-report directory not found');
    }
    
    if (fs.existsSync('playwright-report/data')) {
      console.log('Uploading screenshots and attachments...');
      await uploadDirToS3('playwright-report/data', `${AWS_S3_SCREENSHOT_PREFIX}/${timestamp}`);
      console.log('✅ Screenshots uploaded successfully');
    } else {
      console.log('⚠️ playwright-report/data directory not found');
    }
    
    console.log('🎉 All uploads completed successfully');
  } catch (error) {
    console.error('❌ Upload failed:', error);
  }
})();