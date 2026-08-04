const QUICK_START = `import { ThinkingOrb } from 'thinking-orbs-colorized';

export function App() {
  return (
    <ThinkingOrb
      state="working"
      size={64}
      palette="ocean"
      colors={{ particle: '#ff6b6b' }}
    />
  );
}`;

/**
 * Install + quick start snippet, with a link to the local Storybook
 * workflow documented in the README.
 */
export function QuickStart() {
  return (
    <section className="w-full flex flex-col gap-4" aria-label="Quick start">
      <div className="flex flex-col gap-1.5">
        <h2 className="flex items-center gap-2 text-base font-normal leading-[34px] text-(--section-title-color)">
          <span className="t-title-mark" aria-hidden="true" />
          Quick start
        </h2>
        <p className="text-sm leading-[21px] text-(--text-muted)">
          Install the package and drop in an orb. Explore every state, size, palette
          and control locally with{' '}
          <code className="font-[Roboto_Mono,monospace] text-[13px]">npm run storybook</code>.
        </p>
      </div>
      <div className="rounded-[10px] bg-(--code-bg) p-4 overflow-x-auto">
        <code className="font-[Roboto_Mono,monospace] text-[13px] leading-[22px] text-(--code-text) whitespace-pre block">
          {`npm install thinking-orbs-colorized\n\n${QUICK_START}`}
        </code>
      </div>
    </section>
  );
}
