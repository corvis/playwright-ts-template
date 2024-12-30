import {expect} from "playwright/test";
import {test} from "@common/base";
import {HomePage} from "../pages/products";

test.describe("Home Page", {tag: "@smoke"}, async () => {

    test("Has 'Brands' section", async ({page}) => {
        const homePage = new HomePage(page);
        await homePage.open();
        await expect(homePage.brandsContainer).toBeVisible();
    });

    test.describe("Check if all can be opened", async () => {
        for (let categoryFullName of ["Women/Tops", "Women/Saree", "Men/Tshirts"]) {
            const [ categoryName, subcategoryName ] = categoryFullName.split("/", 2);
            test(`Can open '${categoryName} -> ${subcategoryName}' section`, async ({page}) => {
                const homePage = new HomePage(page);
                await homePage.open();
                await homePage.selectSubcategory(categoryName, subcategoryName);
            });
        }
    });
});
