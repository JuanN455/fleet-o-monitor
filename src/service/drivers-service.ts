
import { API_BASE_URL, Driver } from './api-config';

export const driversService = {
  getAllDrivers: async (): Promise<Driver[]> => {
    const response = await fetch(`${API_BASE_URL}/drivers`);
    if (!response.ok) throw new Error('Failed to fetch drivers');
    return response.json();
  },

  getDriverById: async (id: number): Promise<Driver> => {
    const response = await fetch(`${API_BASE_URL}/drivers/${id}`);
    if (!response.ok) throw new Error('Failed to fetch driver');
    return response.json();
  },

  createDriver: async (driver: Omit<Driver, 'id'>): Promise<Driver> => {
    const response = await fetch(`${API_BASE_URL}/drivers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(driver),
    });
    if (!response.ok) throw new Error('Failed to create driver');
    return response.json();
  },

  updateDriver: async (id: number, data: Partial<Driver>): Promise<Driver> => {
    const response = await fetch(`${API_BASE_URL}/drivers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update driver');
    return response.json();
  },
};