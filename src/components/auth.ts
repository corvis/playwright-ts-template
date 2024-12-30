import { BaseComponent } from "@common/component";
import { Locator, Page } from "playwright";
import { expect } from "playwright/test";
import { ensureDate, step } from "@common/utils";
import { AddressData, AddressForm } from "./address";

export interface SignupFormData {
  title: string;
  name: string;
  email: string;
  password: string;
  dateOfBirth: Date | string;
  signupForNewsletter: boolean;
  receiveOffersFromPartners: boolean;
  address: AddressData;
}

export abstract class BaseAuthForm extends BaseComponent {
  readonly emailField: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  protected constructor(root: Locator, page: Page) {
    super(root, page);
    this.emailField = root.locator("input[name=email]");
    this.submitButton = root.getByRole("button");
    this.errorMessage = root.locator("p");
  }
}

export class SignupStage1Form extends BaseAuthForm {
  readonly nameField: Locator;

  constructor(root: Locator, page: Page) {
    super(root, page);
    this.nameField = root.locator("input[name=name]");
  }

  @step("Fill into signup stage 1 form")
  async signup(name: string, email: string) {
    await this.nameField.fill(name);
    await this.emailField.fill(email);
    await this.submitButton.click();
    if ((await this.errorMessage.count()) !== 0) {
      throw new Error("Signup failed: " + (await this.errorMessage.textContent()));
    }
    const signup2FormContainer = this.page.locator(".login-form");
    await expect(signup2FormContainer.getByRole("heading", { name: "Enter Account Information" })).toBeVisible();
    return new SignupStage2Form(signup2FormContainer.locator("form"), this.page);
  }
}

export class SignupStage2Form extends BaseAuthForm {
  readonly titleMrOption: Locator;
  readonly titleMrsOption: Locator;
  readonly passwordField: Locator;
  readonly dobDayField: Locator;
  readonly dobMonthField: Locator;
  readonly dobYearField: Locator;
  readonly signupForNewsletterCheckbox: Locator;
  readonly receiveOffersFromPartnersCheckbox: Locator;
  readonly addressForm: AddressForm;

  constructor(root: Locator, page: Page) {
    super(root, page);
    this.titleMrOption = root.locator("input[name=title][value=Mr]");
    this.titleMrsOption = root.locator("input[name=title][value=Mrs]");
    this.passwordField = root.locator("input[name=password]");
    this.dobDayField = root.locator("select[name=days]");
    this.dobMonthField = root.locator("select[name=months]");
    this.dobYearField = root.locator("select[name=years]");
    this.signupForNewsletterCheckbox = root.locator("input[name=newsletter]");
    this.receiveOffersFromPartnersCheckbox = root.locator("input[name=optin]");
    this.addressForm = new AddressForm(root, page);
  }

  async fill(signupData: SignupFormData) {
    if (signupData.title === "Mr") {
      await this.titleMrOption.check();
    } else if (signupData.title === "Mrs") {
      await this.titleMrsOption.check();
    }
    await this.passwordField.fill(signupData.password);
    const dob = ensureDate(signupData.dateOfBirth);
    await this.dobDayField.selectOption({ value: dob.getDate().toString() });
    await this.dobMonthField.selectOption({ value: (dob.getMonth() + 1).toString() });
    await this.dobYearField.selectOption({ value: dob.getFullYear().toString() });
    if (signupData.signupForNewsletter) {
      await this.signupForNewsletterCheckbox.check();
    }
    if (signupData.receiveOffersFromPartners) {
      await this.receiveOffersFromPartnersCheckbox.check();
    }
    await this.addressForm.fill(signupData.address);
  }

  async submit() {
    await this.submitButton.click();
  }

  @step("Fill into signup stage 2 form")
  async createAccount(signupData: SignupFormData) {
    await this.fill(signupData);
    await this.submit();
  }
}

export class LoginForm extends BaseAuthForm {
  readonly passwordField: Locator;

  constructor(root: Locator, page: Page) {
    super(root, page);
    this.passwordField = root.locator("input[name=password]");
  }

  async login(email: string, password: string) {
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await this.submitButton.click();
  }
}
