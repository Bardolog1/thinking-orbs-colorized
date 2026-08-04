import { useEffect, useState } from 'react';

export type Theme = 'auto' | 'dark' | 'light';

const prefersDark = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches;

/**
 * Page-level theme state. Always mirrors a concrete `data-theme` onto
 * `<html>` so the site CSS (`html[data-theme="light"]` overrides) and the
 * orbs' `useResolvedDark` ancestor lookup stay consistent. `'auto'` follows
 * the OS preference live.
 */
export function useTheme(initial: Theme = 'auto'): [Theme, (t: Theme) => void] {
  const [theme, setTheme] = useState<Theme>(initial);

  useEffect(() => {
    const apply = (t: Theme) => {
      const el = document.documentElement;
      if (t === 'auto') {
        el.dataset.theme = prefersDark() ? 'dark' : 'light';
      } else {
        el.dataset.theme = t;
      }
    };
    apply(theme);

    if (theme === 'auto') {
      const mq = matchMedia('(prefers-color-scheme: dark)');
      const onMq = () => apply('auto');
      mq.addEventListener('change', onMq);
      return () => mq.removeEventListener('change', onMq);
    }
  }, [theme]);

  return [theme, setTheme];
}
