import { Locator, Page } from "@playwright/test";
import { TypesListPage } from "./TypesList.page";

export class CustomTypesListPage extends TypesListPage {
  constructor(page: Page) {
    super(page, "Custom Types", "/custom-types");
  }
}
