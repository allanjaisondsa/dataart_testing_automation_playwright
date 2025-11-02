
export function getProductSelectorByName(productName: string): string {
  return `xpath=//div[contains(@class,"inventory_item")][.//div[@data-test="inventory-item-name" and normalize-space(text())="${productName}"]]`;
}
