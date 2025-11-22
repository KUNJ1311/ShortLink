"use client";

import { useState, useEffect } from "react";
import Icon from "@/components/ui/AppIcon";
import { Button } from "@/components/ui/button";

interface LinkInfoCardProps {
  code: string;
  targetUrl: string;
  createdDate: string;
  status: "active" | "inactive";
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function LinkInfoCard({
  code,
  targetUrl,
  createdDate,
  onEdit,
  onDelete,
}: LinkInfoCardProps) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const shortUrl = origin ? `${origin}/${code}` : `/${code}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 shadow-card">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex-1 min-w-0 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground break-all font-mono">
                {origin ? `${origin.replace(/^https?:\/\//, "")}/` : "/"}
                <span className="text-primary">{code}</span>
              </h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
                Active
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Created on {createdDate}</p>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
              Destination URL
            </h3>
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border overflow-hidden">
              <Icon name="GlobeAltIcon" size={18} className="text-muted-foreground flex-shrink-0" />
              <a
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary truncate transition-colors flex-1"
                title={targetUrl}
              >
                {targetUrl}
              </a>
              <a
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
              >
                <Icon name="ArrowTopRightOnSquareIcon" size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 pt-1">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={handleCopy}
              variant={copied ? "outline" : "default"}
              size="default"
              className={
                copied
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                  : ""
              }
            >
              <Icon name={copied ? "CheckIcon" : "ClipboardDocumentIcon"} size={18} />
              <span className="ml-2">{copied ? "Copied!" : "Copy Link"}</span>
            </Button>

            {onEdit && (
              <Button onClick={onEdit} variant="outline" size="default">
                <Icon name="PencilIcon" size={18} />
                <span className="ml-2">Edit URL</span>
              </Button>
            )}

            {onDelete && (
              <Button
                onClick={onDelete}
                variant="outline"
                size="default"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Icon name="TrashIcon" size={18} />
                <span className="ml-2">Delete</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
