import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/login.po';
import { InventoryPage } from '../pages/inventory.po';

type Pages = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
};

export const test = baseTest.extend<Pages>({
  loginPage: async ({ page }, use) => {
    const login = new LoginPage(page);
    await use(login);
  },

  inventoryPage: async ({ page }, use) => {
    const inventory = new InventoryPage(page);
    await use(inventory);
  }
});


export const expect = test.expect;
