import { test, expect } from "../fixtures/app";

test("As a new user, I can skip the onboarding", async ({
  page,
  menu,
  onboardingPage,
}) => {
  await page.goto("/");

  await onboardingPage.isLoaded();
  await expect(menu.appHeader).not.toBeVisible();

  await onboardingPage.startButton.click();
  await onboardingPage.skip.click();

  await expect(onboardingPage.startButton).not.toBeVisible();
  await expect(menu.appHeader).toBeVisible();

  await page.reload();
  await expect(menu.appHeader).toBeVisible();
});

test("As a new user, I go through the whole onboarding", async ({
  page,
  menu,
  onboardingPage,
}) => {
  await page.goto("/");

  await onboardingPage.isLoaded();
  await expect(menu.appHeader).not.toBeVisible();

  await expect(page).toHaveScreenshot({ fullPage: true });

  await onboardingPage.startButton.click();

  const videos = [
    "Build Slices",
    "Create Page Types",
    "Push your pages to Prismic",
  ];
  for (const [index, videoTitle] of videos.entries()) {
    await onboardingPage.isVideoPlaying(index, videoTitle);
    await onboardingPage.continueButton.click();
  }

  await expect(onboardingPage.continueButton).not.toBeVisible();
  await expect(menu.appHeader).toBeVisible();

  await page.reload();
  await expect(menu.appHeader).toBeVisible();
  // Depending on the number of chars in the SM version, the menu was taking more or less width making the screenshot comparison fail.
  // await expect(page).toHaveScreenshot({fullPage: true, mask: [menu.appVersion, menu.changesIcon]});
});
