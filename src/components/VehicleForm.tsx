
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Driver {
  id: string;
  name: string;
  license: string;
  phone: string;
}

interface VehicleFormProps {
  onSubmit: (vehicle: {
    brand: string;
    model: string;
    plate: string;
    vin: string;
    fuelType: string;
    driverId?: string;
  }) => void;
  drivers: Driver[];
}

const VehicleForm = ({ onSubmit, drivers }: VehicleFormProps) => {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    plate: "",
    vin: "",
    fuelType: "Gasoline",
    driverId: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      brand: "",
      model: "",
      plate: "",
      vin: "",
      fuelType: "Gasoline",
      driverId: "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Vehicle</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              value={formData.brand}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              value={formData.model}
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value })
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="plate">License Plate</Label>
            <Input
              id="plate"
              value={formData.plate}
              onChange={(e) =>
                setFormData({ ...formData, plate: e.target.value })
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="vin">VIN</Label>
            <Input
              id="vin"
              value={formData.vin}
              onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fuelType">Fuel Type</Label>
            <Select
              value={formData.fuelType}
              onValueChange={(value) =>
                setFormData({ ...formData, fuelType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select fuel type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Gasoline">Gasoline</SelectItem>
                <SelectItem value="Diesel">Diesel</SelectItem>
                <SelectItem value="Electric">Electric</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="driver">Assign Driver</Label>
            <Select
              value={formData.driverId}
              onValueChange={(value) =>
                setFormData({ ...formData, driverId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a driver" />
              </SelectTrigger>
              <SelectContent>
                {drivers.map((driver) => (
                  <SelectItem key={driver.id} value={driver.id}>
                    {driver.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            Add Vehicle
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VehicleForm;
