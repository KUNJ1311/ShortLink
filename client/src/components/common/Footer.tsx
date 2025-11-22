"use client";

import Icon from "@/components/ui/AppIcon";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="LinkIcon" size={24} className="text-primary" />
              <h3 className="text-lg font-bold text-foreground">LinkShort</h3>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              Fast, simple, and reliable URL shortener with analytics.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-start justify-start">
            <h4 className="text-sm font-semibold text-foreground mb-3">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm">
              <a href="/" className="text-muted-foreground hover:text-primary transition-colors">
                Home
              </a>
              <a
                href="/code"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Statistics Dashboard
              </a>
              <a
                href="/healthz"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                System Health
              </a>
            </div>
          </div>

          {/* Connect Section */}
          <div className="flex flex-col items-center md:items-end">
            <h4 className="text-sm font-semibold text-foreground mb-3">Connect</h4>
            <div className="flex gap-4">
              <a
                href="https://github.com/KUNJ1311"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="GitHub Profile"
                title="GitHub"
              >
                <Icon name="CodeBracketIcon" size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/kunj-faladu/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="LinkedIn Profile"
                title="LinkedIn"
              >
                <Icon name="BriefcaseIcon" size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Icon name="HeartIcon" size={16} className="text-red-500" />
              <span>
                Built with passion by{" "}
                <a
                  href="https://www.linkedin.com/in/kunj-faladu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary hover:underline"
                >
                  Kunj Faladu
                </a>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span>© {currentYear} LinkShort</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-xs">v1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
