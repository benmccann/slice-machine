import { expect, Locator, Page } from "@playwright/test";

export class RenameTypeModalPage {
  readonly page: Page;
  readonly title: Locator;
  readonly nameInput: Locator;
  readonly closeButton: Locator;
  readonly cancelButton: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    const root = page.getByRole("dialog", { name: "Rename a custom type" });
    this.title = root.getByRole("heading", {
      name: /Rename a (page|custom) type/,
    });
    this.nameInput = root.getByTestId("custom-type-name-input");
    this.closeButton = root.getByRole("button", { name: "Close" });
    this.cancelButton = root.getByRole("button", { name: "Cancel" });
    this.submitButton = root.getByRole("button", { name: "Rename" });
  }

  async renameType(newName: string) {
    await expect(this.title).toBeVisible();
    await this.nameInput.fill(newName);
    await this.submitButton.click();
    await expect(this.title).not.toBeVisible();
  }
}
