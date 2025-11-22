"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/AppIcon";
import { listLinks, deleteLink, Link as ApiLink } from "@/services/api";
import DeleteConfirmDialog from "@/components/common/DeleteConfirmDialog";

interface LinksTableProps {
  variant: "dashboard" | "statistics";
  title?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  refreshTrigger?: number;
}

const LinksTable = ({
  variant,
  title,
  emptyTitle,
  emptyDescription,
  refreshTrigger = 0,
}: LinksTableProps) => {
  const router = useRouter();
  const [links, setLinks] = useState<ApiLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  // Sorting State
  type SortField = "clicks" | "created_at" | "last_clicked_at" | null;
  type SortDirection = "asc" | "desc";
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // UI State
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<{ id: number; code: string } | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const fetchLinks = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await listLinks(
        currentPage,
        itemsPerPage,
        searchQuery,
        sortField || undefined,
        sortDirection
      );
      setLinks(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch links:", error);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchQuery, refreshTrigger, sortField, sortDirection]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New field, default to descending
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return (
        <div className="flex flex-col -space-y-1">
          <Icon name="ChevronUpIcon" size={12} className="text-muted-foreground" />
          <Icon name="ChevronDownIcon" size={12} className="text-muted-foreground" />
        </div>
      );
    }
    return sortDirection === "asc" ? (
      <Icon name="ChevronUpIcon" size={14} className="text-primary" />
    ) : (
      <Icon name="ChevronDownIcon" size={14} className="text-primary" />
    );
  };

  const handleCopy = async (shortUrl: string, id: number) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const openDeleteDialog = (id: number, code: string) => {
    setLinkToDelete({ id, code });
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!linkToDelete) return;

    setDeletingId(linkToDelete.id);
    setDeleteError(null);
    try {
      await deleteLink(linkToDelete.code);
      fetchLinks(); // Refresh list
      setDeleteDialogOpen(false);
      setLinkToDelete(null);
    } catch (err: unknown) {
      const error = err as Error & { errorCode?: string };

      switch (error.errorCode) {
        case "NOT_FOUND":
          setDeleteError("Link not found or already deleted.");
          break;
        case "INTERNAL_ERROR":
          setDeleteError("Server error. Please try again later.");
          break;
        default:
          setDeleteError(error.message || "Failed to delete link. Please try again.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleRowNavigation = (code: string) => {
    router.push(`/code/${code}`);
  };

  const handleRowKeyDown = (e: React.KeyboardEvent, code: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleRowNavigation(code);
    }
  };

  const truncateUrl = (url: string, maxLength: number = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + "...";
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const defaultTitle = variant === "dashboard" ? "Recent Links" : "All Links";
  const defaultEmptyTitle = "No links created yet";
  const defaultEmptyDescription = "Get started by creating your first short link above.";

  if (!isHydrated) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-foreground">{title || defaultTitle}</h2>

        <div className="relative">
          <input
            type="text"
            placeholder="Search links..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-micro"
          />
          <Icon
            name="MagnifyingGlassIcon"
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg shadow-card overflow-hidden">
        {isLoading && links.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : links.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Icon name="LinkIcon" size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">
              {emptyTitle || defaultEmptyTitle}
            </h3>
            <p className="text-muted-foreground max-w-sm">{emptyDescription || defaultEmptyDescription}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wider">
                      Short Code
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wider">
                      Target URL
                    </th>
                    <th
                      className="px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wider text-right cursor-pointer hover:text-muted-foreground transition-colors select-none"
                      onClick={() => handleSort("clicks")}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>Clicks</span>
                        <SortIcon field="clicks" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wider text-right cursor-pointer hover:text-muted-foreground transition-colors select-none"
                      onClick={() => handleSort("last_clicked_at")}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>Last Clicked</span>
                        <SortIcon field="last_clicked_at" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-foreground uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {links.map((link) => (
                    <tr
                      key={link.id}
                      className="group hover:bg-muted/50 transition-colors duration-150 cursor-pointer"
                      onClick={() => handleRowNavigation(link.code)}
                      onKeyDown={(e) => handleRowKeyDown(e, link.code)}
                      tabIndex={0}
                      role="button"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                            {link.code}
                          </code>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 max-w-xs md:max-w-md">
                          <span
                            className="text-sm text-foreground truncate"
                            title={link.original_url}
                          >
                            {truncateUrl(link.original_url)}
                          </span>
                          <a
                            href={link.original_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Icon name="ArrowTopRightOnSquareIcon" size={14} />
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm font-medium text-foreground">
                          {link.total_clicks.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm text-muted-foreground">
                          {formatDate(link.last_clicked_at)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/code/${link.code}`}
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 text-muted-foreground rounded-lg hover:text-primary hover:bg-primary/10 transition-colors"
                            title="View Statistics"
                          >
                            <Icon name="ChartBarIcon" size={18} />
                          </Link>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(link.short_url, link.id);
                            }}
                            className="p-2 text-muted-foreground rounded-lg hover:text-primary hover:bg-primary/10 transition-colors"
                            title="Copy Short URL"
                          >
                            <Icon
                              name={copiedId === link.id ? "CheckIcon" : "ClipboardDocumentIcon"}
                              size={18}
                            />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeleteDialog(link.id, link.code);
                            }}
                            disabled={deletingId === link.id}
                            className="p-2 text-muted-foreground rounded-lg hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                            title="Delete Link"
                          >
                            {deletingId === link.id ? (
                              <Icon name="ArrowPathIcon" size={18} className="animate-spin" />
                            ) : (
                              <Icon name="TrashIcon" size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-border flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm font-medium text-foreground hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm font-medium text-foreground hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {linkToDelete && (
        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          code={linkToDelete.code}
          onConfirm={handleDelete}
          isDeleting={deletingId === linkToDelete.id}
          error={deleteError}
        />
      )}
    </div>
  );
};

export default LinksTable;
