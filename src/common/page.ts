import {Page} from "playwright";

/**
 * Represents a base page in the application.
 */
export abstract class BasePage {
    public page: Page;
    public pageUrl: string;

    /**
     * Constructs a new BasePage.
     * @param page - The Playwright page instance.
     * @param pageUrl - The URL of the page.
     */
    protected constructor(page: Page, pageUrl: string) {
        this.page = page;
        this.pageUrl = pageUrl;
    }

    /**
     * Opens the page using the provided URL.
     * @throws Error if the pageUrl is not set.
     */
    public async open() {
        if (this.pageUrl) {
            return await this.page.goto(this.pageUrl);
        } else {
            throw new Error("pageUrl is not set for " + this.constructor.name);
        }
    }
}