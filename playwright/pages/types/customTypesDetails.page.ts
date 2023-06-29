import { Locator, Page } from "@playwright/test";
import { TypesListPage } from "./TypesList.page";
import { TypeDetailsPage } from "./typeDetails.page";

export class CustomTypesDetailsPage extends TypeDetailsPage {
  constructor(page: Page) {
    super(page);
  }
}
