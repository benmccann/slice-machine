import { Locator, Page } from "@playwright/test";
import { TypesListPage } from "./TypesList.page";

export class PageTypesListPage extends TypesListPage {
  constructor(page: Page) {
    super(page, "Page Types", "/page-types");
  }
}
