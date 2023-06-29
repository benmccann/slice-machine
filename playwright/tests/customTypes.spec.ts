import { expect } from "@playwright/test";
import { test } from "../fixtures/onboarded";

test("I can create a new Custom Type", async ({
  customTypesListPage,
  createTypeModalPage,
  customTypesDetailsPage,
  renameTypeModalPage,
  menu,
}) => {
  await customTypesListPage.goto();
  await customTypesListPage.openCreateModal();

  const randomInt = Math.floor(Math.random() * 1e9);
  const name = "Custom Type " + randomInt;
  await createTypeModalPage.createType(name);

  await expect(customTypesDetailsPage.breadcrumb).toContainText(name);

  await expect(
    customTypesDetailsPage.staticZone.getByRole("listitem")
  ).toHaveCount(1);

  await menu.customTypesLink.click();

  await customTypesListPage.openActionModal(name, "Rename");

  const newName = name + " - Edited";
  await renameTypeModalPage.renameType(name + " - Edited");

  await customTypesListPage.getRow(newName).click();
  await expect(customTypesDetailsPage.breadcrumb).toContainText(newName);
});
