import { expect, Locator, Page } from "@playwright/test";

export class CreateTypeModalPage {
  readonly page: Page;
  readonly title: Locator;
  readonly nameInput: Locator;
  readonly closeButton: Locator;
  readonly cancelButton: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    const root = page.getByTestId("create-ct-modal");
    this.title = root.getByRole("heading", {
      name: /Create a new (page|custom) type/,
    });
    this.nameInput = root.getByTestId("ct-name-input");
    this.closeButton = root.getByRole("button", { name: "Close" });
    this.cancelButton = root.getByRole("button", { name: "Cancel" });
    this.submitButton = root.getByRole("button", { name: "Create" });
  }

  async createType(name: string) {
    await expect(this.title).toBeVisible();
    await this.nameInput.fill(name);
    await this.submitButton.click();
    await expect(this.title).not.toBeVisible();
  }
}
