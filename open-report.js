#!/usr/bin/env node

/**
 * Open Local HTML Report Script
 * 
 * This script opens the local Playwright HTML report in the default browser
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const reportPath = path.join(process.cwd(), 'playwright-report', 'index.html');

if (fs.existsSync(reportPath)) {
  console.log('📁 Opening local HTML report...');
  console.log(`📍 Report location: ${reportPath}`);
  
  // Open the HTML file in the default browser
  const platform = process.platform;
  let command;
  
  switch (platform) {
    case 'darwin': // macOS
      command = `open "${reportPath}"`;
      break;
    case 'win32': // Windows
      command = `start "${reportPath}"`;
      break;
    default: // Linux
      command = `xdg-open "${reportPath}"`;
      break;
  }
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Error opening report:', error.message);
      console.log('💡 You can manually open the report by navigating to:');
      console.log(`   ${reportPath}`);
    } else {
      console.log('✅ HTML report opened successfully!');
    }
  });
} else {
  console.log('❌ HTML report not found!');
  console.log('💡 Make sure to run tests first:');
  console.log('   npm run test:teams:debug');
} 