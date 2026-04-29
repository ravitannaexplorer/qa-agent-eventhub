/* AI-GENERATED — Review required | Engineer: Ravi | Date: 2026-04-29 */
import * as xlsx from 'xlsx';
import { z } from 'zod';

export interface InputData {
  url?: string;
  email?: string;
  password?: string;
  expectedUrl?: string;
  expectedError?: string;
  keyword?: string;
  action?: string;
  eventId?: number;
  seats?: number;
  fullName?: string;
  phone?: string;
  method?: string;
  endpoint?: string;
  authRequired?: boolean;
  body?: Record<string, unknown>;
  expectedStatus?: number;
  token?: string;
  loginEmail?: string;
  loginPassword?: string;
  search?: string;
  expectedEvent?: string;
  newName?: string;
  mockBookings?: unknown[];
  [key: string]: unknown;
}

export interface TestCase {
  testId: string;
  module: string;
  testName: string;
  priority: 'High' | 'Medium' | 'Low';
  inputData: InputData;
  steps: string[];
  expectedResult: string;
  testType: 'UI' | 'API' | 'E2E' | 'DB';
  enabled: boolean;
}

const TestCaseSchema = z
  .object({
    TestID: z.string().min(1),
    Module: z.string().min(1),
    TestName: z.string().min(1),
    Priority: z.enum(['High', 'Medium', 'Low'] as const),
    InputData: z.string().transform((s) => {
      try {
        return JSON.parse(s);
      } catch {
        return {};
      }
    }),
    Steps: z.string().transform((s) =>
      s
        .split('|')
        .map((t) => t.trim())
        .filter(Boolean)
    ),
    ExpectedResult: z.string().min(1),
    TestType: z.enum(['UI', 'API', 'E2E', 'DB'] as const),
    Enabled: z
      .union([z.boolean(), z.string()])
      .transform((v) => String(v).toUpperCase() === 'TRUE'),
  })
  .transform((data) => ({
    testId: data.TestID,
    module: data.Module,
    testName: data.TestName,
    priority: data.Priority,
    inputData: data.InputData as InputData,
    steps: data.Steps,
    expectedResult: data.ExpectedResult,
    testType: data.TestType,
    enabled: data.Enabled,
  }));

export interface ParseOptions {
  module?: string;
  testType?: string;
  priority?: string;
  includeDisabled?: boolean;
}

/**
 * Reads all sheets from the Excel workbook (skipping Summary),
 * validates and transforms every row with Zod, and returns a
 * flat array of TestCase objects.
 *
 * @param filePath - path to test-cases.xlsx
 * @param options  - optional filters (module, testType, priority, includeDisabled)
 *
 * Bad rows are console.warned and skipped — they never throw.
 * Disabled rows (Enabled: FALSE) are skipped unless includeDisabled is true.
 */
export function parseExcelTestCases(
  filePath: string,
  options: ParseOptions = {}
): TestCase[] {
  const wb = xlsx.readFile(filePath);
  const sheets = wb.SheetNames.filter(
    (name) => name.toLowerCase() !== 'summary'
  );

  const results: TestCase[] = [];

  for (const name of sheets) {
    const ws = wb.Sheets[name];
    const rows = xlsx.utils.sheet_to_json(ws, { defval: '' }) as Record<
      string,
      unknown
    >[];

    for (const row of rows) {
      const result = TestCaseSchema.safeParse(row);
      if (!result.success) {
        console.warn(
          `[excel-reader] Skipped row in sheet "${name}":`,
          result.error.issues
        );
        continue;
      }
      if (!options.includeDisabled && !result.data.enabled) {
        continue;
      }
      results.push(result.data);
    }
  }

  let filtered = results;
  if (options.module) {
    filtered = filtered.filter((tc) => tc.module === options.module);
  }
  if (options.testType) {
    filtered = filtered.filter((tc) => tc.testType === options.testType);
  }
  if (options.priority) {
    filtered = filtered.filter((tc) => tc.priority === options.priority);
  }

  return filtered;
}

export function getTestSummary(cases: TestCase[]): void {
  console.log(`✅ Loaded ${cases.length} test cases`);

  console.log('\nBy module:');
  const byModule = cases.reduce(
    (acc, tc) => {
      acc[tc.module] = (acc[tc.module] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  for (const [mod, count] of Object.entries(byModule)) {
    console.log(`  ${mod.padEnd(20)} →  ${count}`);
  }

  console.log('\nBy type:');
  const byType = cases.reduce(
    (acc, tc) => {
      acc[tc.testType] = (acc[tc.testType] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  for (const [type, count] of Object.entries(byType)) {
    console.log(`  ${type.padEnd(6)} →  ${count}`);
  }
}
