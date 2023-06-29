import { Locator, Page } from "@playwright/test";

export class SliceListPage {
  readonly page: Page;
  readonly title: Locator;
  readonly root: Locator;
  readonly createButton: Locator;
  readonly actionIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    this.root = page.getByRole("main").first();
    this.title = this.root.getByRole("link", { name: "Slices", exact: true });
    this.createButton = this.root
      .getByRole("button", { name: "Create one" })
      .or(this.root.getByRole("button", { name: "Create a Slice" }));
    this.actionIcon = this.root.getByTestId("slice-action-icon");
  }

  async goto() {
    await this.page.goto("/slices");
  }

  getCard(name: string): Locator {
    return this.root.getByRole("button", {
      name: `${name} slice card`,
      exact: true,
    });
  }

  async clickSliceCard(name: string) {
    // Make sure not to accidentaly click on a button that would trigger another action
    await this.getCard(name).getByRole("button", { name }).click();
  }

  async openCreateModal() {
    await this.createButton.first().click();
  }

  async openActionModal(name: string, action: "Rename" | "Delete") {
    await this.getCard(name)
      .getByTestId("slice-action-icon-dropdown")
      .getByText(action)
      .click();
  }

  async openScreenshotModal(name: string) {
    await this.getCard(name).getByRole("button", {
      name: "Update Screenshot",
    });
  }
}
