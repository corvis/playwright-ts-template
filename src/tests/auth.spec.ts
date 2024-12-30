import {test} from "@common/base";
import {AuthPage} from "../pages/auth";
import {readTestCasesFromYaml, TestCase} from "@common/data";
import {SignupFormData} from "../components/auth";
import {generateRandomString, render_template} from "@common/utils";

interface SignupExpectedResult {
    success: boolean;
    errorMessage?: string;
}

test.describe("Registration", async () => {
    test.describe("Register", async () => {
        let authPage: AuthPage;

        test.beforeAll(async ({browser}) => {
            authPage = new AuthPage(await browser.newPage());
        });

        test.beforeEach(async ({}) => {
            await authPage.open();
        });

        test.afterEach(async ({}) => {
            await authPage.logout();
        });

        const testCases = readTestCasesFromYaml<TestCase<SignupFormData, SignupExpectedResult>>("signup-test-cases.yaml");
        for (let tc of testCases) {
            test(`${tc.id}: ${tc.name}`, async ({envInfo}) => {
                const randomStr = generateRandomString(5);
                const email = render_template(tc.input.email, {suffix: randomStr});
                try {
                    const form2 = await authPage.signupForm.signup(
                        `User ${envInfo.testRunIdShort}`,
                        email
                    );
                    await form2.createAccount(tc.input);
                } catch (error) {
                    if (tc.expected.success) {
                        throw error;
                    }
                }
            });
        }
    });
});