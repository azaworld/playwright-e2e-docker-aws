import { test, expect } from '@playwright/test';

test('force fail for Teams alert check', async () => {
  expect(1).toBe(2); // This will always fail
}); 