// Light vs dark on the substrates they were tuned for — a manual
// cross-hue contrast QA surface. Orbs are pinned (theme="light"/"dark")
// with the background they belong on; the state control sweeps the same
// palettes across all six animations.

import type { Meta, StoryObj } from '@storybook/react';
import { ThinkingOrb } from '../ThinkingOrb';
import type { OrbState } from '../types';

const PANELS: Array<{ label: string; theme: 'light' | 'dark'; background: string; ink: string }> = [
  { label: 'Light substrate', theme: 'light', background: '#fafafa', ink: '#18181b' },
  { label: 'Dark substrate', theme: 'dark', background: '#101013', ink: '#f4f4f5' }
];

const PALETTES: string[] = ['mono', 'graphite', 'ocean', 'sunset', 'matrix', 'midnight'];

const STATES: OrbState[] = ['working', 'searching', 'solving', 'listening', 'composing', 'shaping'];

const meta = {
  title: 'ThinkingOrb/Theme',
  component: ThinkingOrb,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    state: { control: 'select', options: STATES }
  }
} satisfies Meta<typeof ThinkingOrb>;

// biome-ignore lint/style/noDefaultExport: Storybook CSF requires a default export
export default meta;

type Story = StoryObj<typeof meta>;

export const BothThemes: Story = {
  args: { state: 'searching' },
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', width: '100%' }}>
      {PANELS.map((panel) => (
        <div
          key={panel.label}
          style={{
            background: panel.background,
            borderRadius: '12px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <div style={{ fontWeight: 600, color: panel.ink }}>{panel.label}</div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {PALETTES.map((palette) => (
              <ThinkingOrb key={palette} state={args.state as OrbState} size={64} theme={panel.theme} palette={palette} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
};
