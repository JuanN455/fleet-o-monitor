
import { API_BASE_URL, Rent } from './api-config';

export const rentsService = {
  getAllRents: async (): Promise<Rent[]> => {
    const response = await fetch(`${API_BASE_URL}/rents`);
    if (!response.ok) throw new Error('Failed to fetch rents');
    return response.json();
  },

  getRentById: async (id: number): Promise<Rent> => {
    const response = await fetch(`${API_BASE_URL}/rents/${id}`);
    if (!response.ok) throw new Error('Failed to fetch rent');
    return response.json();
  },

  createRent: async (rent: { driverId: number; vehicleId: number; expectedReturnAt: string }): Promise<Rent> => {
    const response = await fetch(`${API_BASE_URL}/rents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rent),
    });
    if (!response.ok) throw new Error('Failed to create rent');
    return response.json();
  },

  returnVehicle: async (rentId: number): Promise<Rent> => {
    const response = await fetch(`${API_BASE_URL}/rents/${rentId}/return`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error('Failed to return vehicle');
    return response.json();
  },

  cancelRent: async (rentId: number): Promise<Rent> => {
    const response = await fetch(`${API_BASE_URL}/rents/${rentId}/cancel`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error('Failed to cancel rent');
    return response.json();
  },

  getRentsByDriver: async (driverId: number): Promise<Rent[]> => {
    const response = await fetch(`${API_BASE_URL}/rents/driver/${driverId}`);
    if (!response.ok) throw new Error('Failed to fetch driver rents');
    return response.json();
  },
};