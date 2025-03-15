import { useState, useEffect } from "react";
import axios from "axios";

export interface Driver {
  id: number;  
  name: string;
  licenseNumber: string;
  phone: string;
  email: string;
}

const API_URL = "https://8b6b-190-122-96-74.ngrok-free.app/api/drivers";

export const useDrivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDrivers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(API_URL, {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
        });
        console.log("API Response (drivers):", response.data);
        if (Array.isArray(response.data)) {
          setDrivers(response.data);
        } else {
          console.error("API no devolvió un array:", response.data);
          setDrivers([]);
        }
      } catch (err: any) {
        console.error("Error fetching drivers:", err);
        setError("Failed to load drivers.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  // Agrega un nuevo driver al estado
  const addDriver = (newDriver: Driver) => {
    console.log("Añadiendo driver al estado:", newDriver);
    setDrivers((prevDrivers) => [...prevDrivers, newDriver]);
  };

  // Actualiza un driver existente
  const updateDriver = async (id: number, updatedData: Partial<Driver>) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedData, {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      setDrivers((prevDrivers) =>
        prevDrivers.map((driver) =>
          driver.id === id ? response.data : driver
        )
      );
    } catch (err: any) {
      console.error("Error updating driver:", err);
      setError(err.message);
    }
  };

  // Elimina un driver
  const deleteDriver = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      setDrivers((prevDrivers) =>
        prevDrivers.filter((driver) => driver.id !== id)
      );
    } catch (err: any) {
      console.error("Error deleting driver:", err);
      setError(err.message);
    }
  };

  return { drivers, addDriver, updateDriver, deleteDriver, isLoading, error };
};
