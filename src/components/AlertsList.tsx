
import { Bell, BatteryLow, WifiOff, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Alert {
  id: string;
  type: "battery" | "connection" | "speed" | "door";
  message: string;
  timestamp: string;
  vehiclePlate: string;
  severity: "low" | "medium" | "high";
}

interface AlertsListProps {
  alerts: Alert[];
}

const AlertsList = ({ alerts }: AlertsListProps) => {
  const getSeverityColor = (severity: Alert["severity"]) => {
    switch (severity) {
      case "high":
        return "text-danger";
      case "medium":
        return "text-warning";
      case "low":
        return "text-muted-foreground";
    }
  };

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "battery":
        return <BatteryLow className="h-4 w-4" />;
      case "connection":
        return <WifiOff className="h-4 w-4" />;
      case "speed":
      case "door":
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>System Alerts</CardTitle>
          <Bell className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start space-x-4 p-3 rounded-lg bg-muted/50"
              >
                <div className={getSeverityColor(alert.severity)}>
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{alert.vehiclePlate}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AlertsList;
