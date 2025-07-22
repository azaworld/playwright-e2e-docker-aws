// utils/teamsMessage.ts
import dayjs from 'dayjs';

export interface TeamsMessageInput {
  env: string;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: string;
  htmlUrl: string;
  allureUrl: string;
  date?: string;
  time?: string;
}

export function generateTeamsMessage({
  env = 'N/A',
  total = 0,
  passed = 0,
  failed = 0,
  skipped = 0,
  duration = 'N/A',
  htmlUrl = '#',
  allureUrl = '#',
  date,
  time
}: TeamsMessageInput): string {
  const passPercent = total > 0 ? ((passed / total) * 100).toFixed(1) : 'N/A';
  const now = dayjs();
  const dateStr = date || now.format('YYYY-MM-DD');
  const timeStr = time || now.format('hh:mm A');
  const isPassed = failed === 0 && passed > 0;
  const statusLine = isPassed ? '🟢 **All Playwright Tests Passed!**' : '🔴 **Some Playwright Tests Failed!**';
  const statsLine = `✅ **Passed:** ${passed}\n❌ **Failed:** ${failed}\n⏭️ **Skipped:** ${skipped}\n🧮 **Total:** ${total}`;
  const durationLine = `⏱️ **Duration:** ${duration}\n📊 **Pass %:** ${passPercent}%`;
  const envLine = `🌐 **Env:** ${env}\n📅 **Date:** ${dateStr}, ${timeStr}`;
  const htmlLine = htmlUrl && htmlUrl !== '#' ? '🔎 [**View HTML Report**](' + htmlUrl + ')' : '🔎 **HTML Report unavailable**';
  const allureLine = allureUrl && allureUrl !== '#' ? '📊 [**View Allure Report**](' + allureUrl + ')' : '';
  return [
    statusLine,
    '',
    statsLine,
    durationLine,
    envLine,
    '',
    htmlLine,
    allureLine
  ].filter(Boolean).join('\n\n');
}

// Example usage:
// const msg = generateTeamsMessage(testResults);
// console.log(msg); 