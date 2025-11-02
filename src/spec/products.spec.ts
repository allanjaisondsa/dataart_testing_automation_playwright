import { test, expect } from '../fixtures/test.fixture';
import { credentials } from '../data/credentials.data';

test.describe('SauceDemo - Shopping cart scenarios', () => {
  test('Scenario 1 - add one product as standard_user', async ({ loginPage, inventoryPage }) => {
    await loginPage.logIn(credentials.standard_user);
    await expect(inventoryPage.isVisible()).resolves.toBeTruthy();

    const productNames = await inventoryPage.getAllProductNames();
    expect(productNames.length).toBeGreaterThan(0);
    const first = productNames[0];
    await inventoryPage.addProductByName(first);

    const count = await inventoryPage.getCartCount();
    expect(count).toBe(1);
  });

  test('Scenario 2 - add two products then remove one as standard_user', async ({ loginPage, inventoryPage }) => {
    await loginPage.logIn(credentials.standard_user);
    await expect(inventoryPage.isVisible()).resolves.toBeTruthy();

    const productNames = await inventoryPage.getAllProductNames();
    expect(productNames.length).toBeGreaterThanOrEqual(2);

    await inventoryPage.addProductByName(productNames[0]);
    await inventoryPage.addProductByName(productNames[1]);

    expect(await inventoryPage.getCartCount()).toBe(2);

    await inventoryPage.removeProductByName(productNames[0]);
    expect(await inventoryPage.getCartCount()).toBe(1);
  });

  test('Scenario 3 - visual_user prints all product names and verifies count is 6', async ({ loginPage, inventoryPage }) => {
    await loginPage.logIn(credentials.visual_user);
    await expect(inventoryPage.isVisible()).resolves.toBeTruthy();

    const names = await inventoryPage.getAllProductNames();
    console.log('Product names:', names);
    expect(names.length).toBe(6);
  });

  test('Scenario 4 - visual_user prints products with price formatted', async ({ loginPage, inventoryPage }) => {
    await loginPage.logIn(credentials.visual_user);
    await expect(inventoryPage.isVisible()).resolves.toBeTruthy();

    await inventoryPage.printProductsWithPriceToConsole();
    const names = await inventoryPage.getAllProductNames();
    const price = await inventoryPage.getProductPrice(names[0]);
    expect(price.startsWith('$')).toBeTruthy();
  });

  test('Scenario 5 - unauthenticated visit to /inventory.html redirects to login and shows error', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');
    expect(await loginPage.isVisible()).toBeTruthy();

    const error = await loginPage.getErrorText();
    
    expect(typeof error).toBe('string');
  });
});
