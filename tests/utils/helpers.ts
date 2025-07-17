// Utility functions for Playwright tests

export function randomEmail(domain = 'example.com') {
  return `user_${Date.now()}_${Math.floor(Math.random() * 10000)}@${domain}`;
}

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
} 