import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login/login.page";
import { InventoryPage } from "../../pages/inventory/inventory.page";

test.describe("Inventory page item addition", () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.BASE_URL!);
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.login("standard_user");
    await inventoryPage.assertInventoryListVisible();
  });

  test("should add specific 2 items to the cart", async ({ page }) => {
    await inventoryPage.addToCart("Sauce Labs Backpack");
    expect(await inventoryPage.getCartCount()).toBe(1);

    await inventoryPage.addToCart("Sauce Labs Bike Light");
    expect(await inventoryPage.getCartCount()).toBe(2);
  });

  test("should add specific 3 items to the the cart", async ({ page }) => {
    await inventoryPage.addToCart("Sauce Labs Backpack");
    expect(await inventoryPage.getCartCount()).toBe(1);

    await inventoryPage.addToCart("Sauce Labs Bike Light");
    expect(await inventoryPage.getCartCount()).toBe(2);

    await inventoryPage.addToCart("Sauce Labs Bolt T-Shirt");
    expect(await inventoryPage.getCartCount()).toBe(3);
  });

  test("should add specific 4 items to the the cart", async ({ page }) => {
    await inventoryPage.addToCart("Sauce Labs Backpack");
    expect(await inventoryPage.getCartCount()).toBe(1);

    await inventoryPage.addToCart("Sauce Labs Bike Light");
    expect(await inventoryPage.getCartCount()).toBe(2);

    await inventoryPage.addToCart("Sauce Labs Bolt T-Shirt");
    expect(await inventoryPage.getCartCount()).toBe(3);

    await inventoryPage.addToCart("Sauce Labs Fleece Jacket");
    expect(await inventoryPage.getCartCount()).toBe(4);
  });
});
