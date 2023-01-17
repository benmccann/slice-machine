import { test as base } from "@playwright/test";
import { MenuPage } from "../pages/menu.page";
import { OnboardingPage } from "../pages/onboarding.page";
import { CreateSliceModalPage } from "../pages/slices/createSliceModal.page";
import { SliceDetailsPage } from "../pages/slices/sliceDetails.page";
import { SliceListPage } from "../pages/slices/sliceList.page";

// Declare the types of your fixtures.
type MyFixtures = {
  createSliceModalPage: CreateSliceModalPage;
  sliceDetailsPage: SliceDetailsPage;
  sliceListPage: SliceListPage;
  onboardingPage: OnboardingPage;
  menu: MenuPage;
};

export const test = base.extend<MyFixtures>({
  menu: async ({ page }, use) => {
    await use(new MenuPage(page));
  },
  onboardingPage: async ({ page }, use) => {
    await use(new OnboardingPage(page));
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
});

export { expect } from "@playwright/test";
