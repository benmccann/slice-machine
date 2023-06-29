import { Locator, Page } from "@playwright/test";

export class TypesListPage {
  readonly page: Page;
  readonly root: Locator;
  readonly path: string;
  readonly title: Locator;
  readonly createButton: Locator;
  readonly actionIcon: Locator;

  protected constructor(page: Page, title: string, path: string) {
    this.page = page;
    this.path = path;
    this.root = page.getByRole("main");
    this.title = this.root.getByLabel("Breadcrumb").getByText(title);
    this.createButton = this.root
      .getByTestId("create-ct")
      .or(
        this.root.getByRole("article").getByRole("button", { name: "Create" })
      );
    this.actionIcon = this.root.getByTestId("ct-action-icon");
  }

  async goto() {
    await this.page.goto("/custom-types");
    await this.title.isVisible();
  }

  getRow(name: string): Locator {
    return this.page.getByRole("row", {
      name,
    });
  }

  async clickRow(name: string) {
    await this.getRow(name).getByRole("button", { name }).click();
  }

  async openCreateModal() {
    await this.createButton.first().click();
  }

  async openActionModal(name: string, action: "Rename" | "Delete") {
    await this.getRow(name).locator('[data-testid="editDropdown"]').click();
    await this.page.getByRole("menuitem", { name: action }).click();
  }
}
