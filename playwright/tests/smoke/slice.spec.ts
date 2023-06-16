import { expect } from "@playwright/test";
import { test } from "../../fixtures/onboarded";

test.only("As an onboarded user, I can create a new Slice", async ({
  sliceDetailsPage,
  sliceListPage,
  createSliceModalPage,
}) => {
  await sliceListPage.goto();
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
  await expect(sliceDetailsPage.page.getByText("Slice saved")).toBeVisible();

  await sliceListPage.goto();
  await expect(sliceListPage.getSliceCard(sliceName)).toBeVisible();
});
