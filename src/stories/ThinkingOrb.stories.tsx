// Playground story: every public prop as a live control. The orb
// re-renders in place as controls change. `palette` exercises the id and
// CSS-shorthand resolution paths, `colors` the per-role overlay, and
// `theme` resolves against the preview substrate (see .storybook/preview.ts).

import type { Meta, StoryObj } from '@storybook/react';
import { PALETTES } from '../palettes';
import { ThinkingOrb } from '../ThinkingOrb';
import type { OrbState } from '../types';

const STATES: OrbState[] = ['working', 'searching', 'solving', 'listening', 'composing', 'shaping'];

// The 22 curated ids plus a CSS shorthand and a color name, exercising
// the palette prop's id | CSS-shorthand resolution paths.
const PALETTE_OPTIONS: string[] = [...PALETTES.map((p) => p.id), '#0ea5e9', 'red'];

const meta = {
  title: 'ThinkingOrb/Playground',
  component: ThinkingOrb,
  argTypes: {
    state: { control: 'select', options: STATES },
    size: { control: 'select', options: [64, 20] },
    theme: { control: 'select', options: ['auto', 'dark', 'light'] },
    speed: { control: { type: 'range', min: 0, max: 3, step: 0.1 } },
    paused: { control: 'boolean' },
    palette: { control: 'select', options: PALETTE_OPTIONS },
    colors: { control: 'object' },
    'aria-label': { control: 'text' }
  }
} satisfies Meta<typeof ThinkingOrb>;

// biome-ignore lint/style/noDefaultExport: Storybook CSF requires a default export
export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    state: 'working',
    size: 64,
    theme: 'auto',
    speed: 1,
    paused: false,
    palette: 'ocean'
  }
};
