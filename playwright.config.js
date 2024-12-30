import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import * as env from 'env-var';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const isCI = env.get("CI").asBool();

export default defineConfig({
    testDir: "./src/tests",
    testMatch: "*spec.ts",
    /* Maximum time one test can run for. */
    timeout: 30 * 1000,
    expect: {
        /**
         * Maximum time expect() should wait for the condition to be met.
         * For example in `await expect(locator).toHaveText();`
         */
        timeout: 5000,
    },
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: isCI,
    /* Retry on CI only */
    retries: isCI ? 2 : 1,
    /* Opt out of parallel tests on CI. */
    workers: env.get("PARALLEL_WORKERS").default("3").asIntPositive(),
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [["list"], ["html", { open: "never", outputFolder: "outputs/report" }]],

    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    globalSetup: "./src/common/global-setup",
    globalTeardown: "./src/common/global-teardown",
    use: {
        // Emulates the user locale.
        locale: "en-US",

        browserName: "firefox",
        /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
        actionTimeout: 15 * 1000,
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: env.get("BASE_URL").required().asString(),

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: "retain-on-failure",
        video: "on-first-retry",
        screenshot: "on",

        // launchOptions: {
        //   slowMo: 500,
        // },

        viewport: { width: 1366, height: 768 },
    },
    outputDir: 'outputs/',
});