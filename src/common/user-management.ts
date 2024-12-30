import {readObjectListFromYaml} from "@common/data";
import {Page} from "playwright";

/**
 * Enum representing user roles.
 */
export enum UserRole {
    ADMIN = "admin",
    USER = "user"
}

/**
 * Interface representing user information.
 */
export interface UserInfo {
    username: string;
    password: string;
    email: string;
    tags: string[];
    role: UserRole;
}

/**
 * Interface representing an object providing login and logout capabilities.
 */
export interface LoginLogoutController {
    /**
     * Logs out the current user.
     * @returns A promise that resolves when the logout is complete.
     */
    logout: () => Promise<void>;

    /**
     * Logs in a user.
     * @param user - The user information.
     * @returns A promise that resolves when the login is complete.
     */
    login: (user: UserInfo) => Promise<void>;
}

/**
 * Class responsible for reading user data from the data files and login\logout into the system.
 */
export class UserManager implements LoginLogoutController {
    private readonly envName: string;
    private readonly page: Page;
    private readonly users: UserInfo[];
    private readonly loginLogoutController?: LoginLogoutController;

    /**
     * Constructs a new UserManager.
     * @param page - The Playwright page instance.
     * @param loginLogoutController - The login and logout controller.
     * @param envName - The environment name (optional).
     */
    constructor(page: Page, loginLogoutController?: LoginLogoutController | null, envName?: string) {
        this.envName = envName;
        this.users = readObjectListFromYaml<UserInfo>("credentials.yaml", this.envName);
        this.page = page;
        this.loginLogoutController = loginLogoutController;
    }

    /**
     * Gets a user by their role.
     * @param role - The user role.
     * @returns The user information.
     * @throws Error if the user with the specified role is not found.
     */
    public getByRole(role: UserRole): UserInfo {
        const userInfo = this.users.find(u => u.role === role);
        if (!userInfo) {
            throw new Error(`User with role ${role} not found`);
        }
        return userInfo;
    }

    /**
     * Gets a user by a tag.
     * @param tag - The tag to search for.
     * @returns The user information.
     * @throws Error if the user with the specified tag is not found.
     */
    public getByTag(tag: string): UserInfo {
        const userInfo = this.users.find(u => u.tags.includes(tag));
        if (!userInfo) {
            throw new Error(`User with tag ${tag} not found`);
        }
        return userInfo;
    }

    /**
     * Gets a user by their username.
     * @param username - The username to search for.
     * @returns The user information.
     * @throws Error if the user with the specified username is not found.
     */
    public getByUsername(username: string): UserInfo {
        const userInfo = this.users.find(u => u.username === username);
        if (!userInfo) {
            throw new Error(`User with username ${username} not found`);
        }
        return userInfo;
    }

    /**
     * Gets a user by their email.
     * @param email - The email to search for.
     * @returns The user information.
     * @throws Error if the user with the specified email is not found.
     */
    public getByEmail(email: string): UserInfo {
        const userInfo = this.users.find(u => u.email === email);
        if (!userInfo) {
            throw new Error(`User with email ${email} not found`);
        }
        return userInfo;
    }

    /**
     * Logs in a user.
     * @param user - The user information.
     * @returns A promise that resolves when the login is complete.
     * @throws Error if the LoginLogoutController is not set.
     */
    public async login(user: UserInfo) {
        if (!this.loginLogoutController) {
            throw new Error("LoginLogoutController is not set");
        }
        await this.loginLogoutController.login(user);
    }

    /**
     * Logs out the current user.
     * @returns A promise that resolves when the logout is complete.
     * @throws Error if the LoginLogoutController is not set.
     */
    public async logout() {
        if (!this.loginLogoutController) {
            throw new Error("LoginLogoutController is not set");
        }
        await this.loginLogoutController.logout();
    }

}