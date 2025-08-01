// Test script to show Teams adaptive card format
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

// Test the adaptive card
const dateStr = dayjs().format('YYYY-MM-DD, hh:mm A');
const portalName = 'Testing Report Prod';
const failedCount = Number(metrics.failed);
const status_emoji = failedCount === 0 ? '🟢' : '🔴';
const status_message = failedCount === 0
  ? 'All Tests Passed Successfully!'
  : 'Issues Detected';
const htmlUrl = 'https://fur4-playwright-reports.s3.eu-north-1.amazonaws.com/playwright-report/index.html';

const adaptiveCard = {
  'type': 'message',
  'attachments': [
    {
      'contentType': 'application/vnd.microsoft.card.adaptive',
      'content': {
        'type': 'AdaptiveCard',
        'version': '1.0',
        'body': [
          {
            'type': 'TextBlock',
            'text': `${status_emoji} ${portalName} - ${status_message}`,
            'weight': 'Bolder',
            'size': 'Large',
            'color': metrics.failed === 0 ? 'Good' : 'Warning'
          },
          {
            'type': 'TextBlock',
            'text': `Test Date: ${dateStr}`,
            'spacing': 'Small'
          },
          {
            'type': 'TextBlock',
            'text': '**Test Results**',
            'weight': 'Bolder',
            'spacing': 'Medium'
          },
          {
            'type': 'FactSet',
            'facts': [
              {
                'title': '✅ Passed',
                'value': `${metrics.passed}`
              },
              {
                'title': '❌ Failed',
                'value': `${metrics.failed}`
              },
              {
                'title': '⏭️ Skipped',
                'value': `${metrics.skipped}`
              },
              {
                'title': '🧮 Total',
                'value': `${metrics.total}`
              },
              {
                'title': '⏱️ Duration',
                'value': formatDuration(metrics.durationSec)
              },
              {
                'title': '📊 Pass %',
                'value': `${metrics.passPercent}%`
              }
            ]
          },
          {
            'type': 'TextBlock',
            'text': metrics.failed === 0 ? '🎉 All tests passed successfully!' : '❗ Issues detected in this run.',
            'spacing': 'Medium'
          }
        ],
        'actions': [
          {
            'type': 'Action.OpenUrl',
            'title': '🔎 View Detailed HTML Report',
            'url': htmlUrl || '#'
          }
        ]
      }
    }
  ]
};

console.log('=== ADAPTIVE CARD STRUCTURE ===');
console.log('');
console.log(JSON.stringify(adaptiveCard, null, 2));
console.log('');
console.log('=== END ADAPTIVE CARD ===');
console.log('');
console.log('This format should display properly formatted in Teams with:');
console.log('- ✅ Proper line breaks and spacing');
console.log('- ✅ Bold headers and structured data');
console.log('- ✅ Color-coded status (green for pass, red for fail)');
console.log('- ✅ Clickable action button');
console.log('- ✅ FactSet for clean data presentation'); 