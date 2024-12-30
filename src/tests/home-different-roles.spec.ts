import {test} from "@common/base";
import {expect} from "playwright/test";
import {HomePage} from "../pages/products";
import {UserRole} from "@common/user-management";

test.describe("Home Page: Check different roles", async () => {

    test("Anonymous can see Brands section", async ({page}) => {
        const homePage = new HomePage(page);
        await homePage.open();
        await expect(homePage.brandsContainer).toBeVisible();
    });

    test("Admin user can see Brands section", async ({page, userManager}) => {
        await userManager.login(userManager.getByRole(UserRole.ADMIN));
        const homePage = new HomePage(page);
        await homePage.open();
        await expect(homePage.brandsContainer).toBeVisible();
    });

    test("Ordinary user can see Brands section", async ({page, userManager}) => {
        await userManager.login(userManager.getByRole(UserRole.USER));
        const homePage = new HomePage(page);
        await homePage.open();
        await expect(homePage.brandsContainer).toBeVisible();
    });
});
