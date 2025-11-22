import Icon from "@/components/ui/AppIcon";

interface MetricsCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: string;
  description: string;
}

const MetricsCard = ({ title, value, change, trend, icon, description }: MetricsCardProps) => {
  const trendConfig = {
    up: {
      icon: "ArrowTrendingUpIcon",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    down: {
      icon: "ArrowTrendingDownIcon",
      color: "text-error",
      bgColor: "bg-error/10",
    },
    neutral: {
      icon: "MinusIcon",
      color: "text-muted-foreground",
      bgColor: "bg-muted",
    },
  };

  const config = trendConfig[trend];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card transition-smooth hover:shadow-elevated">
      <div className="flex items-start justify-between mb-4">
        <div className="bg-primary/10 p-3 rounded-lg">
          <Icon name={icon as any} size={24} className="text-primary" />
        </div>
        <div className={`flex items-center gap-1 ${config.bgColor} px-2 py-1 rounded-md`}>
          <Icon name={config.icon as any} size={14} className={config.color} />
          <span className={`text-xs font-semibold ${config.color}`}>{change}</span>
        </div>
      </div>

      <h3 className="text-muted-foreground text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-foreground mb-2">{value}</p>
      <p className="text-muted-foreground text-xs">{description}</p>
    </div>
  );
};

export default MetricsCard;
