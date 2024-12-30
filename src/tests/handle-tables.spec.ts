import {test} from "@common/base";
import {readObjectListFromCsv} from "@common/data";
import {HomePage} from "../pages/products";
import {ProductInfo} from "../components/product";
import {expect} from "playwright/test";

interface PriceEntry {
    productName: string,
    price: string | number,
    currency: string
}

test.describe("Products", async () => {

    test("Make sure key products are visible", async ({page}) => {
        const homePage = new HomePage(page);
        await homePage.open();
        const expectedProducts = ["Blue Top", "Sleeveless Dress"];
        for (let productName of expectedProducts) {
            await test.step("Check product " + productName, async () => {
                const productCard = await homePage.featuredItems.getProductCardByName(productName);
                expect(productCard).toBeDefined();
                await expect(productCard.root).toBeVisible();
            });
        }
    });

    test.describe("Make sure prices for key products are correct", async () => {
        const expectedPrices = readObjectListFromCsv<PriceEntry>("prices.csv");
        let productsData: ProductInfo[] = [];

        test.beforeAll(async ({browser}) => {
            const homePage = new HomePage(await browser.newPage());
            await homePage.open();
            productsData = await homePage.featuredItems.getAllProducts();
        });

        for (let entry of expectedPrices) {
            test(`Make sure the price for ${entry.productName} is ${entry.price} ${entry.currency}`, async ({page}) => {
                const product = productsData.find(p => p.name === entry.productName);
                expect(product).toBeDefined();
                expect(product.price).toBe(entry.price);
                expect(product.currency).toBe(entry.currency);
            });
        }
    })

    test("Add multiple products to cart", async ({page}) => {
        const productsToAdd = ["Blue Top", "Sleeveless Dress"];
        const homePage = new HomePage(page);
        await homePage.open();
        for (let productName of productsToAdd) {
            await test.step("Add product " + productName, async () => {
                const productCard = await homePage.featuredItems.getProductCardByName(productName);
                await productCard.addToCart();
            });
        }
        // Todo: Add check that cart contains all products...
    });

});