import * as pw from 'playwright';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  const baseUrl = process.env.BASE_URL;

  if (!baseUrl) {
    throw new Error("BASE_URL is not defined in the .env file");
  }

  const browser = await pw.chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(baseUrl);

  // Example: Click "Elements" on the homepage
  await page.click('text=Elements');

  // Wait a bit so you can see the result
  await page.waitForTimeout(3000);

  await browser.close();
}

main().catch(console.error);
