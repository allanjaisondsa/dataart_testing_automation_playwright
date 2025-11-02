import { Page, Locator } from '@playwright/test';
import { getProductSelectorByName } from '../utils/selectors';

export class InventoryPage {
  readonly page: Page;
  readonly inventoryList: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryList = page.locator('.inventory_list');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
  }

  async isVisible(): Promise<boolean> {
    return await this.inventoryList.isVisible();
  }

  async addProductByName(productName: string): Promise<void> {
    const productContainerSelector = getProductSelectorByName(productName);
    const addButton = this.page.locator(productContainerSelector + ' >> button', { hasText: 'Add to cart' });
    await addButton.click();
  }

  async removeProductByName(productName: string): Promise<void> {
    const productContainerSelector = getProductSelectorByName(productName);
    const removeButton = this.page.locator(productContainerSelector + ' >> button', { hasText: 'Remove' });
    await removeButton.click();
  }

  async getCartCount(): Promise<number> {
    if (!(await this.cartBadge.count())) return 0;
    const text = await this.cartBadge.textContent();
    return text ? Number(text.trim()) : 0;
  }

  async getAllProductNames(): Promise<string[]> {
    return await this.page.locator('.inventory_item_name').allTextContents();
  }

  async getProductPrice(productName: string): Promise<string> {
  
    const productContainerSelector = getProductSelectorByName(productName);
    console.log('Product container selector:', productContainerSelector);


    const productContainer = this.page.locator(productContainerSelector);
    const priceLocator = productContainer.locator('.inventory_item_price');

    const priceText = await priceLocator.textContent();
    return (priceText || '').trim();
  }


  async printProductsWithPriceToConsole(): Promise<void> {
    const names = await this.getAllProductNames();
    for (const name of names) {
      const price = await this.getProductPrice(name); 
      const normalized = (price || '').replace(/^\$/, '') + '$';
      console.log(`${name} costs ${normalized}`);
    }
  }
}
