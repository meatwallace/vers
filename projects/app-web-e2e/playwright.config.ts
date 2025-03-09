import { workspaceRoot } from '@nx/devkit';
import { nxE2EPreset } from '@nx/playwright/preset';
import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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
  expect: {
    timeout: 10 * 1000,
  },
  outputDir: '.test-results',
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
  timeout: 60 * 1000,
  use: {
    baseURL,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'yarn dev:app-web',
    cwd: workspaceRoot,
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    timeout: 60 * 1000,
    url: 'http://localhost:4000',
  },
});
