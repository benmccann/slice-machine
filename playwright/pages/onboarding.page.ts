import { expect, Locator, Page } from "@playwright/test";

export class OnboardingPage {
  readonly page: Page;
  readonly welcome: Locator;
  readonly startButton: Locator;
  readonly continueButton: Locator;
  readonly video: Locator;
  readonly skip: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcome = page.getByText("Welcome to Slice Machine");
    this.skip = page.getByText("skip");
    this.startButton = page.getByRole("button", { name: "Get Started" });
    this.continueButton = page.getByTitle("Continue");
    this.video = page.locator("video");
  }

  async isLoaded() {
    await expect(this.startButton).toBeVisible();
  }

  async isVideoPlaying(index: number, videoTitle: string) {
      await expect(this.video.nth(index)).toBeVisible();
      await expect(this.video.nth(index)).toHaveJSProperty("paused", false);
      await expect(
        this.page.getByRole("heading", { name: videoTitle })
      ).toBeVisible();
  }

}
