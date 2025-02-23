import { useState, useEffect } from 'react';
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
import { useRef } from 'react';
import { driversService } from '@/services/drivers-service';
import { vehiclesService } from '@/services/vehicles-service';
import type { Driver } from '@/services/api-config';
import type { Vehicle } from '@/services/api-config';

const Index = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [alerts] = useState([]); // We'll implement alerts later
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const { toast } = useToast();
  const mapRef = useRef<HTMLDivElement>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiclesData, driversData] = await Promise.all([
          vehiclesService.getAllVehicles(),
          driversService.getAllDrivers(),
        ]);
        setVehicles(vehiclesData);
        setDrivers(driversData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch data",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [toast]);

  const handleVehicleToggle = async (id: string, state: boolean) => {
    try {
      await vehiclesService.updateVehicle(Number(id), { isOn: state });
      setVehicles((prev) =>
        prev.map((vehicle) =>
          vehicle.id === Number(id) ? { ...vehicle, isOn: state } : vehicle
        )
      );

      toast({
        title: `Vehicle ${state ? 'Started' : 'Stopped'}`,
        description: `Vehicle ${vehicles.find(v => v.id === Number(id))?.plate} has been ${state ? 'started' : 'stopped'}.`,
        variant: state ? 'default' : 'destructive',
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update vehicle status",
        variant: "destructive",
      });
    }
  };

  const handleAddVehicle = async (vehicleData: any) => {
    try {
      const newVehicle = await vehiclesService.createVehicle({
        ...vehicleData,
        isOn: false,
        batteryLevel: 100,
        lastUpdate: new Date().toISOString(),
        latitude: 40.7128,
        longitude: -74.006,
      });

      setVehicles([...vehicles, newVehicle]);
      toast({
        title: "Vehicle Added",
        description: `${vehicleData.brand} ${vehicleData.model} has been added to the fleet.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add vehicle",
        variant: "destructive",
      });
    }
  };

  const handleAddDriver = async (driverData: any) => {
    try {
      const newDriver = await driversService.createDriver(driverData);
      setDrivers([...drivers, newDriver]);
      toast({
        title: "Driver Added",
        description: `${driverData.name} has been added as a driver.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add driver",
        variant: "destructive",
      });
    }
  };

  const handleVehicleFocus = (id: string) => {
    const mapElement = mapRef.current?.querySelector('[class*="mapboxgl-map"]');
    if (mapElement) {
      (mapElement as any)?.focusVehicle?.(id);
    }
  };

  return (
    // ... keep existing code (JSX remains the same)
  );
};

export default Index;