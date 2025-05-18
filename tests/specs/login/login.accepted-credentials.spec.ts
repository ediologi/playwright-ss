import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login/login.page";
import { InventoryPage } from "../../pages/inventory/inventory.page";

test.describe("Login page", () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.BASE_URL!);
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
  });

  test("Login with standard user should succeeds", async () => {
    await loginPage.login("standard_user");
    await inventoryPage.assertInventoryListVisible();
  });

  test("Login with locked user should show error", async ({ page }) => {
    await loginPage.login("locked_out_user");
    await expect(page.locator('[data-test="error"]')).toHaveText(/locked out/i);
  });

  test("Login with problem user should show broken images", async ({
    page,
  }) => {
    await loginPage.login("problem_user");
    await inventoryPage.assertInventoryListVisible();
    const imageSrc = await page
      .locator(".inventory_item_img img")
      .first()
      .getAttribute("src");
    expect(imageSrc).toContain("sl-404");
    // problem_user is a user with same images and links in the inventory
    // source of broken image is https://www.saucedemo.com/static/media/sl-404.168b1cce.jpg
  });

  test("Login with performance glitch user should succeed, but slower", async () => {
    const start = Date.now();
    await loginPage.login("performance_glitch_user");
    await inventoryPage.assertInventoryListVisible();
    expect(Date.now() - start).toBeGreaterThan(5000);
  });

  test("Login with error user should succeed and show dialog when sorting", async ({
    page,
  }) => {
    await loginPage.login("error_user");
    await inventoryPage.assertInventoryListVisible();

    page.once("dialog", async (dialog) => {
      expect(dialog.message()).toContain("Sorting is broken");
      expect(dialog.type()).toBe("alert");
      await dialog.accept();
    });

    const sortContainer = page.locator('[data-test="product-sort-container"]');
    await sortContainer.waitFor({ state: "visible" });
    await sortContainer.selectOption("az");
  });

  test("Login with visual user should succeeds, but has visual glitches", async () => {
    await loginPage.login("visual_user");
    await inventoryPage.assertInventoryListVisible();
    // await expect(page).toHaveScreenshot('visual-user-dashboard.png');
  });
});
