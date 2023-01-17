import { expect } from "@playwright/test";
import { test } from "../fixtures/onboarded";

test("As an onboarded user, I can only use Pascal case slice names", async ({
  browserName,
  sliceListPage,
  createSliceModalPage,
}) => {
  await sliceListPage.goto();
  await sliceListPage.openCreateModal();

  const { nameInput, submitButton } = createSliceModalPage;

  await nameInput.type("Invalid Slice Name");
  await expect(submitButton).toBeDisabled();

  await nameInput.clear();
  await nameInput.type("Invalid_slice_name");
  await expect(submitButton).toBeDisabled();

  await nameInput.clear();
  await nameInput.type("123SliceName");
  await expect(submitButton).toBeDisabled();

  await nameInput.clear();
  await nameInput.type("ValidSliceName");
  await expect(submitButton).toBeEnabled();
});

test("As an onboarded user, I can create a new Slice", async ({
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

  await expect(
    sliceDetailsPage.nonRepeatableZone.getByRole("listitem")
  ).toHaveCount(2);
  await expect(
    sliceDetailsPage.repeatableZone.getByRole("listitem")
  ).toHaveCount(0);
});
