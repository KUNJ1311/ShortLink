import type { Metadata } from "next";
import Header from "@/components/common/Header";
import Breadcrumb from "@/components/common/Breadcrumb";
import Footer from "@/components/common/Footer";
import SystemHealthInteractive from "./components/SystemHealthInteractive";

export const metadata: Metadata = {
  title: "System Health Check - LinkShort",
  description:
    "Monitor real-time system status, service health, and operational metrics for the URL shortening service with comprehensive diagnostics and performance indicators.",
};

export default function SystemHealthCheckPage() {
  const breadcrumbItems = [{ label: "Dashboard", path: "/" }, { label: "System Health Check" }];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 bg-background pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-3">System Health Check</h1>
            <p className="text-lg text-muted-foreground">
              Real-time monitoring of system status and service health
            </p>
          </div>

          {/* Interactive Content */}
          <SystemHealthInteractive />
        </div>
      </main>
      <Footer />
    </div>
  );
}
