import { Page, Locator } from "@playwright/test";
import { checkoutData } from "../../data/inventory/checkout.data";

export class InventoryPage {
  readonly page: Page;
  readonly inventoryList: Locator;
  readonly shoppingCart: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly cartList: Locator;
  readonly checkoutButton: Locator;
  readonly continueCheckoutButton: Locator;
  readonly finishCheckoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryList = page.locator('[data-test="inventory-list"]');
    this.shoppingCart = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartList = page.locator('[data-test="cart-list"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueCheckoutButton = page.locator('[data-test="continue"]');
    this.finishCheckoutButton = page.locator('[data-test="finish"]');
  }

  async assertInventoryListVisible() {
    await this.inventoryList.waitFor({ state: "visible" });
  }

  async chartListVisible() {
    await this.cartList.waitFor({ state: "visible" });
  }

  private sanitizeName(productName: string) {
    return productName.toLowerCase().replaceAll(" ", "-");
  }

  async getAllProductNames(): Promise<string[]> {
    const items = this.page.locator('[data-test="inventory-item-name"]');
    const count = await items.count();

    const names = [];
    for (let i = 0; i < count; i++) {
      const name = await items.nth(i).textContent();
      if (name) names.push(name.trim());
    }
    return names;
  }

  async getSelectedProductPrices(productNames: string[]): Promise<number[]> {
    const prices: number[] = [];

    for (const name of productNames) {
      const priceLocator = this.page
        .locator('[data-test="inventory-item"]')
        .filter({ hasText: name })
        .locator('[data-test="inventory-item-price"]');

      const priceText = await priceLocator.textContent();
      if (!priceText) throw new Error(`Price not found for product: ${name}`);

      prices.push(parseFloat(priceText.replace("$", "")));
    }

    return prices;
  }

  getAddToCartButton(productName: string): Locator {
    const id = this.sanitizeName(productName);
    return this.page.locator(`[data-test="add-to-cart-${id}"]`);
  }

  async addToCart(productName: string) {
    await this.getAddToCartButton(productName).click();
  }

  getRemoveFromCartButton(productName: string): Locator {
    const id = this.sanitizeName(productName);
    return this.page.locator(`[data-test="remove-${id}"]`);
  }

  async removeFromCart(productName: string) {
    await this.getRemoveFromCartButton(productName).click();
  }

  async getCartCount(): Promise<number> {
    try {
      const text = await this.cartBadge.textContent();
      return text ? parseInt(text, 10) : 0;
    } catch {
      return 0;
    }
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async inputYourInformation(userType: keyof typeof checkoutData) {
    const data = checkoutData[userType];
    if (!data) {
      throw new Error(`Checkout data not found for user type: ${userType}`);
    }
    await this.page.locator('[data-test="firstName"]').fill(data.firstName);
    await this.page.locator('[data-test="lastName"]').fill(data.lastName);
    await this.page.locator('[data-test="postalCode"]').fill(data.postalCode);
  }

  async continueCheckout() {
    await this.continueCheckoutButton.click();
  }

  async getItemTotalPrice(): Promise<number> {
    const totalText = await this.page
      .locator('[data-test="subtotal-label"]')
      .textContent();
    const match = totalText?.match(/\$([\d.]+)/);
    if (!match) throw new Error("Item total price not found or not parsable.");
    return parseFloat(match[1]);
  }

  async finishCheckout() {
    await this.finishCheckoutButton.click();
  }
}
