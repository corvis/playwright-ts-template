import { expect } from "playwright/test";
import { HomePage } from "../../pages/products";
import { readObjectListFromYaml } from "@common/data";
import { performanceTest } from "@common/performance";

interface CategoryTestCase {
  category: string;
  subcategory: string;
  pageTitle: string;
}

performanceTest.describe("Home Page", async () => {
  performanceTest("Open Home Page", async ({ page, performance }) => {
    const SAMPLE_NAME = "Open Home Page";
    const homePage = new HomePage(page);
    performance.sampleStart(SAMPLE_NAME);
    await homePage.open();
    await expect(homePage.brandsContainer).toBeVisible();
    performance.sampleEnd(SAMPLE_NAME);
  });

  performanceTest.describe("Open Category Pages", async () => {
    let homePage: HomePage;
    const SAMPLE_NAME = "Open Category";

    performanceTest.beforeAll(async ({ browser, envInfo }) => {
      homePage = new HomePage(await browser.newPage());
    });

    const categories = readObjectListFromYaml<CategoryTestCase>("categories.yaml");

    for (let c of categories) {
      const testName = `Open '${c.category} -> ${c.subcategory}' category`;
      performanceTest(testName, async ({ performance }) => {
        await homePage.open();
        performance.sampleStart(SAMPLE_NAME);
        performance.sampleStart(testName);
        await homePage.selectSubcategory(c.category, c.subcategory);
        await expect(homePage.mainTitle).toHaveText(c.pageTitle);
        performance.sampleEnd(SAMPLE_NAME);
        performance.sampleEnd(testName);
      });
    }
  });
});
