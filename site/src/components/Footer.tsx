import { LinkedInIcon, TelegramIcon, XIcon } from './icons';

const linkClass =
  'inline-flex items-center gap-1.5 text-(--footer-name) no-underline transition-colors duration-150 hover:text-(--footer-name-hover)';

export function Footer() {
  return (
    <footer className="text-[13px] leading-[18px] text-center pt-12 pb-6 flex flex-col gap-2">
      <p className="text-(--footer-muted)">
        Colorized fork of the{' '}
        <a
          className="text-(--footer-name) no-underline transition-colors duration-150 hover:text-(--footer-name-hover)"
          href="https://github.com/Jakubantalik/thinking-orbs"
          target="_blank"
          rel="noopener noreferrer"
        >
          thinking-orbs
        </a>{' '}
        by Jakub Antalik &amp; Alex Brinza.
      </p>
      <p>
        <span className="text-(--footer-muted)">Made by </span>
        <a
          className="text-(--footer-name) no-underline transition-colors duration-150 hover:text-(--footer-name-hover)"
          href="https://github.com/Bardolog1/thinking-orbs-colorized"
          target="_blank"
          rel="noopener noreferrer"
        >
          Libardo Lozano
        </a>
      </p>
      <p className="text-(--footer-muted)">@Bardolog_1 · Bardolog1</p>
      <p className="flex items-center justify-center gap-3">
        <a
          className={linkClass}
          href="https://x.com/Bardolog_1"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X (Twitter)"
        >
          <XIcon /> X
        </a>
        <a
          className={linkClass}
          href="https://t.me/Bardolog1"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Telegram"
        >
          <TelegramIcon /> Telegram
        </a>
        <a
          className={linkClass}
          href="https://www.linkedin.com/in/Bardolog1"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <LinkedInIcon /> LinkedIn
        </a>
      </p>
    </footer>
  );
}
