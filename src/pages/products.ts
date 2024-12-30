import { Locator, Page } from "playwright";
import { BasePage } from "../common/page";
import { step } from "../common/utils";
import { ProductsGrid } from "../components/product";

abstract class BaseProductListPage extends BasePage {
  readonly categoriesContainer: Locator;
  readonly brandsContainer: Locator;
  readonly mainTitle: Locator;
  readonly featuredItems: ProductsGrid;

  protected constructor(page: Page, pageUrl?: string) {
    super(page, pageUrl);
    this.categoriesContainer = this.page.locator(".category-products");
    this.brandsContainer = this.page.locator(".brands_products .brands-name ul");
    this.mainTitle = this.page.locator(".container .title");
    this.featuredItems = new ProductsGrid(this.page.locator(".features_items"), this.page);
  }

  @step("Select sub-category {{0}} -> {{1}}")
  public async selectSubcategory(categoryName: string, subcategoryName: string) {
    const subcategoryContainer = await this.expandCategory(categoryName);
    await subcategoryContainer.getByText(subcategoryName, { exact: true }).click();
  }

  public async expandCategory(categoryName: string) {
    const categoryLocator = this.categoriesContainer.locator(".panel-heading").getByText(categoryName, { exact: true });
    await categoryLocator.click();
    return this.categoriesContainer.locator(".panel-collapse.in");
  }
}

export class HomePage extends BaseProductListPage {
  readonly recommendedItems: ProductsGrid;

  public constructor(page: Page) {
    super(page, "/");
    this.recommendedItems = new ProductsGrid(this.page.locator(".recommended_items"), this.page);
  }
}

export class ProductsPage extends BaseProductListPage {
  readonly allItemsContainer: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;

  public constructor(page: Page) {
    super(page, "/products");
    this.allItemsContainer = this.page.locator(".features_items");
    this.searchInput = this.page.locator("#search_product");
    this.searchButton = this.page.locator("#submit_search");
  }
}
