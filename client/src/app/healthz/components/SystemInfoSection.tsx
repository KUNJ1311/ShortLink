import Icon from "@/components/ui/AppIcon";

interface SystemInfo {
  label: string;
  value: string;
  icon: string;
}

interface SystemInfoSectionProps {
  title: string;
  info: SystemInfo[];
}

const SystemInfoSection = ({ title, info }: SystemInfoSectionProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="InformationCircleIcon" size={24} className="text-primary" />
        {title}
      </h3>

      <div className="space-y-4">
        {info.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3 pb-4 border-b border-border last:border-b-0 last:pb-0"
          >
            <div className="bg-muted p-2 rounded-lg flex-shrink-0">
              <Icon name={item.icon as any} size={20} className="text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground mb-1">{item.label}</p>
              <p className="text-sm text-muted-foreground font-mono break-all">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemInfoSection;
