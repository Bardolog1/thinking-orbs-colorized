// Storybook config — local showcase only. Never wired into CI or any
// deploy workflow: pages.yml/publish.yml must stay untouched by it.

import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/stories/**/*.stories.tsx'],
  framework: '@storybook/react-vite',
  addons: ['@storybook/addon-essentials'],
  docs: {
    autodocs: true
  }
};

export default config;
