// All 22 curated palettes on one canvas. Toggle the preview substrate
// (light/dark) from the Theme toolbar; each orb renders theme="auto" so
// it resolves the matching ramp from the wrapper's data-theme. States
// cycle across the grid so every palette is seen in several animations.

import type { Meta, StoryObj } from '@storybook/react';
import { PALETTES } from '../palettes';
import { ThinkingOrb } from '../ThinkingOrb';
import type { OrbState } from '../types';

const STATES: OrbState[] = ['working', 'searching', 'solving', 'listening', 'composing', 'shaping'];

const meta = {
  title: 'ThinkingOrb/Palette Gallery',
  component: ThinkingOrb,
  parameters: { layout: 'fullscreen' }
} satisfies Meta<typeof ThinkingOrb>;

// biome-ignore lint/style/noDefaultExport: Storybook CSF requires a default export
export default meta;

type Story = StoryObj<typeof meta>;

export const AllPalettes: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '1rem',
        width: '100%'
      }}
    >
      {PALETTES.map((palette, index) => (
        <div
          key={palette.id}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            border: '1px solid rgba(128,128,128,0.25)',
            borderRadius: '8px',
            background: 'rgba(128,128,128,0.06)'
          }}
        >
          <ThinkingOrb state={STATES[index % STATES.length]} size={64} theme="auto" palette={palette.id} />
          <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{palette.name}</div>
          <div style={{ fontSize: '0.7rem', opacity: 0.6, fontFamily: 'ui-monospace, monospace' }}>{palette.id}</div>
        </div>
      ))}
    </div>
  )
};
