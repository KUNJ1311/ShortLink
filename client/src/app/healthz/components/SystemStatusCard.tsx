import Icon from "@/components/ui/AppIcon";

interface SystemStatusCardProps {
  title: string;
  status: "operational" | "degraded" | "down";
  value: string;
  description: string;
  icon: string;
  lastChecked: string;
}

const SystemStatusCard = ({
  title,
  status,
  value,
  description,
  icon,
  lastChecked,
}: SystemStatusCardProps) => {
  const statusConfig = {
    operational: {
      bgColor: "bg-success/10",
      textColor: "text-success",
      borderColor: "border-success/20",
      label: "Operational",
    },
    degraded: {
      bgColor: "bg-warning/10",
      textColor: "text-warning",
      borderColor: "border-warning/20",
      label: "Degraded",
    },
    down: {
      bgColor: "bg-error/10",
      textColor: "text-error",
      borderColor: "border-error/20",
      label: "Down",
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className={`bg-card border ${config.borderColor} rounded-lg p-6 shadow-card transition-smooth hover:shadow-elevated`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`${config.bgColor} p-3 rounded-lg`}>
          <Icon name={icon as any} size={24} className={config.textColor} />
        </div>
        <span
          className={`${config.bgColor} ${config.textColor} text-xs font-semibold px-3 py-1 rounded-full`}
        >
          {config.label}
        </span>
      </div>

      <h3 className="text-muted-foreground font-semibold text-lg mb-1">{title}</h3>
      <p className="text-3xl font-bold text-foreground mb-2">{value}</p>
      <p className="text-muted-foreground text-sm mb-3">{description}</p>

      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-3 border-t border-border">
        <Icon name="ClockIcon" size={14} />
        <span>Last checked: {lastChecked}</span>
      </div>
    </div>
  );
};

export default SystemStatusCard;
