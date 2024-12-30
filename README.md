# QA Automation Example Project (Playwrite + TypeScript)

This project is designed as an example for QA automation engineers. It demonstrates the structure of a typical 
automation project, provides common utility functions, and showcases best practices and patterns for writing automated 
tests using TypeScript and Playwright.

## Setup

**Prerequisites**

* Node.js (version 16 or higher)
* npm (version 6 or higher)

# Installation

1. Download repository as a ZIP file and unzip it to your desired location
2. Open the project in your favorite IDE (e.g. WebStorm or Visual Studio Code)
3. Open a terminal and navigate to the project root directory
4. Run `npm install` to install all dependencies
5. If you **don't have** Playwright installed globally, run `npx playwright install`
6. Copy file `.env.template` to `.env` and fill in the required values

## Useful Commands

* `npm run test` - run all tests in headless mode (default)
* `npm run headed` - run all tests in headed mode with 1 single worker 
* `npm run ui` - launch Playwright's UI tool

# Common Classes and Functions

## Base Classes

### BasePage

An abstract class that provides common functionality for all page objects.

Typical usage:
    
```typescript
import { BasePage } from "@common/page";
import { Page } from "playwright";

class HomePage extends BasePage {
    constructor(page: Page) {
        super(page, "/");
    }
}
```

### BaseComponent

An abstract class that provides common functionality for all component objects (including forms).

Typical usage:

```typescript
import { BaseComponent } from "@common/component";

export abstract class AuthForm extends BaseComponent {
    readonly emailField: Locator;
    readonly submitButton: Locator;

    protected constructor(root: Locator, page: Page) {
        super(root, page);
        this.emailField = root.locator("input[name=email]");
        this.submitButton = root.getByRole("button");
    }
}
```

# Credits

* Dmitry Berezovsky (@corvis) - author and main maintainer

# Disclaimer

This project template is licensed under MIT. This means you are free to use it in commercial projects.

The MIT license clearly explains that there is no warranty for this free software. 
Please see the included LICENSE file for details.