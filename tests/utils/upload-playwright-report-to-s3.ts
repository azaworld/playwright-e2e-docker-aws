import dotenv from 'dotenv';
dotenv.config();
import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';

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
  for (const filePath of files) {
    const s3Key = path.join(s3Prefix, path.relative(localDir, filePath)).replace(/\\/g, '/');
    const fileContent = fs.readFileSync(filePath);
    await s3.putObject({
      Bucket: AWS_S3_BUCKET,
      Key: s3Key,
      Body: fileContent,
      ContentType: getContentType(filePath),
      ACL: 'public-read'
    }).promise();
    console.log(`Uploaded: ${s3Key}`);
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
  if (fs.existsSync('playwright-report')) {
    await uploadDirToS3('playwright-report', AWS_S3_REPORT_PREFIX);
  }
  if (fs.existsSync('playwright-report/data')) {
    await uploadDirToS3('playwright-report/data', AWS_S3_SCREENSHOT_PREFIX);
  }
  console.log('All uploads complete!');
})();