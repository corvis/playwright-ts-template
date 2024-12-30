import { expect } from "playwright/test";
import { test } from "@common/base";
import { HomePage } from "../pages/products";

test.describe("Home Page", { tag: "@smoke" }, async () => {
  test.beforeEach(async ({ page }) => {});

  test("Has 'Brands' section", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();
    await expect(homePage.brandsContainer).toBeVisible();
  });

  test("Has 'Category' section", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();
    await expect(homePage.categoriesContainer).toBeVisible();
  });

  test("Can select 'Dress' category", async ({ page, envInfo }) => {
    const homePage = new HomePage(page);
    await homePage.open();
    await homePage.selectSubcategory("Women", "Dress");
    await expect(homePage.mainTitle).toHaveText("Women - Dress Products");
  });
});
