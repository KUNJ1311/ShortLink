"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import LinkMetricsCard from "./LinkMetricsCard";
import LinkInfoCard from "./LinkInfoCard";
import DeviceBreakdown from "./DeviceBreakdown";
import { getLinkStats, deleteLink, updateLink, LinkStats } from "@/services/api";
import Icon from "@/components/ui/AppIcon";
import EditLinkDialog from "@/components/common/EditLinkDialog";
import DeleteConfirmDialog from "@/components/common/DeleteConfirmDialog";

interface DeviceData {
  type: string;
  clicks: number;
  percentage: number;
  icon: string;
}

interface LinkStatisticsInteractiveProps {
  code: string;
}

export default function LinkStatisticsInteractive({ code }: LinkStatisticsInteractiveProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<LinkStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchLinkData = useCallback(async () => {
    try {
      const data = await getLinkStats(code);
      setStats(data);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load statistics";
      console.error("Error fetching stats:", err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [code]);

  // Initial fetch
  useEffect(() => {
    fetchLinkData();
  }, [fetchLinkData]);

  // Polling every 10 seconds for real-time updates
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isLoading && !error) {
        fetchLinkData();
      }
    }, 10000); // 10 seconds

    return () => clearInterval(intervalId);
  }, [fetchLinkData, isLoading, error]);

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteLink(code);
      router.push("/dashboard");
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

      setIsDeleting(false);
    }
  };

  const handleEdit = async (newUrl: string) => {
    await updateLink(code, newUrl);
    // Refresh the stats to show updated URL
    await fetchLinkData();
    setIsEditOpen(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="animate-pulse space-y-4 sm:space-y-6">
          <div className="h-32 bg-muted rounded"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="h-40 bg-muted rounded"></div>
            <div className="h-40 bg-muted rounded"></div>
          </div>
          <div className="h-80 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-surface border border-border rounded-lg shadow-card">
        <div className="bg-destructive/10 p-4 rounded-full mb-4">
          <Icon name="ExclamationCircleIcon" size={32} className="text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Failed to load statistics</h3>
        <p className="text-muted-foreground max-w-md mb-6">
          {error || "Link not found or accessed denied."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-micro"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Process Device Data
  const totalDeviceClicks = Object.values(stats.analytics.devices).reduce((a, b) => a + b, 0);
  const deviceData: DeviceData[] = Object.entries(stats.analytics.devices).map(([type, count]) => {
    let icon = "ComputerDesktopIcon";
    if (type === "mobile") icon = "DevicePhoneMobileIcon";
    if (type === "tablet") icon = "DeviceTabletIcon";

    return {
      type: type.charAt(0).toUpperCase() + type.slice(1),
      clicks: count,
      percentage: totalDeviceClicks > 0 ? Math.round((count / totalDeviceClicks) * 100) : 0,
      icon,
    };
  });

  // Sort by clicks desc
  deviceData.sort((a, b) => b.clicks - a.clicks);

  // Fallback if no device data
  if (deviceData.length === 0 && stats.total_clicks > 0) {
    deviceData.push({
      type: "Unknown",
      clicks: stats.total_clicks,
      percentage: 100,
      icon: "QuestionMarkCircleIcon",
    });
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Link Information Card */}
      <LinkInfoCard
        code={stats.code}
        targetUrl={stats.original_url}
        createdDate={new Date(stats.created_at).toLocaleDateString()}
        status="active"
        onEdit={() => setIsEditOpen(true)}
        onDelete={() => setIsDeleteOpen(true)}
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <LinkMetricsCard
          title="Total Clicks"
          value={stats.total_clicks.toLocaleString()}
          icon="clicks"
          // trend={undefined} // No trend data available from backend currently
        />
        <LinkMetricsCard
          title="Last Clicked"
          value={formatDate(stats.last_clicked_at)}
          icon="clock"
        />
      </div>

      {/* Device Insights */}
      {/* Only show if there are clicks */}
      {stats.total_clicks > 0 ? (
        <div className="grid grid-cols-1">
          <DeviceBreakdown data={deviceData} />
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-lg p-8 text-center shadow-card">
          <p className="text-muted-foreground">
            No analytics data available yet. Share your link to start tracking!
          </p>
        </div>
      )}

      {/* Auto-refresh indicator */}
      <div className="text-center text-xs text-muted-foreground">
        <Icon name="ArrowPathIcon" size={12} className="inline mr-1" />
        Auto-refreshing every 10 seconds
      </div>

      {/* Edit Dialog */}
      <EditLinkDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        code={stats.code}
        currentUrl={stats.original_url}
        onSave={handleEdit}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        code={stats.code}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        error={deleteError}
      />
    </div>
  );
}
