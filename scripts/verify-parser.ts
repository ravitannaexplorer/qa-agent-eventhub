/* AI-GENERATED — Review required | Engineer: Ravi | Date: 2026-04-29 */
import { parseExcelTestCases, getTestSummary } from '../utils/excel-reader';

const XLSX_PATH = './test-data/test-cases-v2.xlsx';

const all = parseExcelTestCases(XLSX_PATH);
getTestSummary(all);

console.log('\nSample cases:');
console.log(JSON.stringify(all.slice(0, 2), null, 2));

const apiOnly = parseExcelTestCases(XLSX_PATH, { testType: 'API' });
console.log(`\nAPI cases (enabled): ${apiOnly.length}`);

const highOnly = parseExcelTestCases(XLSX_PATH, { priority: 'High' });
console.log(`High priority cases: ${highOnly.length}`);

const withDisabled = parseExcelTestCases(XLSX_PATH, { includeDisabled: true });
console.log(`All cases including disabled: ${withDisabled.length}`);
