import { useState, useEffect } from "react";

export interface Alert {
  id: string;
  message: string;
  vehiclePlate: string;
  severity: "low" | "medium" | "high";
  type: "" | "battery" | "connection" | "speed" | "door"; // se permite ""
  timestamp: string;
}


export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch("https://8b6b-190-122-96-74.ngrok-free.app/api/new_alert", {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch alerts");
        const data = await response.json();
        // Si las alertas no tienen 'type' y 'timestamp', se les asigna un valor por defecto
        const transformedAlerts = Array.isArray(data)
          ? data.map((alert: any) => ({
              ...alert,
              type: alert.type || "",
              timestamp: alert.timestamp || new Date().toISOString(),
            }))
          : [];
        setAlerts(transformedAlerts);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  return { alerts, isLoading, error };
};
