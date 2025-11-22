"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  code: string;
  currentUrl: string;
  onSave: (newUrl: string) => Promise<void>;
}

export default function EditLinkDialog({
  open,
  onOpenChange,
  code,
  currentUrl,
  onSave,
}: EditLinkDialogProps) {
  const [url, setUrl] = useState(currentUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateUrl = (urlString: string): boolean => {
    try {
      const urlObj = new URL(urlString);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleSave = async () => {
    if (!url.trim()) {
      setError("URL is required");
      return;
    }

    if (!validateUrl(url)) {
      setError("Please enter a valid URL (must start with http:// or https://)");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await onSave(url);
      onOpenChange(false);
    } catch (err: unknown) {
      const error = err as Error & { errorCode?: string };

      switch (error.errorCode) {
        case "NOT_FOUND":
          setError("Link not found or already deleted.");
          break;
        case "INVALID_URL":
          setError("Invalid URL provided. Please check the URL format.");
          break;
        case "INTERNAL_ERROR":
          setError("Server error. Please try again later.");
          break;
        default:
          setError(error.message || "Failed to update link. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Link</DialogTitle>
          <DialogDescription>
            Update the destination URL for <span className="font-mono font-semibold">{code}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="url">Destination URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError("");
              }}
              className="col-span-3"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
