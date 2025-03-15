import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DriverFormProps {
  onSubmit: (driver: {
    name: string;
    licenseNumber: string;
    phone: string;
    email: string;
  }) => void;
}

const DriverForm = ({ onSubmit }: DriverFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    licenseNumber: "",
    phone: "",
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 🔹 Verifica si algún campo está vacío
    if (!formData.name || !formData.licenseNumber || !formData.phone || !formData.email) {
      console.error("❌ Error: Todos los campos son obligatorios");
      alert("Todos los campos son obligatorios.");
      return;
    }

    console.log("📤 Enviando desde DriverForm:", formData); // 🔹 Verificar datos antes de enviarlos

    onSubmit(formData);

    console.log("✅ Datos enviados correctamente desde DriverForm");

    // 🔹 Se resetea el formulario solo si se envía correctamente
    setFormData({
      name: "",
      licenseNumber: "",
      phone: "",
      email: "",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Driver</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="licenseNumber">License Number</Label>
            <Input
              id="licenseNumber"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Add Driver
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DriverForm;
