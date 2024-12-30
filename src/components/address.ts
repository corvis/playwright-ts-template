import { Locator, Page } from "playwright";
import { BaseComponent } from "@common/component";

export interface AddressData {
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  mobile: string;
}

export class AddressForm extends BaseComponent {
  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly companyField: Locator;
  readonly address1Field: Locator;
  readonly address2Field: Locator;
  readonly cityField: Locator;
  readonly stateField: Locator;
  readonly zipField: Locator;
  readonly mobileField: Locator;
  readonly countryField: Locator;

  constructor(root: Locator, page: Page) {
    super(root, page);
    this.firstNameField = root.locator("input[name=first_name]");
    this.lastNameField = root.locator("input[name=last_name]");
    this.companyField = root.locator("input[name=company]");
    this.address1Field = root.locator("input[name=address1]");
    this.address2Field = root.locator("input[name=address2]");
    this.cityField = root.locator("input[name=city]");
    this.stateField = root.locator("input[name=state]");
    this.zipField = root.locator("input[name=zipcode]");
    this.mobileField = root.locator("input[name=mobile_number]");
    this.countryField = root.locator("select[name=country]");
  }

  async fill(address: AddressData) {
    await this.firstNameField.fill(address.firstName);
    await this.lastNameField.fill(address.lastName);
    await this.companyField.fill(address.company);
    await this.address1Field.fill(address.address1);
    await this.address2Field.fill(address.address2);
    await this.cityField.fill(address.city);
    await this.stateField.fill(address.state);
    await this.zipField.fill(address.zip);
    await this.mobileField.fill(address.mobile);
    await this.countryField.selectOption({ label: address.country });
  }
}
