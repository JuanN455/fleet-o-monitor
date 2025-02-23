
export const API_BASE_URL = 'http://localhost:5002/api';

export interface Driver {
  id: number;
  name: string;
  licenseNumber: string;
  phone: string;
  email: string;
}

export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  plate: string;
  vin: string;
  fuelType: string;
  isOn: boolean;
  batteryLevel: number;
  lastUpdate: string;
  latitude: number;
  longitude: number;
  available: boolean;
}

export interface Rent {
  id: number;
  driverId: number;
  vehicleId: number;
  rentedAt: string;
  expectedReturnAt: string;
  returnedAt?: string;
  status: 'active' | 'completed' | 'canceled';
}