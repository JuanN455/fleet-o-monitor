
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Power, AlertTriangle, Battery } from "lucide-react";

interface VehicleCardProps {
  vehicle: {
    id: string;
    brand: string;
    model: string;
    plate: string;
    vin: string;
    fuelType: string;
    isOn: boolean;
    batteryLevel: number;
    lastUpdate: string;
    driver?: string;
  };
  onToggle: (id: string, state: boolean) => void;
  onFocus?: (id: string) => void;
}

const VehicleCard = ({ vehicle, onToggle, onFocus }: VehicleCardProps) => {
  const isLowBattery = vehicle.batteryLevel < 20;

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg animate-slideIn">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div 
          className="cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => onFocus?.(vehicle.id)}
        >
          <CardTitle className="text-xl font-bold">{vehicle.brand} {vehicle.model}</CardTitle>
          <CardDescription>{vehicle.plate}</CardDescription>
        </div>
        <Switch
          checked={vehicle.isOn}
          onCheckedChange={(checked) => onToggle(vehicle.id, checked)}
          className="data-[state=checked]:bg-success"
        />
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">VIN:</span>
            <span className="font-medium">{vehicle.vin}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Fuel Type:</span>
            <Badge variant="secondary">{vehicle.fuelType}</Badge>
          </div>
          {vehicle.driver && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Driver:</span>
              <span className="font-medium">{vehicle.driver}</span>
            </div>
          )}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <Power className={vehicle.isOn ? "text-success" : "text-muted-foreground"} size={18} />
              <span className={vehicle.isOn ? "text-success" : "text-muted-foreground"}>
                {vehicle.isOn ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Battery className={isLowBattery ? "text-danger" : "text-success"} size={18} />
              <span className={isLowBattery ? "text-danger" : "text-success"}>
                {vehicle.batteryLevel}%
              </span>
            </div>
            {isLowBattery && (
              <AlertTriangle className="text-warning" size={18} />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleCard;
