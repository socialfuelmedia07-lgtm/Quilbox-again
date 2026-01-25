import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet icon issue
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapPickerProps {
    onLocationSelect: (lat: number, lng: number, address?: string) => void;
    initialLat?: number;
    initialLng?: number;
}

// Component to handle map clicks
const LocationMarker = ({ setPosition, position, onLocationSelect }: any) => {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            onLocationSelect(e.latlng.lat, e.latlng.lng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position === null ? null : (
        <Marker position={position} />
    );
};

// Component to recenter map
const RecenterMap = ({ lat, lng }: { lat: number, lng: number }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo([lat, lng], 15);
    }, [lat, lng, map]);
    return null;
};

const MapPicker = ({ onLocationSelect, initialLat = 23.0225, initialLng = 72.5714 }: MapPickerProps) => {
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>({ lat: initialLat, lng: initialLng });

    // Sync internal state with props when parent updates location
    useEffect(() => {
        setPosition({ lat: initialLat, lng: initialLng });
    }, [initialLat, initialLng]);

    const handleCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    const newPos = { lat: latitude, lng: longitude };
                    setPosition(newPos);
                    onLocationSelect(latitude, longitude);
                },
                (err) => {
                    console.error("Geolocation error:", err);
                    alert("Could not fetch current location. Please ensure location services are enabled.");
                }
            );
        }
    };

    return (
        <div className="relative w-full h-[300px] rounded-xl overflow-hidden border border-slate-200 shadow-sm z-0">
            <MapContainer
                center={[initialLat, initialLng]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker
                    position={position}
                    setPosition={setPosition}
                    onLocationSelect={onLocationSelect}
                />
                {position && <RecenterMap lat={position.lat} lng={position.lng} />}
            </MapContainer>

            {/* Floating Action Button for GPS */}
            <div className="absolute top-4 right-4 z-[500]">
                <Button
                    size="icon"
                    className="bg-white text-slate-900 hover:bg-slate-100 shadow-md border"
                    onClick={handleCurrentLocation}
                    type="button"
                >
                    <Navigation className="w-5 h-5 text-blue-600" />
                </Button>
            </div>

            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur p-2 rounded-lg text-xs text-center border shadow-sm z-[500] font-medium text-slate-600">
                <MapPin className="w-3 h-3 inline-block mr-1 text-red-500" />
                Tap on the map to pin your exact delivery location
            </div>
        </div>
    );
};

export default MapPicker;
