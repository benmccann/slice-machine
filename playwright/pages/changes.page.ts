import { Locator, Page } from "@playwright/test";

export class ChangesPage {
  readonly page: Page;
  readonly root: Locator;
  readonly title: Locator;
  readonly pushButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.root = page.getByRole("main").first();
    this.title = this.root.getByRole("link", { name: "Changes" });
    this.title = this.root.getByRole("button", { name: "Push Changes" });
  }
}
