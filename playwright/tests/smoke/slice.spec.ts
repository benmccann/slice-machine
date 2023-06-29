import { expect } from "@playwright/test";
import { test } from "../../fixtures/onboarded";

test("I can create a new Slice", async ({
  sliceDetailsPage,
  sliceListPage,
  createSliceModalPage,
  menu,
  page,
}) => {
  await page.goto("/");
  await menu.slicesLink.click();
  await sliceListPage.openCreateModal();

  const randomInt = Math.floor(Math.random() * 1e9);
  const sliceName = "Slice" + randomInt;
  await createSliceModalPage.createSlice(sliceName);

  await expect(sliceDetailsPage.title).toBeVisible();
  await expect(sliceDetailsPage.title).toContainText(sliceName);

  await expect(sliceDetailsPage.staticZonePlaceholder).toBeVisible();
  await expect(sliceDetailsPage.repeatableZonePlaceholder).toBeVisible();
  await expect(sliceDetailsPage.saveButton).toBeDisabled();

  await sliceDetailsPage.addStaticField(
    "Rich Text",
    "Slice Title",
    "slice_title"
  );

  await expect(sliceDetailsPage.staticZone.getByRole("listitem")).toHaveCount(
    1
  );
  await expect(
    sliceDetailsPage.repeatableZone.getByRole("listitem")
  ).toHaveCount(0);

  await sliceDetailsPage.saveButton.click();
  await expect(sliceDetailsPage.saveButton).toBeDisabled();
  await expect(sliceDetailsPage.page.getByText("Model saved")).toBeVisible();

  await menu.slicesLink.click();
  await expect(sliceListPage.getCard(sliceName)).toBeVisible();
});
