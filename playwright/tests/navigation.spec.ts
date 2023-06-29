import { expect } from "@playwright/test";
import { test } from "../fixtures/app";

test("Navigate through all menu entries", async ({
  page,
  menu,
  sliceListPage,
  customTypesListPage,
  pageTypesListPage,
  changesPage,
  changelogPage,
}) => {
  await page.goto("/");

  await menu.customTypesLink.click();
  await expect(customTypesListPage.title).toBeVisible();
  expect(await page.title()).toContain("Custom types - Slice Machine");

  await menu.pageTypesLink.click();
  await expect(pageTypesListPage.title).toBeVisible();
  expect(await page.title()).toContain("Page types - Slice Machine");

  await menu.slicesLink.click();
  await expect(sliceListPage.title).toBeVisible();
  await page.waitForLoadState();
  expect(await page.title()).toContain("Slices - Slice Machine");

  await menu.changesLink.click();
  await expect(changesPage.title).toBeVisible();
  expect(await page.title()).toContain("Changes - Slice Machine");

  await menu.changelogLink.click();
  await expect(changelogPage.title).toBeVisible();
  expect(await page.title()).toContain("Changelog - Slice Machine");
});
