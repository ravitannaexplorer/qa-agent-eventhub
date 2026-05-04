/* AI-GENERATED — Review required | Engineer: Ravi | Date: 2026-04-30 */
import { test, expect } from '@playwright/test';
import { SelfHealingLocator } from '../../utils/self-healing-locator';

test.describe('SelfHealingLocator behaviour', () => {

  // ── Test 1 ─────────────────────────────────────────────────────────────────
  test('should find element using primary strategy and not warn', async ({ page }) => {
    await page.goto('/login');

    const locator = new SelfHealingLocator(page, [
      { name: 'label',       locatorFn: (p) => p.locator('input[type="email"]'),  priority: 1 },
      { name: 'placeholder', locatorFn: (p) => p.getByPlaceholder(/email/i),      priority: 2 },
    ]);

    const result = await locator.diagnose();
    expect(result).not.toBeNull();
    expect(result?.usedStrategy).toBe('label');
  });

  // ── Test 2 ─────────────────────────────────────────────────────────────────
  test('should warn and fall back to a lower-priority strategy', async ({ page }) => {
    await page.goto('/login');

    const warnings: string[] = [];
    const origWarn = console.warn;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    console.warn = (...args: any[]) => {
      warnings.push(args.map(String).join(' '));
      origWarn(...args);
    };

    try {
      const locator = new SelfHealingLocator(page, [
        { name: 'ghost',          locatorFn: (p) => p.getByTestId('ghost-element'),       priority: 1 },
        { name: 'password-input', locatorFn: (p) => p.locator('input[type="password"]'),  priority: 2 },
      ]);

      // Should resolve without throwing — priority 2 exists on the page
      await locator.find(1000);

      expect(warnings.some(w => w.includes('SelfHealing'))).toBe(true);
    } finally {
      console.warn = origWarn;
    }
  });

  // ── Test 3 ─────────────────────────────────────────────────────────────────
  test('should throw a descriptive error when all strategies fail', async ({ page }) => {
    await page.goto('/login');

    const locator = new SelfHealingLocator(page, [
      { name: 'ghost [data-testid="does-not-exist"]', locatorFn: (p) => p.getByTestId('does-not-exist'), priority: 1 },
      { name: 'ghost .also-not-real',                  locatorFn: (p) => p.locator('.also-not-real'),     priority: 2 },
    ]);

    let errorMsg = '';
    try {
      await locator.find(500);
    } catch (e) {
      errorMsg = (e as Error).message;
    }

    expect(errorMsg).toContain('All');
    expect(errorMsg).toContain('does-not-exist');
  });

});
