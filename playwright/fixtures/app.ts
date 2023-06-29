import { test as base } from "@playwright/test";
import { MenuPage } from "../pages/menu.page";
import { CreateSliceModalPage } from "../pages/slices/createSliceModal.page";
import { CreateTypeModalPage } from "../pages/types/createTypeModal.page";
import { SliceDetailsPage } from "../pages/slices/sliceDetails.page";
import { SliceListPage } from "../pages/slices/sliceList.page";
import { CustomTypesListPage } from "../pages/types/customTypesList.page";
import { PageTypesListPage } from "../pages/types/pageTypesList.page";
import { ChangesPage } from "../pages/changes.page";
import { ChangelogPage } from "../pages/changelog.page";
import { CustomTypesDetailsPage } from "../pages/types/customTypesDetails.page";
import { RenameTypeModalPage } from "../pages/types/renameTypeModal.page";

// Declare the types of your fixtures.
type MyFixtures = {
  createSliceModalPage: CreateSliceModalPage;
  sliceDetailsPage: SliceDetailsPage;
  sliceListPage: SliceListPage;
  customTypesListPage: CustomTypesListPage;
  customTypesDetailsPage: CustomTypesDetailsPage;
  createTypeModalPage: CreateTypeModalPage;
  renameTypeModalPage: RenameTypeModalPage;
  pageTypesListPage: PageTypesListPage;
  changesPage: ChangesPage;
  changelogPage: ChangelogPage;
  menu: MenuPage;
};

export const test = base.extend<MyFixtures>({
  menu: async ({ page }, use) => {
    await use(new MenuPage(page));
  },
  createSliceModalPage: async ({ page }, use) => {
    await use(new CreateSliceModalPage(page));
  },
  sliceDetailsPage: async ({ page }, use) => {
    await use(new SliceDetailsPage(page));
  },
  sliceListPage: async ({ page }, use) => {
    await use(new SliceListPage(page));
  },
  customTypesListPage: async ({ page }, use) => {
    await use(new CustomTypesListPage(page));
  },
  customTypesDetailsPage: async ({ page }, use) => {
    await use(new CustomTypesDetailsPage(page));
  },
  pageTypesListPage: async ({ page }, use) => {
    await use(new PageTypesListPage(page));
  },
  createTypeModalPage: async ({ page }, use) => {
    await use(new CreateTypeModalPage(page));
  },
  renameTypeModalPage: async ({ page }, use) => {
    await use(new RenameTypeModalPage(page));
  },
  changesPage: async ({ page }, use) => {
    await use(new ChangesPage(page));
  },
  changelogPage: async ({ page }, use) => {
    await use(new ChangelogPage(page));
  },
});

export { expect } from "@playwright/test";
