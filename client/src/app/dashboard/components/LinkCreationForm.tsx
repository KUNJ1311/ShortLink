"use client";

import { useState } from "react";
import Icon from "@/components/ui/AppIcon";
import { createLink } from "@/services/api";

interface LinkCreationFormProps {
  onLinkCreated: () => void;
}

interface FormErrors {
  url?: string;
  customCode?: string;
}

const LinkCreationForm = ({ onLinkCreated }: LinkCreationFormProps) => {
  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Reserved routes that cannot be used as short codes
  const RESERVED_ROUTES = ["dashboard", "healthz"];

  const validateUrl = (urlString: string): boolean => {
    try {
      const urlObj = new URL(urlString);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
      return false;
    }
  };

  const validateCustomCode = (code: string): boolean => {
    if (!code) return true;
    const pattern = /^[A-Za-z0-9]{6,8}$/;
    return pattern.test(code);
  };

  const isReservedCode = (code: string): boolean => {
    return RESERVED_ROUTES.includes(code.toLowerCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: FormErrors = {};

    if (!url.trim()) {
      newErrors.url = "URL is required";
    } else if (!validateUrl(url)) {
      newErrors.url = "Please enter a valid URL (must start with http:// or https://)";
    }

    if (customCode && !validateCustomCode(customCode)) {
      newErrors.customCode = "Custom code must be 6-8 characters (letters and numbers only)";
    } else if (customCode && isReservedCode(customCode)) {
      newErrors.customCode = "This code is reserved and cannot be used";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await createLink(url, customCode || undefined);

      setShowSuccess(true);
      setUrl("");
      setCustomCode("");
      onLinkCreated();

      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (error: unknown) {
      const err = error as Error & { errorCode?: string };

      switch (err.errorCode) {
        case "CODE_EXISTS":
          setErrors({ customCode: "Custom code already exists. Please choose another one." });
          break;
        case "RESERVED_CODE":
          setErrors({ customCode: "This code is reserved and cannot be used." });
          break;
        case "INVALID_CODE_FORMAT":
          setErrors({ customCode: "Code must be 6-8 alphanumeric characters." });
          break;
        case "INVALID_URL":
          setErrors({ url: "Invalid URL provided." });
          break;
        default:
          setErrors({ url: err.message || "Failed to create short link. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon name="LinkIcon" size={24} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Create Short Link</h2>
          <p className="text-sm text-muted-foreground">
            Generate a shortened URL with optional custom code
          </p>
        </div>
      </div>

      {showSuccess && (
        <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg flex items-center gap-3">
          <Icon name="CheckCircleIcon" size={20} className="text-success flex-shrink-0" />
          <p className="text-sm font-medium text-success">Short link created successfully!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-foreground mb-2">
            Target URL <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (errors.url) setErrors({ ...errors, url: undefined });
              }}
              placeholder="https://example.com/your-long-url"
              className={`w-full px-4 py-3 pr-10 border rounded-lg text-sm transition-micro focus:outline-none focus:ring-2 ${
                errors.url
                  ? "border-destructive focus:ring-destructive/20"
                  : "border-input focus:ring-ring/20"
              }`}
              disabled={isLoading}
            />
            <Icon
              name="GlobeAltIcon"
              size={20}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
          </div>
          {errors.url && (
            <p className="mt-2 text-sm text-destructive flex items-center gap-1">
              <Icon name="ExclamationCircleIcon" size={16} />
              {errors.url}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="customCode" className="block text-sm font-medium text-foreground mb-2">
            Custom Code <span className="text-muted-foreground text-xs">(Optional)</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="customCode"
              value={customCode}
              onChange={(e) => {
                setCustomCode(e.target.value);
                if (errors.customCode) setErrors({ ...errors, customCode: undefined });
              }}
              placeholder="mycode123 (6-8 characters)"
              maxLength={8}
              className={`w-full px-4 py-3 pr-10 border rounded-lg text-sm transition-micro focus:outline-none focus:ring-2 ${
                errors.customCode
                  ? "border-destructive focus:ring-destructive/20"
                  : "border-input focus:ring-ring/20"
              }`}
              disabled={isLoading}
            />
            <Icon
              name="CodeBracketIcon"
              size={20}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
          </div>
          {errors.customCode && (
            <p className="mt-2 text-sm text-destructive flex items-center gap-1">
              <Icon name="ExclamationCircleIcon" size={16} />
              {errors.customCode}
            </p>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            Leave empty to generate a random code automatically
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium text-sm transition-micro hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Icon name="ArrowPathIcon" size={20} className="animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Icon name="PlusIcon" size={20} />
              Create Short Link
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default LinkCreationForm;
