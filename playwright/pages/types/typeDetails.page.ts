import { expect, Locator, Page } from "@playwright/test";

export class TypeDetailsPage {
  readonly page: Page;
  readonly breadcrumb: Locator;
  readonly saveButton: Locator;

  readonly staticZone: Locator;
  readonly repeatableZone: Locator;
  readonly sliceZoneToggle: Locator;
  readonly sliceZonePlaceholder: Locator;
  readonly showSnippetsButton: Locator;
  readonly hideSnippetsButton: Locator;
  readonly toggleSnippetsButton: Locator;
  readonly addFieldsModalTitle: Locator;

  constructor(page: Page) {
    this.page = page;

    this.breadcrumb = page.getByLabel("Breadcrumb");
    this.saveButton = page.getByRole("button", { name: "Save to File System" });

    this.sliceZoneToggle = page.getByRole("button", { name: "switch" });

    this.staticZone = page.getByTestId("ct-static-zone");
    this.repeatableZone = page.getByTestId("slice-repeatable-zone");

    this.sliceZonePlaceholder = page.getByText(
      "Add a field to your Static Zone"
    );
    this.sliceZonePlaceholder = page.getByText(
      "Add a field to your Repeatable Zone"
    );

    // this.addRepeatableFieldButton = page.getByText("add-Repeatable-field");

    this.addFieldsModalTitle = page.getByRole("heading", {
      name: /^Add a new field$/,
    });
  }

  async addField(
    type:
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
      | "Key Text",
    name: string,
    expectedId: string
  ) {
    await this.page.getByTestId("add-Static-field").click();
    await expect(this.addFieldsModalTitle).toBeVisible();
    await this.page.getByRole("heading", { name: type }).click();
    await expect(this.addFieldsModalTitle).not.toBeVisible();
    await this.page.getByPlaceholder("Field Name").type(name);
    await expect(this.page.getByPlaceholder("e.g. buttonLink")).toHaveValue(
      expectedId
    );
    await this.page.getByRole("button", { name: "Add", exact: true }).click();
  }
}
