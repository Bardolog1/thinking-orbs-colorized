import { GitHubIcon, LinkedInIcon, TelegramIcon, XIcon } from './icons';

const iconBtnClass =
  'flex items-center justify-center size-9 border-none rounded-full bg-(--icon-btn-bg) text-inherit cursor-pointer no-underline transition-[background-color] duration-200 [-webkit-tap-highlight-color:transparent] hover:bg-(--icon-btn-hover) focus-visible:outline-2 focus-visible:outline-(--icon-btn-outline) focus-visible:outline-offset-2 [&_svg]:block [&_svg]:shrink-0 [&_svg]:fill-(--icon-btn-fill) [&_svg]:opacity-60 [&_svg]:transition-opacity [&_svg]:duration-200 hover:[&_svg]:opacity-100';

export function Header() {
  return (
    <header className="relative w-full flex flex-col items-center justify-end pt-16 pb-12 text-center max-sm:pt-14 max-sm:pb-10">
      <nav className="absolute top-4 right-0 flex items-center gap-4 max-sm:top-3" aria-label="External links">
        <a
          className={iconBtnClass}
          href="https://github.com/Bardolog1/thinking-orbs-colorized"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub repository (fork)"
        >
          <GitHubIcon />
        </a>
        <a
          className={iconBtnClass}
          href="https://x.com/Bardolog_1"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow on X (Twitter)"
        >
          <XIcon />
        </a>
        <a
          className={iconBtnClass}
          href="https://t.me/Bardolog1"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact on Telegram"
        >
          <TelegramIcon />
        </a>
        <a
          className={iconBtnClass}
          href="https://www.linkedin.com/in/Bardolog1"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Connect on LinkedIn"
        >
          <LinkedInIcon />
        </a>
      </nav>
      <h1 className="text-[22px] font-medium leading-[30px] text-(--title-color)">
        Thinking orbs <span className="t-wordmark">colorized</span>
      </h1>
      <p className="text-sm font-normal leading-[21px] text-(--subtitle-color) opacity-50">
        Colorized thinking orbs · by Libardo Lozano
      </p>
    </header>
  );
}
