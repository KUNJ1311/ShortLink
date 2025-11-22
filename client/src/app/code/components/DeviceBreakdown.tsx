interface DeviceData {
  type: string;
  clicks: number;
  percentage: number;
  icon: string;
}

interface DeviceBreakdownProps {
  data: DeviceData[];
}

export default function DeviceBreakdown({ data }: DeviceBreakdownProps) {
  const getDeviceIcon = (iconName: string) => {
    switch (iconName) {
      case "ComputerDesktopIcon":
        return (
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        );
      case "DevicePhoneMobileIcon":
        return (
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        );
      case "DeviceTabletIcon":
        return (
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-6 shadow-card">
      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6">
        Device Breakdown
      </h3>
      <div className="space-y-4 sm:space-y-6">
        {data?.map((device, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg text-primary">
                  {getDeviceIcon(device.icon)}
                </div>
                <span className="text-sm sm:text-base font-medium text-foreground">
                  {device.type}
                </span>
              </div>
              <div className="text-right">
                <p className="text-base sm:text-lg font-bold text-muted-foreground">
                  {device.clicks.toLocaleString()}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">{device.percentage}%</p>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2 sm:h-2.5 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-300"
                style={{ width: `${device.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
