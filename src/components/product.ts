import {BaseComponent} from "@common/component";
import {Locator, Page} from "playwright";
import {step} from "@common/utils";

export interface ProductInfo {
    name: string;
    price: number;
    currency: string;
    id: number;
    url: string;
    imageUrl?: string;
    category?: string;
    subcategory?: string;
}

export class ProductUtils {
    static getDetailsPageUrl(id: number) {
        return `/product_details/${id}`;
    }

    static getImageUrl(id: number) {
        return `/get_product_picture/${id}`;
    }
}

export class ProductCard extends BaseComponent {
    readonly addToCartButton: Locator;
    readonly productTitle: Locator;
    readonly productPrice: Locator;

    constructor(root: Locator, page: Page) {
        super(root, page);
        this.addToCartButton = root.locator("button");
        this.productPrice = root.locator(".productinfo > h2").first();
        this.productTitle = root.locator(".productinfo > p").first();
        this.addToCartButton = root.locator("a.add-to-cart").first();
    }

    async getId() {
        return await this.addToCartButton.getAttribute("data-product-id");
    }

    @step("Add product to cart")
    async addToCart() {
        await this.addToCartButton.click();
        await this.page.locator(".modal-confirm button.close-modal").click();
    }

    async getProductInfo(): Promise<ProductInfo> {
        const rawPrice = await this.productPrice.textContent();
        const [currency, price] = rawPrice.split(" ", 2);
        const id = parseInt(await this.getId())
        return {
            name: await this.productTitle.textContent(),
            price: parseFloat(price),
            currency: currency.replace(".", ""),
            id: id,
            url: ProductUtils.getDetailsPageUrl(id),
            imageUrl: ProductUtils.getImageUrl(id)
        } as ProductInfo;
    }
}

export class ProductsGrid extends BaseComponent {
    private readonly productCards: ProductCard[] = [];

    constructor(root: Locator, page: Page) {
        super(root, page);
        this.root.locator(".product-image-wrapper").all();
    }

    async load() {
        const productCards = await this.root.locator(".product-image-wrapper").all();
        this.productCards.length = 0;
        for (const card of productCards) {
            this.productCards.push(new ProductCard(card, this.page));
        }
    }

    async init() {
        if (this.productCards.length === 0) {
            await this.load();
        }
    }

    @step("Get all products")
    async getAllProducts(): Promise<ProductInfo[]> {
        await this.init();
        const result: ProductInfo[] = [];
        for (const productCard of this.productCards) {
            result.push(await productCard.getProductInfo());
        }
        return result;
    }

    @step("Search for product card by name: {{0}}")
    async getProductCardByName(productName: string): Promise<ProductCard | null> {
        await this.init();
        for (const productCard of this.productCards) {
            const productInfo = await productCard.getProductInfo();
            if (productInfo.name === productName) {
                return productCard;
            }
        }
        return null;
    }

}