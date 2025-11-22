"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Icon from "@/components/ui/AppIcon";
import SystemStatusCard from "./SystemStatusCard";
import ServiceStatusTable from "./ServiceStatusTable";
import { checkHealth, HealthCheckResponse } from "@/services/api";

interface SystemStatusData {
  title: string;
  status: "operational" | "degraded" | "down";
  value: string;
  description: string;
  icon: string;
  lastChecked: string;
}

interface ServiceStatus {
  id: number;
  service: string;
  status: "healthy" | "warning" | "critical";
  responseTime: string;
  lastCheck: string;
  message: string;
}

const SystemHealthInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [lastRefresh, setLastRefresh] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [healthData, setHealthData] = useState<HealthCheckResponse | null>(null);
  const [totalLatency, setTotalLatency] = useState<number>(0);
  const [error, setError] = useState<boolean>(false);
  const isLoadingRef = useRef(false);

  const fetchHealthStatus = useCallback(async () => {
    if (isLoadingRef.current) return;

    isLoadingRef.current = true; // Set immediately to block concurrent calls
    setIsRefreshing(true);
    const startTime = performance.now();

    try {
      const data = await checkHealth();
      const endTime = performance.now();
      const total = Math.round(endTime - startTime);

      setHealthData(data);
      setTotalLatency(total);
      setError(false);
    } catch (err) {
      console.error("Health check failed:", err);
      setError(true);
      setHealthData(null);
    } finally {
      setLastRefresh(
        new Date().toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setIsRefreshing(false);
      isLoadingRef.current = false; // Release the lock
    }
  }, []);

  useEffect(() => {
    setIsHydrated(true);

    fetchHealthStatus();

    // Auto refresh every 30 seconds
    const interval = setInterval(() => {
      fetchHealthStatus();
    }, 30000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m ${Math.floor(seconds % 60)}s`;
  };

  // Default values for loading/error states
  const systemStatus: SystemStatusData[] = [
    {
      title: "Overall System Status",
      status: error ? "down" : healthData?.ok ? "operational" : "degraded",
      value: error ? "Error" : healthData?.ok ? "100%" : "Degraded",
      description: error ? "Cannot reach server" : "All systems operational",
      icon: "CheckCircleIcon",
      lastChecked: "Just now",
    },
    {
      title: "Database Connection",
      status: error
        ? "down"
        : healthData?.services.database === "operational"
          ? "operational"
          : "down",
      value: error
        ? "Disconnected"
        : healthData?.services.database === "operational"
          ? "Connected"
          : "Disconnected",
      description: error
        ? "Connection failed"
        : healthData?.services.database === "operational"
          ? "Pool active"
          : "Connection failed",
      icon: "CircleStackIcon",
      lastChecked: "Just now",
    },
    {
      title: "Total Response Time",
      status: error ? "down" : totalLatency < 500 ? "operational" : "degraded",
      value: `${totalLatency}ms`,
      description: "Complete request round-trip",
      icon: "BoltIcon",
      lastChecked: "Just now",
    },
    {
      title: "System Uptime",
      status: error ? "down" : "operational",
      value: error ? "-" : healthData ? formatUptime(healthData.uptime) : "-",
      description: error
        ? "Since -"
        : `Since ${healthData ? new Date(Date.now() - healthData.uptime * 1000).toLocaleTimeString() : "-"}`,
      icon: "ClockIcon",
      lastChecked: "Just now",
    },
  ];

  const services: ServiceStatus[] = [
    {
      id: 1,
      service: "Backend API Server",
      status: error
        ? "critical"
        : healthData?.services.server === "operational"
          ? "healthy"
          : "critical",
      responseTime: `${totalLatency}ms`,
      lastCheck: lastRefresh,
      message: error ? "Connection refused" : `Version ${healthData?.version}`,
    },
    {
      id: 2,
      service: "Database Service",
      status: healthData?.services.database === "operational" ? "healthy" : "critical",
      responseTime: healthData?.metrics?.dbResponseTime || "-",
      lastCheck: lastRefresh,
      message:
        healthData?.services.database === "operational"
          ? "Connection pool healthy"
          : "Connection failed",
    },
    {
      id: 3,
      service: "Link Redirection",
      status: healthData?.services.database === "operational" ? "healthy" : "critical",
      responseTime: healthData?.metrics?.dbResponseTime || "-",
      lastCheck: lastRefresh,
      message: "Dependent on DB response time",
    },
    {
      id: 4,
      service: "Analytics Engine",
      status: healthData?.services.database === "operational" ? "healthy" : "critical",
      responseTime: "-",
      lastCheck: lastRefresh,
      message: "Syncing normally",
    },
  ];

  if (!isHydrated) {
    return (
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-lg p-8 shadow-card">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div
        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border rounded-xl p-6 shadow-card ${
          error
            ? "bg-gradient-to-r from-destructive/10 to-background border-destructive/20"
            : "bg-gradient-to-r from-success/10 to-primary/10 border-success/20"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${error ? "bg-destructive/20" : "bg-success/20"}`}>
            <Icon
              name={error ? "ExclamationCircleIcon" : "CheckCircleIcon"}
              size={28}
              className={error ? "text-destructive" : "text-success"}
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {error ? "System Issues Detected" : "All Systems Operational"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Last updated: {lastRefresh}</p>
          </div>
        </div>

        <button
          onClick={fetchHealthStatus}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold transition-smooth hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <Icon name="ArrowPathIcon" size={18} className={isRefreshing ? "animate-spin" : ""} />
          <span>{isRefreshing ? "Refreshing..." : "Refresh Status"}</span>
        </button>
      </div>

      {/* System Status Cards */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">System Status Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemStatus.map((status, index) => (
            <SystemStatusCard key={index} {...status} />
          ))}
        </div>
      </div>

      {/* Service Status Table */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Service Health Status</h2>
        <ServiceStatusTable services={services} />
      </div>

      {/* Help Info */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="bg-blue-500/10 p-3 rounded-lg flex-shrink-0">
            <Icon
              name="InformationCircleIcon"
              size={24}
              className="text-blue-600 dark:text-blue-400"
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-muted-foreground mb-2">
              About System Monitoring
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This dashboard provides real-time monitoring of all critical system components. Status
              checks run automatically every 30 seconds. If you notice any service showing a warning
              or critical status, our team is automatically notified and working to resolve the
              issue.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthInteractive;
