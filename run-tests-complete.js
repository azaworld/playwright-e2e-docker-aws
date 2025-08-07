#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');

console.log('🚀 Starting complete test pipeline...');

// Ensure test-results directory exists for JSON reporter output
try {
  fs.mkdirSync('test-results', { recursive: true });
} catch {}

// Run Playwright tests with JSON output saved to file
const playwright = spawn('npx', ['playwright', 'test', '--reporter=list,json=test-results/playwright-report.json,html'], {
  stdio: 'pipe',
  shell: true
});

let output = '';

playwright.stdout.on('data', (data) => {
  const text = data.toString();
  // Filter out the "To open last HTML report" message and other blocking messages
  if (!text.includes('To open last HTML report') && !text.includes('Serving HTML report')) {
    process.stdout.write(text);
  }
  output += text;
});

playwright.stderr.on('data', (data) => {
  const text = data.toString();
  if (!text.includes('To open last HTML report') && !text.includes('Serving HTML report')) {
    process.stderr.write(text);
  }
});

playwright.on('close', (code) => {
  console.log('\n✅ Tests completed, uploading to S3...');
  
  // Run S3 upload
  const s3Upload = spawn('npx', ['ts-node', 'tests/utils/upload-playwright-report-to-s3.ts'], {
    stdio: 'inherit',
    shell: true
  });
  
  s3Upload.on('close', (s3Code) => {
    if (s3Code === 0) {
      console.log('✅ S3 upload completed, sending Teams notification...');
      
      // Run Teams notification
      const teamsNotify = spawn('npx', ['ts-node', 'tests/utils/notifyTeams.ts'], {
        stdio: 'inherit',
        shell: true
      });
      
      teamsNotify.on('close', (teamsCode) => {
        if (teamsCode === 0) {
          console.log('🎉 Pipeline completed successfully!');
          process.exit(0);
        } else {
          console.error('❌ Teams notification failed');
          process.exit(teamsCode);
        }
      });
    } else {
      console.error('❌ S3 upload failed');
      process.exit(s3Code);
    }
  });
});

playwright.on('error', (error) => {
  console.error('❌ Test execution failed:', error);
  process.exit(1);
});
