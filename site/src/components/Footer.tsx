export function Footer() {
  return (
    <footer className="text-[13px] leading-[14px] text-center pt-12 pb-6 flex flex-col gap-2">
      <p>
        <span className="text-(--footer-muted)">Made by </span>
        <a
          className="text-(--footer-name) no-underline transition-colors duration-150 hover:text-(--footer-name-hover)"
          href="https://x.com/jakubantalik"
          target="_blank"
          rel="noopener noreferrer"
        >
          Jakub Antalik
        </a>
        <span className="text-(--footer-muted)"> &amp; </span>
        <a
          className="text-(--footer-name) no-underline transition-colors duration-150 hover:text-(--footer-name-hover)"
          href="https://x.com/a_brinza"
          target="_blank"
          rel="noopener noreferrer"
        >
          Alex Brinza
        </a>
      </p>
      <p className="text-(--footer-muted)">
        Fork:{' '}
        <a
          className="text-(--footer-name) no-underline transition-colors duration-150 hover:text-(--footer-name-hover)"
          href="https://github.com/Bardolog1/thinking-orbs-colorized"
          target="_blank"
          rel="noopener noreferrer"
        >
          Bardolog1/thinking-orbs-colorized
        </a>
      </p>
    </footer>
  );
}
