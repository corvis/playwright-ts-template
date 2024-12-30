import { BasePage } from "@common/page";
import { Page } from "playwright";
import { LoginForm, SignupStage1Form } from "../components/auth";
import { LoginLogoutController, UserInfo } from "@common/user-management";
import { expect } from "playwright/test";
import { step } from "@common/utils";

export class AuthPage extends BasePage implements LoginLogoutController {
  readonly loginForm: LoginForm;
  readonly signupForm: SignupStage1Form;

  constructor(page: Page) {
    super(page, "/login");
    this.loginForm = new LoginForm(page.locator(".login-form form"), page);
    this.signupForm = new SignupStage1Form(page.locator(".signup-form form"), page);
  }

  async logout() {
    await this.page.goto("/logout");
  }

  @step("Login as {{0.username}}")
  async login(user: UserInfo) {
    await this.open();
    await this.loginForm.login(user.username, user.password);
    await expect(this.page.getByRole("link", { name: "Logout" })).toBeVisible();
  }
}
