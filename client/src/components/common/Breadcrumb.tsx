"use client";

import Link from "next/link";
import Icon from "@/components/ui/AppIcon";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center gap-2">
            {index > 0 && (
              <Icon
                name="ChevronRightIcon"
                size={16}
                className="text-muted-foreground flex-shrink-0"
              />
            )}

            {item.path && !isLast ? (
              <Link
                href={item.path}
                className="text-muted-foreground hover:text-primary transition-micro font-medium"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={`font-medium ${isLast ? "text-muted-foreground" : "text-muted-foreground"}`}
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
