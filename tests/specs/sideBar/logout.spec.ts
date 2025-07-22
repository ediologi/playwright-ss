import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login/login.page";
import { InventoryPage } from "../../pages/inventory/inventory.page";
import { SideBarMenuPage } from "../../pages/sideBar/sideBar.page";

test("Standard user should be able to logout", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const sidebar = new SideBarMenuPage(page);

  await page.goto(process.env.BASE_URL!);
  await loginPage.login("standard_user");
  await inventoryPage.assertInventoryListVisible();

  await sidebar.logout();

  await expect(page).toHaveURL(`${process.env.BASE_URL}/`);

  await loginPage.expectLoginButtonVisible();
});
