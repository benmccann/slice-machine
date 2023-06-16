import { expect, Locator, Page } from "@playwright/test";

export class AddFieldModalPage {
  readonly page: Page;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByRole("heading", { name: "Add a new field" });
  }

  async pickField(
    fieldType:
      | "Rich Text"
      | "Image"
      | "Link"
      | "Link to media"
      | "Content Relationship"
      | "Select"
      | "Boolean"
      | "Date"
      | "Timestamp"
      | "Embed"
      | "Number"
      | "GeoPoint"
      | "Color"
      | "Key Text"
  ) {
    await this.page.getByRole("heading", { name: fieldType }).click();
    await expect(this.title).not.toBeVisible();
  }
}
