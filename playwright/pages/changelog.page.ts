import { Locator, Page } from "@playwright/test";

export class ChangelogPage {
  readonly page: Page;
  readonly root: Locator;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.root = page.getByRole("main");
    this.title = this.root.getByText("Changelog");
  }
}
