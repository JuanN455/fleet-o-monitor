import { useRef, useEffect } from "react";
import VehicleCard from "@/components/VehicleCard";
import VehicleForm from "@/components/VehicleForm";
import DriverForm from "@/components/DriverForm";
import DriversList from "@/components/DriversList";
import AlertsList from "@/components/AlertsList";
import Map from "@/components/Map";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Car, Users } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import axios from "axios";

// Importando los hooks para obtener datos reales
import { useVehicles } from "@/hooks/useVehicles";
import { useDrivers } from "@/hooks/useDrivers";
import { useAlerts } from "@/hooks/useAlerts";

const API_DRIVERS = "https://9222-186-6-41-143.ngrok-free.app/api/drivers";
const API_VEHICLES = "https://9222-186-6-41-143.ngrok-free.app/api/vehicles";
const API_RENTS = "https://9222-186-6-41-143.ngrok-free.app/api/rents";
const API_GPS = "https://9222-186-6-41-143.ngrok-free.app/api/gps";

const Index = () => {
  const { vehicles, setVehicles, isLoading: loadingVehicles } = useVehicles();
  const { drivers, addDriver, isLoading: loadingDrivers, error: driverError } = useDrivers();
  const { alerts, isLoading: loadingAlerts } = useAlerts();
  const { toast } = useToast();
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("Drivers actualizados:", drivers);
  }, [drivers]);

  // Función para agregar un nuevo conductor
  const handleAddDriver = async (driverData: {
    name: string;
    licenseNumber: string;
    phone: string;
    email: string;
  }) => {
    try {
      console.log("Enviando nuevo driver:", JSON.stringify(driverData, null, 2));
      const response = await axios.post(API_DRIVERS, driverData, {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      console.log("Nuevo Driver Agregado:", response.data);
      addDriver(response.data);
      toast({
        title: "Driver Added",
        description: `${response.data.name} added successfully.`,
      });
    } catch (error: any) {
      console.error("Error adding driver:", error);
      if (error.response) {
        console.error("API error details:", error.response.data);
        alert(`Error en la API: ${JSON.stringify(error.response.data)}`);
      } else {
        alert("No se pudo conectar con la API.");
      }
      toast({
        title: "Error",
        description: `Failed to add driver: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // Función para agregar un nuevo vehículo y crear la renta asociada
  const handleAddVehicle = async (vehicleData: {
    make: string;
    model: string;
    plate: string;
    vin: string;
    fuelType: string;
    driverId: number;
  }) => {
    try {
      console.log("Enviando nuevo vehículo:", JSON.stringify(vehicleData, null, 2));
      const payload = {
        make: vehicleData.make,
        model: vehicleData.model,
        plate: vehicleData.plate,
        vin: vehicleData.vin,
        fuelType: vehicleData.fuelType,
        driverId: String(vehicleData.driverId),
        isOn: false,
        batteryLevel: 100,
        lastUpdate: new Date().toISOString(),
      };

      const response = await fetch(API_VEHICLES, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`Failed to add vehicle: ${response.status} ${response.statusText} - ${responseText}`);
      }
      const newVehicle = await response.json();
      console.log("Nuevo Vehículo Agregado:", newVehicle);
      setVehicles((prevVehicles) => [...prevVehicles, newVehicle]);
      toast({
        title: "Vehicle Added",
        description: `${newVehicle.make} ${newVehicle.model} added to the fleet.`,
      });

      // Crear la renta asociada al vehículo
      const rentPayload = {
        driverId: vehicleData.driverId,
        vehicleId: newVehicle.id,
        expectedReturnAt: "2025-03-01",
      };

      const rentResponse = await fetch(API_RENTS, {
        method: "POST",
        body: JSON.stringify(rentPayload),
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (!rentResponse.ok) {
        const rentResponseText = await rentResponse.text();
        throw new Error(`Failed to create rent: ${rentResponse.status} ${rentResponse.statusText} - ${rentResponseText}`);
      }
      const newRent = await rentResponse.json();
      console.log("Nueva Renta Creada:", newRent);
      toast({
        title: "Rent Created",
        description: `Rent created successfully for vehicle ${newVehicle.make} ${newVehicle.model}.`,
      });
    } catch (error: any) {
      console.error("Error adding vehicle:", error);
      toast({
        title: "Error",
        description: `Failed to add vehicle: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // Función para togglear el estado "isOn" del vehículo
  const handleVehicleToggle = async (id: string, state: boolean) => {
    try {
      console.log("Toggle vehicle:", id, state);
      const endpoint = `${API_GPS}/vehicle/${id}/${state ? "block" : "unblock"}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(`Failed to toggle vehicle: ${response.status} ${response.statusText} - ${responseText}`);
      }
      setVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) =>
          vehicle.id === id ? { ...vehicle, isOn: state } : vehicle
        )
      );
      toast({
        title: `Vehicle ${state ? "Started" : "Stopped"}`,
        description: `Vehicle has been ${state ? "started" : "stopped"}.`,
        variant: state ? "default" : "destructive",
      });
    } catch (error: any) {
      console.error("Error toggling vehicle:", error);
      toast({
        title: "Error",
        description: `Failed to update vehicle status: ${error.message}`,
        variant: "destructive",
      });
    }
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
              <DialogTitle>Add New Vehicle</DialogTitle>
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
              <DialogTitle>Add New Driver</DialogTitle>
              <DriverForm onSubmit={handleAddDriver} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr,400px] gap-8">
        <div className="space-y-8" ref={mapRef}>
          <Map />
          <AlertsList
            alerts={alerts.map((alert) => ({
              ...alert,
              type: alert.type || "battery",
              timestamp: alert.timestamp || new Date().toISOString(),
            }))}
          />
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Vehicles</h2>
            {loadingVehicles ? (
              <p>Loading vehicles...</p>
            ) : (
              vehicles.map((vehicle) => {
                const driverName =
                  drivers.find((driver) => driver.id === vehicle.driverId)?.name || "";
                return (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    driverName={driverName}
                    onToggle={handleVehicleToggle}
                  />
                );
              })
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Drivers</h2>
            {loadingDrivers ? (
              <p>Loading drivers...</p>
            ) : driverError ? (
              <p className="text-red-500">{driverError}</p>
            ) : (
              <DriversList drivers={drivers} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
