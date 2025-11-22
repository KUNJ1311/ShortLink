import Icon from "@/components/ui/AppIcon";

interface ServiceStatus {
  id: number;
  service: string;
  status: "healthy" | "warning" | "critical";
  responseTime: string;
  lastCheck: string;
  message: string;
}

interface ServiceStatusTableProps {
  services: ServiceStatus[];
}

const ServiceStatusTable = ({ services }: ServiceStatusTableProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <Icon name="CheckCircleIcon" size={20} className="text-success" />;
      case "warning":
        return <Icon name="ExclamationTriangleIcon" size={20} className="text-warning" />;
      case "critical":
        return <Icon name="XCircleIcon" size={20} className="text-error" />;
      default:
        return <Icon name="QuestionMarkCircleIcon" size={20} className="text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      healthy: "bg-success/10 text-success border-success/20",
      warning: "bg-warning/10 text-warning border-warning/20",
      critical: "bg-error/10 text-error border-error/20",
    };

    return config[status as keyof typeof config] || "bg-muted text-muted-foreground border-border";
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Service</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Status</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                Response Time
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                Last Check
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-muted/50 transition-micro">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(service.status)}
                    <span className="font-medium text-foreground">{service.service}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(service.status)}`}
                  >
                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground font-mono">
                  {service.responseTime}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{service.lastCheck}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{service.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceStatusTable;
