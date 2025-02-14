import { useState } from 'react';
import VehicleCard from '@/components/VehicleCard';
import VehicleForm from '@/components/VehicleForm';
import DriverForm from '@/components/DriverForm';
import DriversList from '@/components/DriversList';
import AlertsList from '@/components/AlertsList';
import Map from '@/components/Map';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Car, Users } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

// Mock data - replace with actual API calls
const mockVehicles = [
  {
    id: "1",
    brand: "Toyota",
    model: "Camry",
    plate: "ABC-123",
    vin: "1HGCM82633A123456",
    fuelType: "Gasoline",
    isOn: true,
    batteryLevel: 85,
    lastUpdate: "2024-03-10T10:00:00",
    driver: "John Doe",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    id: "2",
    brand: "Ford",
    model: "F-150",
    plate: "XYZ-789",
    vin: "1FTEW1E53NFC12345",
    fuelType: "Diesel",
    isOn: false,
    batteryLevel: 15,
    lastUpdate: "2024-03-10T09:45:00",
    driver: "Jane Smith",
    latitude: 40.7148,
    longitude: -74.008,
  },
];

const mockAlerts = [
  {
    id: "1",
    type: "battery" as const,
    message: "Low GPS battery level detected",
    timestamp: new Date().toISOString(),
    vehiclePlate: "XYZ-789",
    severity: "high" as const,
  },
  {
    id: "2",
    type: "speed" as const,
    message: "Speed limit exceeded",
    timestamp: new Date(Date.now() - 300000).toISOString(),
    vehiclePlate: "ABC-123",
    severity: "medium" as const,
  },
  {
    id: "3",
    type: "connection" as const,
    message: "Device connection lost",
    timestamp: new Date(Date.now() - 900000).toISOString(),
    vehiclePlate: "XYZ-789",
    severity: "high" as const,
  },
];

const mockDrivers = [
  {
    id: "1",
    name: "John Doe",
    license: "DL123456",
    phone: "+1234567890"
  },
  {
    id: "2",
    name: "Jane Smith",
    license: "DL789012",
    phone: "+1987654321"
  }
];

const Index = () => {
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [alerts] = useState(mockAlerts);
  const [drivers, setDrivers] = useState(mockDrivers);
  const { toast } = useToast();

  const handleVehicleToggle = (id: string, state: boolean) => {
    setVehicles((prev) =>
      prev.map((vehicle) =>
        vehicle.id === id ? { ...vehicle, isOn: state } : vehicle
      )
    );

    toast({
      title: `Vehicle ${state ? 'Started' : 'Stopped'}`,
      description: `Vehicle ${vehicles.find(v => v.id === id)?.plate} has been ${state ? 'started' : 'stopped'}.`,
      variant: state ? 'default' : 'destructive',
    });
  };

  const handleAddVehicle = (vehicleData: any) => {
    const newVehicle = {
      ...vehicleData,
      id: `${vehicles.length + 1}`,
      isOn: false,
      batteryLevel: 100,
      lastUpdate: new Date().toISOString(),
      latitude: 40.7128,
      longitude: -74.006,
      driver: vehicleData.driverId ? drivers.find(d => d.id === vehicleData.driverId)?.name : undefined
    };

    setVehicles([...vehicles, newVehicle]);
    toast({
      title: "Vehicle Added",
      description: `${vehicleData.brand} ${vehicleData.model} has been added to the fleet.`,
    });
  };

  const handleAddDriver = (driverData: any) => {
    const newDriver = {
      ...driverData,
      id: `${drivers.length + 1}`,
    };
    setDrivers([...drivers, newDriver]);
    toast({
      title: "Driver Added",
      description: `${driverData.name} has been added as a driver.`,
    });
  };

  return (
    <div className="container mx-auto py-8 animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Fleet Monitor</h1>
        <div className="flex gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Car className="mr-2 h-4 w-4" />
                Add Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent>
              <VehicleForm onSubmit={handleAddVehicle} drivers={drivers} />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Add Driver
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DriverForm onSubmit={handleAddDriver} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-[1fr,400px] gap-8">
        <div className="space-y-8">
          <Map vehicles={vehicles} />
          <AlertsList alerts={alerts} />
        </div>
        
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Vehicles</h2>
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onToggle={handleVehicleToggle}
              />
            ))}
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Drivers</h2>
            <DriversList drivers={drivers} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
