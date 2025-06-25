import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Label } from "./components/ui/label";
import { MapPin, Loader, LogIn } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const mockSavedAddresses = [
  "Joe's Auto Repairs",
  "Ballarat Brake Centre",
  "Westside Auto Garage"
];

export default function BookingApp() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [customer, setCustomer] = useState("");
  const [bookings, setBookings] = useState([]);
  const [optimizedRoute, setOptimizedRoute] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");

  const handleLogin = () => {
    if (!email.includes("@")) return;
    setUser({ email });
  };

  const handleBooking = () => {
    if (!pickup || !dropoff || !customer) return;
    const newJob = { pickup, dropoff, customer, timestamp: new Date().toISOString() };
    const updatedBookings = [...bookings, newJob];
    setBookings(updatedBookings);
    setPickup("");
    setDropoff("");
    optimizeRoute(updatedBookings);
  };

  const optimizeRoute = (jobs) => {
    setLoading(true);
    const sorted = [...jobs].sort((a, b) => a.pickup.localeCompare(b.pickup));
    setTimeout(() => {
      setOptimizedRoute(sorted);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    if (bookings.length > 0) optimizeRoute(bookings);
  }, []);

  if (!user) {
    return (
      <div className="max-w-sm mx-auto p-6">
        <Card className="shadow-xl">
          <CardContent className="space-y-4 p-6">
            <h1 className="text-2xl font-bold">Login</h1>
            <Input
              type="email"
              placeholder="you@business.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={handleLogin} className="w-full">
              <LogIn className="mr-2 h-4 w-4" /> Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <Card className="shadow-lg">
        <CardContent className="space-y-4 p-6">
          <h1 className="text-2xl font-bold">Courier Booking</h1>

          <div className="space-y-2">
            <Label htmlFor="customer">Customer Name</Label>
            <Input
              id="customer"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              placeholder="e.g. Joe's Auto Repairs"
              list="savedCustomers"
            />
            <datalist id="savedCustomers">
              {mockSavedAddresses.map((addr, i) => (
                <option value={addr} key={i} />
              ))}
            </datalist>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pickup">Pickup Address</Label>
            <Input
              id="pickup"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="123 Main St, Ballarat"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dropoff">Dropoff Address</Label>
            <Input
              id="dropoff"
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              placeholder="456 Workshop Rd, Ballarat"
            />
          </div>

          <Button onClick={handleBooking} className="w-full">
            <MapPin className="mr-2 h-4 w-4" /> Book Job
          </Button>
        </CardContent>
      </Card>

      {bookings.length > 0 && (
        <Card className="shadow-md">
          <CardContent className="p-4 space-y-4">
            <h2 className="font-semibold text-lg mb-2">Optimized Route</h2>
            {loading ? (
              <div className="text-center text-gray-500">
                <Loader className="animate-spin inline-block mr-2" /> Optimizing route...
              </div>
            ) : (
              <>
                <ul className="space-y-2">
                  {optimizedRoute.map((job, i) => (
                    <li key={i} className="border rounded p-2">
                      <strong>{job.customer}</strong>
                      <p>Pickup: {job.pickup}</p>
                      <p>Dropoff: {job.dropoff}</p>
                      <p className="text-xs text-gray-500">{new Date(job.timestamp).toLocaleString()}</p>
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <MapContainer center={[-37.5622, 143.8503]} zoom={13} style={{ height: "300px", width: "100%" }}>
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {optimizedRoute.map((job, i) => (
                      <Marker key={i} position={[-37.5622 + i * 0.01, 143.8503 + i * 0.01]}>
                        <Popup>
                          <strong>{job.customer}</strong>
                          <br />Pickup: {job.pickup}
                          <br />Dropoff: {job.dropoff}
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
