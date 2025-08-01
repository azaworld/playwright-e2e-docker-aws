// Test script to show Teams message formatting locally
const dayjs = require('dayjs');

// Mock the metrics from our actual test results
const metrics = {
  total: 224,
  passed: 8,
  failed: 0,
  skipped: 216,
  durationSec: 45.69826199999999,
  passPercent: '3.6',
  failedDetails: []
};

function formatDuration(seconds) {
  if (typeof seconds === 'string' || isNaN(Number(seconds))) return 'N/A';
  const s = Math.floor(Number(seconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

function buildTeamsMessage({
  passed, failed, skipped, total, durationSec, passPercent, env, dateStr, htmlUrl, failedDetails
}) {
  const portalName = 'Testing Report Prod';
  const failedCount = Number(failed);
  const status_emoji = failedCount === 0 ? '🟢' : '🔴';
  const status_message = failedCount === 0
    ? 'All Tests Passed Successfully!'
    : 'Issues Detected';
  const footer_message = failedCount === 0
    ? '🎉 All tests passed successfully!'
    : '❗ Issues detected in this run. Please review the failures below.';
  const duration = formatDuration(durationSec);
  const report_url = htmlUrl || 'HTML Report unavailable';
  const environment = env;
  const date_time = dateStr;
  const passed_count = passed;
  const skipped_count = skipped;
  const total_count = total;
  const pass_percent = passPercent;

  let failedBlock = '';
  if (failedDetails && failedDetails.length > 0) {
    failedBlock = '\n❌ **Failed Tests**\nShowing ' + failedDetails.length + ' failure(s) below\n' + failedDetails.join('\n\n');
  }

  return [
    `**${status_emoji} ${portalName} - ${status_message}**`,
    `Test Date: ${date_time}`,
    `🔎 [View Detailed HTML Report](${report_url})`,
    '',
    footer_message,
    '',
    '**Test Results**',
    `✅ Passed: ${passed_count}`,
    `❌ Failed: ${failedCount}`,
    `⏭️ Skipped: ${skipped_count}`,
    `🧮 Total: ${total_count}`,
    `⏱️ Duration: ${duration}`,
    `📅 Date: ${date_time}`,
    `📊 Pass %: ${pass_percent}%`,
    failedBlock,
    '',
    '🔴 [View Latest Test Report](' + report_url + ')'
  ].filter(Boolean).join('\n');
}

// Test the message
const dateStr = dayjs().format('YYYY-MM-DD, hh:mm A');
const teamsMsg = buildTeamsMessage({
  ...metrics,
  env: 'Production',
  dateStr,
  htmlUrl: 'https://fur4-playwright-reports.s3.eu-north-1.amazonaws.com/playwright-report/index.html'
});

console.log('=== TEAMS MESSAGE PREVIEW ===');
console.log('');
console.log(teamsMsg);
console.log('');
console.log('=== END PREVIEW ===');
console.log('');
console.log('Message length:', teamsMsg.length, 'characters');
console.log('Number of lines:', teamsMsg.split('\n').length); 