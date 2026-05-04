/* AI-GENERATED — Review required | Engineer: Ravi | Date: 2026-05-01 */

export const ENV = {
  BASE_URL:       process.env.BASE_URL       ?? 'https://eventhub.rahulshettyacademy.com',
  LOGIN_EMAIL:    process.env.LOGIN_EMAIL    ?? 'ravitanna2015@gmail.com',
  LOGIN_PASSWORD: process.env.LOGIN_PASSWORD ?? 'Ravitanna@2015',
  API_TOKEN:      process.env.API_TOKEN      ?? '',
};

export function validateEnv(): void {
  const missing: string[] = [];
  if (!process.env.BASE_URL)    missing.push('BASE_URL');
  if (!process.env.LOGIN_EMAIL) missing.push('LOGIN_EMAIL');
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}.\n` +
      'Copy .env.example to .env and fill in the values.'
    );
  }
}

validateEnv();
