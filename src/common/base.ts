import {test as base, mergeTests} from '@playwright/test';
import * as env from 'env-var';
import {UserManager} from "@common/user-management";
import {AuthPage} from "../pages/auth";

/**
 * Interface representing environment information.
 */
interface EnvInfo {
    name: string;
    testRunId: string;
    testRunIdShort: string;
}

/**
 * Type representing a fixture that is aware of the environment.
 */
type EnvironmentAwareFixture = {
    envInfo: EnvInfo;
}

/**
 * Type representing a fixture that is aware of the user manager.
 */
type UserManagerAwareFixture = {
    userManager: UserManager;
}

/**
 * Extends the base test with environment information.
 */
export const envAwareTest = base.extend<EnvironmentAwareFixture>({
    envInfo: async ({}, use) => {
        const e = {
            name: env.get("TARGET_ENV").required().asString(),
            testRunIdShort: env.get("_TR_TEST_RUN_SHORT_ID").required().asString(),
            testRunId: env.get("_TR_TEST_RUN_UUID").required().asString()
        } as EnvInfo;
        await use(e);
    }
});

/**
 * Extends the environment-aware test with user manager information.
 */
export const userManagerAwareTest = envAwareTest.extend<UserManagerAwareFixture>({
    userManager: async ({page, envInfo}, use) => {
        const authPage = new AuthPage(page);
        const um = new UserManager(page, authPage, envInfo.name);
        await use(um);
    }
});

export const test = mergeTests(userManagerAwareTest);