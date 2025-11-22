import Header from "@/components/common/Header";
import Breadcrumb from "@/components/common/Breadcrumb";
import LinksTable from "@/components/common/LinksTable";
import Footer from "@/components/common/Footer";

export default function LinkStatisticsPage() {
  const breadcrumbItems = [
    { label: "Dashboard", path: "/" },
    { label: "Link Statistics", path: "/code" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-background pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb items={breadcrumbItems} />

          <div className="mt-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">Link Statistics Overview</h1>
              <p className="text-lg text-muted-foreground">
                Comprehensive analytics and performance metrics for all your shortened links
              </p>
            </div>

            <LinksTable variant="statistics" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
