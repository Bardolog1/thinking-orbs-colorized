// Preview decorators + toolbar globals. A `theme` toolbar (auto/dark/light)
// drives a dotted substrate grid behind every story and sets `data-theme`
// on the wrapper, so orbs with theme="auto" resolve the same substrate
// the human is looking at. `auto` follows the OS prefers-color-scheme.

import type { CSSProperties } from 'react';
import { createElement } from 'react';
import type { Preview } from '@storybook/react';

const SUBSTRATES: Record<'dark' | 'light', { background: string; grid: string; text: string }> = {
  dark: { background: '#101013', grid: 'rgba(255,255,255,0.06)', text: '#f4f4f5' },
  light: { background: '#fafafa', grid: 'rgba(0,0,0,0.07)', text: '#18181b' }
};

function resolveSubstrate(value: unknown): 'dark' | 'light' {
  if (value === 'dark' || value === 'light') return value;
  return typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

const preview: Preview = {
  initialGlobals: {
    theme: 'auto'
  },
  globalTypes: {
    theme: {
      description: 'Substrate behind the orbs; auto follows the OS scheme.',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'auto', title: 'Auto' },
          { value: 'dark', title: 'Dark' },
          { value: 'light', title: 'Light' }
        ],
        dynamicTitle: true
      }
    }
  },
  decorators: [
    (Story, context) => {
      const substrate = resolveSubstrate(context.globals.theme);
      const colors = SUBSTRATES[substrate];
      const style: CSSProperties = {
        minHeight: '100vh',
        padding: '2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
        background: colors.background,
        backgroundImage: `radial-gradient(${colors.grid} 1px, transparent 1px)`,
        backgroundSize: '22px 22px',
        color: colors.text,
        fontFamily: 'system-ui, sans-serif'
      };
      return createElement('div', { 'data-theme': substrate, style }, createElement(Story));
    }
  ]
};

export default preview;
