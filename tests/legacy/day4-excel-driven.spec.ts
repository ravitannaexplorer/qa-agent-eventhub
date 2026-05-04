/* AI-GENERATED — Review required | Engineer: Ravi | Date: 2026-04-30 */
import { test } from '@playwright/test';
import LoginPage from '../../pages/LoginPage';
import { parseExcelTestCases } from '../../utils/excel-reader';

const loginCases = parseExcelTestCases('./test-data/test-cases-v4.xlsx', { module: 'Login' });

test.describe('Login Module — Data Driven', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  for (const tc of loginCases) {
    test(`[${tc.testId}] ${tc.testName}`, async () => {
      // Arrange — already done in beforeEach

      // Act
      await loginPage.fillEmail(tc.inputData.email);
      await loginPage.fillPassword(tc.inputData.password);
      await loginPage.clickSignIn();

      // Assert
      if (tc.inputData.expectedUrl) {
        await loginPage.assertRedirectedTo(tc.inputData.expectedUrl);
      } else if (tc.inputData.expectedError) {
        await loginPage.assertErrorMessage(tc.inputData.expectedError);
      } else {
        await loginPage.assertNotOnProtectedPage();
      }
    });
  }
});
