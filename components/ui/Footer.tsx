export function Footer() {
  return (
    <footer className="border-t border-espresso/10 mt-24">
      <div className="mx-auto max-w-5xl px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-espresso-soft">
        <p>© {new Date().getFullYear()} Mohamed Faisal Sindhi.</p>
        <div className="flex items-center gap-5">
          <a
            href="https://linkedin.com/in/mdfaisalsindhi"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-terracotta-dark transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/MdFaisalS2025"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-terracotta-dark transition-colors"
          >
            GitHub
          </a>
          <a
            href="mailto:faisalmd543@gmail.com"
            className="hover:text-terracotta-dark transition-colors"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
