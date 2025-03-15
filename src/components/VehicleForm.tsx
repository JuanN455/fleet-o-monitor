import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Driver {
  id: number;  
  name: string;
  licenseNumber: string;
  phone: string;
}

interface VehicleFormProps {
  onSubmit: (vehicle: {
    make: string;       
    model: string;
    plate: string;
    vin: string;
    fuelType: string;
    driverId: number;
  }) => Promise<void>;
  drivers: Driver[];
}

const VehicleForm = ({ onSubmit, drivers }: VehicleFormProps) => {
  const [formData, setFormData] = useState({
    make: "",        
    model: "",
    plate: "",
    vin: "",
    fuelType: "Gasoline",
    driverId: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.driverId) {
      setError("You must assign a driver to the vehicle.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onSubmit(formData);
      setFormData({
        make: "",
        model: "",
        plate: "",
        vin: "",
        fuelType: "Gasoline",
        driverId: 0,
      });
    } catch (error) {
      console.error("Error submitting vehicle:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Vehicle</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="make">Make</Label>
            <Input
              id="make"
              value={formData.make}
              onChange={(e) => setFormData({ ...formData, make: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="plate">License Plate</Label>
            <Input
              id="plate"
              value={formData.plate}
              onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
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
              onValueChange={(value) => setFormData({ ...formData, fuelType: value })}
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
              value={String(formData.driverId)}
              onValueChange={(value) => setFormData({ ...formData, driverId: Number(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a driver" />
              </SelectTrigger>
              <SelectContent>
                {drivers.map((driver) => (
                  <SelectItem key={driver.id} value={String(driver.id)}>
                    {driver.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={loading || !formData.driverId}>
            {loading ? "Adding..." : "Add Vehicle"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VehicleForm;
