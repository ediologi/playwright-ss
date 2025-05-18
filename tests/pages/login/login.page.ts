import {Page, Locator} from '@playwright/test';

export type UserType = 'standard_user' | 'locked_out_user' | 'problem_user' | 'performance_glitch_user' | 'visual_user' | 'error_user';

export class LoginPage {
    readonly page: Page;
    readonly username: Locator;
    readonly password: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.username = page.locator('[data-test="username"]');
        this.password = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-button"]');
    }

    async login(userType: UserType) {
        const username = process.env[`${userType.toUpperCase()}`]!;
        await this.username.fill(username);
        await this.password.fill(process.env.PASSWORD!);
        await this.loginButton.click();
    }
    
    async submitLoginForm() {
        await this.loginButton.click();
    }
}