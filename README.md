# Playwright Demo Project

This project demonstrates the use of Playwright for end-to-end testing.

## Prerequisites

- Node.js (>=18)
- npm or yarn

## Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/ediologi/playwright-demo.git
    cd playwright-demo
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

## Configuration

1.  Create a `.env` file in the root directory.
2.  Add the following environment variables:

    ```
    BASE_URL=https://www.saucedemo.com
    STANDARD_USER=standard_user
    PROBLEM_USER=problem_user
    PERFORMANCE_GLITCH_USER=performance_glitch_user
    LOCKED_OUT_USER=locked_out_user
    ERROR_USER=error_user
    VISUAL_USER=visual_user
    PASSWORD=secret_sauce
    ```

## Running Tests

- Run all tests:

  ```bash
  npm test
  ```

- Run tests in UI mode:

  ```bash
  npm run test:ui
  ```

- Run tests in headed mode:

  ```bash
  npm run test:headed
  ```

## Generating Allure Report

1.  Generate the Allure report:

    ```bash
    npm run allure:generate
    ```

2.  Open the Allure report:

    ```bash
    npm run allure:open
    ```

## Project Structure

    ```

├── data/ # Static test data
├── helpers/ # Utility functions (array utils, price parsing, etc.)
├── pages/ # Page Object Model classes
├── tests/ # Playwright test specs
├── .env # Environment variables (BASE_URL, etc.)
├── playwright.config.ts
├── tsconfig.json
└── package.json
```
