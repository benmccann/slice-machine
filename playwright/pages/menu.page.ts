import { Locator, Page } from "@playwright/test";

export class MenuPage {
  readonly page: Page;
  readonly root: Locator;
  readonly appHeader: Locator;
  readonly pageTypesLink: Locator;
  readonly customTypesLink: Locator;
  readonly slicesLink: Locator;
  readonly changesLink: Locator;
  readonly tutorialLink: Locator;
  readonly changelogLink: Locator;
  readonly appVersion: Locator;

  constructor(page: Page) {
    this.page = page;
    this.root = page.getByRole("navigation");
    this.appHeader = this.root.locator("h5", { hasText: "Slice Machine" });
    this.pageTypesLink = this.root.getByRole("link", { name: "Page Types" });
    this.customTypesLink = this.root.getByRole("link", {
      name: "Custom Types",
    });
    this.slicesLink = this.root.getByRole("link", { name: "Slices" });
    this.changesLink = this.root.getByRole("link", { name: "Changes" });
    this.tutorialLink = this.root.getByRole("link", {
      name: "Video tutorials",
    });
    this.changelogLink = this.page.getByRole("link", { name: "Changelog" });
    this.appVersion = this.root.locator(
      'a[href="/changelog"] > div:nth-child(2)'
    );
  }
}
