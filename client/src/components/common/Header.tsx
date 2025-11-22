"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/ui/AppIcon";
import Image from "next/image";

interface NavigationItem {
  label: string;
  path: string;
  icon: string;
}

const Header = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems: NavigationItem[] = [
    { label: "Dashboard", path: "/", icon: "HomeIcon" },
    { label: "Link Statistics", path: "/code", icon: "ChartBarIcon" },
    { label: "System Health", path: "/healthz", icon: "ServerIcon" },
  ];

  const isActivePath = (path: string) => {
    if (path === "/") {
      return pathname === "/" || pathname === "/dashboard";
    }
    if (path === "/code") {
      return pathname.startsWith("/code");
    }
    return pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] bg-surface border-b border-border shadow-card">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          aria-label="ShortLink Home"
        >
          <Image src="/logo.svg" alt="ShortLink Logo" width={35} height={35} />
          <span className="text-xl font-semibold text-foreground">ShortLink</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium
                transition-micro
                ${
                  isActivePath(item.path)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-muted-foreground"
                }
              `}
              aria-current={isActivePath(item.path) ? "page" : undefined}
            >
              <Icon name={item.icon as any} size={18} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-md text-muted-foreground hover:bg-muted hover:text-muted-foreground transition-micro"
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          <Icon name={isMobileMenuOpen ? "XMarkIcon" : "Bars3Icon"} size={24} />
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface shadow-elevated z-[1001]">
          <nav className="flex flex-col p-4 gap-2" aria-label="Mobile navigation">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium
                  transition-micro
                  ${
                    isActivePath(item.path)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-muted-foreground"
                  }
                `}
                aria-current={isActivePath(item.path) ? "page" : undefined}
              >
                <Icon name={item.icon as any} size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
