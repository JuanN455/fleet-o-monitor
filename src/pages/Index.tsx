
import { useState } from 'react';
import VehicleCard from '@/components/VehicleCard';
import Map from '@/components/Map';
import { useToast } from "@/hooks/use-toast";

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

const Index = () => {
  const [vehicles, setVehicles] = useState(mockVehicles);
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

  return (
    <div className="container mx-auto py-8 animate-fadeIn">
      <h1 className="text-4xl font-bold mb-8">Fleet Monitor</h1>
      
      <div className="grid md:grid-cols-[1fr,400px] gap-8">
        <div className="order-2 md:order-1">
          <Map vehicles={vehicles} />
        </div>
        
        <div className="order-1 md:order-2 space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Vehicles</h2>
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onToggle={handleVehicleToggle}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
