import {expect} from "playwright/test";
import {HomePage} from "../pages/products";
import {readObjectListFromCsv, readObjectListFromYaml, readTestCasesFromYaml} from "../common/data";
import {test} from "@common/base";

interface CategoryTestCase {
    category: string;
    subcategory: string;
    pageTitle: string;
}

test.describe("Home Page", async () => {

    test("Has 'Brands' section", async ({page}) => {
        const homePage = new HomePage(page);
        await homePage.open();
        await expect(homePage.brandsContainer).toBeVisible();
    });

    test.describe("Check if all categories can be opened", async () => {
        let homePage: HomePage;

        test.beforeAll(async ({browser, envInfo}) => {
            homePage = new HomePage(await browser.newPage());
        });

        const categories = readObjectListFromYaml<CategoryTestCase>("categories.yaml");

        for (let c of categories) {
            test(`Can open '${c.category} -> ${c.subcategory}' section`, async ({}) => {
                await homePage.open();
                await homePage.selectSubcategory(c.category, c.subcategory);
                await expect(homePage.mainTitle).toHaveText(c.pageTitle);
            });
        }
    });
});
