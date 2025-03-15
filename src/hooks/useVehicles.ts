import { useState, useEffect } from "react";
import axios from "axios";

export interface Vehicle {
  id: string;
  make: string;       // Usamos "make" en lugar de "brand"
  model: string;
  plate: string;
  vin: string;
  fuelType: string;
  driverId?: number;
  isOn: boolean;
  batteryLevel: number;
  lastUpdate: string;
}

const API_URL = "https://8b6b-190-122-96-74.ngrok-free.app/api/vehicles";

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(API_URL, {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        });
        console.log(" API Response (vehicles):", response.data);
        const data = response.data;
        setVehicles(Array.isArray(data) ? data : []);
        if (!Array.isArray(data)) {
          console.error("La API no devolvió un array:", data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // Agrega un vehículo al estado
  const addVehicle = async (vehicleData: Omit<Vehicle, "id">) => {
    try {
      const response = await axios.post(API_URL, vehicleData, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      });
      if (response.status === 201) {
        setVehicles((prevVehicles) => [...prevVehicles, response.data]);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Actualiza un vehículo existente
  const updateVehicle = async (id: string, updatedData: Partial<Vehicle>) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedData, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      });
      setVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) => (vehicle.id === id ? response.data : vehicle))
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Elimina un vehículo
  const deleteVehicle = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      setVehicles((prevVehicles) => prevVehicles.filter((vehicle) => vehicle.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return { vehicles, setVehicles, isLoading, error, addVehicle, updateVehicle, deleteVehicle };
};
