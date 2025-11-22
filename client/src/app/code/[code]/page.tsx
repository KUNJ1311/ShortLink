"use client";
import Header from "@/components/common/Header";
import Breadcrumb from "@/components/common/Breadcrumb";
import Footer from "@/components/common/Footer";
import LinkStatisticsInteractive from "../components/LinkStatisticsInteractive";

interface PageProps {
  params: {
    code: string;
  };
}
export default function LinkStatisticsDetailPage({ params }: PageProps) {
  const { code } = params;

  const breadcrumbItems = [
    { label: "Dashboard", path: "/" },
    { label: "Link Statistics", path: "/code" },
    { label: code },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-background pt-20 sm:pt-24 pb-12 sm:pb-16 px-3 sm:px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4 sm:mb-6">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 break-words">
              Detailed Analytics for{" "}
              <code className="text-primary font-mono text-lg sm:text-xl lg:text-2xl">{code}</code>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Comprehensive analytics and performance insights for this shortened link
            </p>
          </div>

          <LinkStatisticsInteractive code={code} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
