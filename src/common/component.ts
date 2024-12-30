import { Locator, Page } from "playwright";

/**
 * Represents a base component in the application.
 */
export class BaseComponent {
  readonly root: Locator;
  readonly page: Page;

  /**
   * Represents a base component in the application.
   */
  constructor(componentRoot: Locator, page: Page) {
    this.root = componentRoot;
    this.page = page;
  }
}
