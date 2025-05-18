import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login/login.page";
import { InventoryPage } from "../../pages/inventory/inventory.page";
import { getRandomItems, removeRandomItem } from "../../helpers/array.utils";

test.describe("E2E login to finish checkout", () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.BASE_URL!);
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.login("standard_user");
    await inventoryPage.assertInventoryListVisible();
  });

  test("checkout with 2 of 3 randomly selected items", async ({ page }) => {
    const allProducts = await inventoryPage.getAllProductNames();
    const selectedProducts = getRandomItems(allProducts, 3);

    for (const product of selectedProducts) {
      await inventoryPage.addToCart(product);
    }

    expect(await inventoryPage.getCartCount()).toBe(selectedProducts.length);

    await inventoryPage.goToCart();
    await inventoryPage.chartListVisible();

    for (const product of selectedProducts) {
      await expect(
        page.locator(`[data-test="inventory-item-name"]:has-text("${product}")`)
      ).toBeVisible();
    }

    expect(await inventoryPage.getCartCount()).toBe(3);

    const { removed, remaining: remainingProducts } =
      removeRandomItem(selectedProducts);
    await inventoryPage.removeFromCart(removed);
    expect(await inventoryPage.getCartCount()).toBe(remainingProducts.length);

    await inventoryPage.proceedToCheckout();

    await inventoryPage.inputYourInformation("standard_user");

    await inventoryPage.continueCheckout();

    const itemPrices = await inventoryPage.getSelectedProductPrices(
      remainingProducts
    );

    const expectedTotal = itemPrices.reduce((sum, price) => sum + price, 0);

    const displayedTotal = await inventoryPage.getItemTotalPrice();
    expect(displayedTotal).toBeCloseTo(expectedTotal, 2);

    await inventoryPage.finishCheckout();
    await expect(
      page.locator(
        '[data-test="complete-header"]:has-text("Thank you for your order!")'
      )
    ).toBeVisible();
  });
});
