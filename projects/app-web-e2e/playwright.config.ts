import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { workspaceRoot } from '@nx/devkit';
import { nxE2EPreset } from '@nx/playwright/preset';
import { defineConfig, devices } from '@playwright/test';

// patch cjs
const __filename = fileURLToPath(import.meta.url);

const baseURL = process.env.BASE_URL ?? 'http://localhost:4000';

// having a million issues trying to use __dirname to establish a reliable path
// so it's easier to do this to handle the case when this file gets parsed for
// building our nx graph
const projectRoot = process.cwd().includes('app-web-e2e')
  ? process.cwd()
  : `${process.cwd()}/projects/app-web-e2e`;

const dotEnvFile = path.join(projectRoot, '.env');

process.loadEnvFile(dotEnvFile);

export default defineConfig({
  ...nxE2EPreset(__filename, { testDir: './src' }),
  outputDir: '.test-results',
  timeout: 60 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'yarn dev:app-web',
    url: 'http://localhost:4000',
    reuseExistingServer: !process.env.CI,
    cwd: workspaceRoot,
    stdout: 'pipe',
    timeout: 60 * 1000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});
