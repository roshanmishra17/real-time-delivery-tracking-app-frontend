import { MapContainer, TileLayer, Marker,useMapEvents,Polyline} from "react-leaflet";
import L from "leaflet"
import { Popup } from "react-leaflet";
import { pickupIcon,dropIcon } from "../Component/LiveMap";


function MapClickHandler({ onSelect }) {
    useMapEvents({
        click(e) {
            onSelect(e.latlng);
        }
    });
    return null;
}

export default function MapSelector({pickup, drop, route,onSelect}){

    return (
        <MapContainer center={[19.076, 72.877]} zoom={13} style={{ height: "300px" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapClickHandler onSelect={onSelect} />


            {pickup && (
                <Marker position={[pickup.lat, pickup.lng]} icon={pickupIcon}>
                    <Popup>Pickup Location</Popup>
                </Marker>
            )}
            {drop && (
                <Marker position={[drop.lat, drop.lng]} icon={dropIcon}>
                    <Popup>Drop Location</Popup>
                </Marker>
            )}
            {route && route.length > 0 && (
                <Polyline
                    positions={route.map(p => [p.lat, p.lng])}
                    pathOptions={{ color: "blue", weight: 5 }}
                />
            )}
        </MapContainer>
    )
}   