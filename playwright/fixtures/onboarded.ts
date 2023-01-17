import { test as base } from "./app";
import config from "../playwright.config";

const onboardedModel = {
  userContext: JSON.stringify({
    hasSendAReview: true,
    isOnboarded: true,
    updatesViewed: { latest: null, latestNonBreaking: null },
    hasSeenSimulatorToolTip: true,
    hasSeenTutorialsTooTip: true,
    authStatus: "unknown",
    lastSyncChange: null,
  }),
};

// fixture to provide tests with a page containing the localStorage of an onboarded user to disable user guides and tutorials.
export const test = base.extend<{}>({
  page: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: {
        cookies: [],
        origins: [
          {
            origin: config.use?.baseURL || "",
            localStorage: [
              {
                name: "persist:root",
                value: JSON.stringify(onboardedModel),
              },
            ],
          },
        ],
      },
    });
    const page = await context.newPage();

    // Use the fixture value in the test.
    await use(page);

    // Gracefully close up everything
    await page.close();
    await context.close();
    await browser.close();
  },
});
export { expect } from "@playwright/test";
