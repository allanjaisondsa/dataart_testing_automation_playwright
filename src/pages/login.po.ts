import { Page, Locator } from '@playwright/test';
import { TCredentials } from '../types/TCredentials';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly loginContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.loginContainer = page.locator('.login_wrapper');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async logIn(creds: TCredentials): Promise<void> {
    await this.goto();
    await this.usernameInput.fill(creds.username);
    await this.passwordInput.fill(creds.password);
    await this.loginButton.click();
    
    await Promise.race([
      this.page.waitForSelector('.inventory_list', { timeout: 4000 }).catch(() => {}),
      this.errorMessage.waitFor({ timeout: 4000 }).catch(() => {})
    ]);
  }

  async isVisible(): Promise<boolean> {
    return await this.loginContainer.isVisible();
  }

  async getErrorText(): Promise<string> {
    return await this.errorMessage.innerText().catch(() => '');
  }
}
