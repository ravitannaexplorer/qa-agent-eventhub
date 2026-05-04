/* AI-GENERATED — Review required | Engineer: Ravi | Date: 2026-04-30 */
import { type Locator, type Page } from '@playwright/test';

export interface Strategy {
  name: string;
  priority: number;
  locatorFn: (page: Page) => Locator;
}

export class SelfHealingLocator {
  private strategies: Strategy[];

  constructor(private page: Page, strategies: Strategy[]) {
    this.strategies = [...strategies].sort((a, b) => a.priority - b.priority);
  }

  async find(timeout = 5000): Promise<Locator> {
    const failed: string[] = [];

    for (let i = 0; i < this.strategies.length; i++) {
      const strategy = this.strategies[i];
      try {
        const loc = strategy.locatorFn(this.page).first();
        await loc.waitFor({ state: 'visible', timeout });
        if (i > 0) {
          console.warn(
            `[SelfHealingLocator] Falling back to strategy "${strategy.name}"`
          );
        }
        return loc;
      } catch {
        failed.push(`"${strategy.name}"`);
      }
    }

    throw new Error(
      `SelfHealingLocator: All strategies failed.\nTried: ${failed.join(', ')}`
    );
  }

  async fill(value: string, timeout = 5000): Promise<void> {
    const loc = await this.find(timeout);
    await loc.fill(value);
  }

  async click(timeout = 5000): Promise<void> {
    const loc = await this.find(timeout);
    await loc.click();
  }

  async selectOption(value: string, timeout = 5000): Promise<void> {
    const loc = await this.find(timeout);
    await loc.selectOption(value);
  }

  async diagnose(timeout = 3000): Promise<{ usedStrategy: string } | null> {
    for (const strategy of this.strategies) {
      try {
        const loc = strategy.locatorFn(this.page).first();
        await loc.waitFor({ state: 'visible', timeout });
        return { usedStrategy: strategy.name };
      } catch {
        // try next
      }
    }
    return null;
  }
}
