"use client";

import { useState } from "react";
import LinkCreationForm from "./LinkCreationForm";
import LinksTable from "@/components/common/LinksTable";

export default function DashboardInteractive() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleLinkCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="space-y-8">
      <LinkCreationForm onLinkCreated={handleLinkCreated} />
      <LinksTable variant="dashboard" refreshTrigger={refreshTrigger} />
    </div>
  );
}
