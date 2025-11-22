import type { Metadata } from "next";
import Header from "@/components/common/Header";
import Breadcrumb from "@/components/common/Breadcrumb";
import Footer from "@/components/common/Footer";
import DashboardInteractive from "./dashboard/components/DashboardInteractive";

export const metadata: Metadata = {
  title: "Dashboard - LinkShort",
  description:
    "Create, manage, and monitor your shortened links with comprehensive analytics tracking and real-time click statistics.",
};

export default function DashboardPage() {
  const breadcrumbItems = [{ label: "Dashboard", path: "/" }];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-background pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Create and manage your shortened links with real-time analytics
            </p>
          </div>

          <DashboardInteractive />
        </div>
      </main>
      <Footer />
    </div>
  );
}
