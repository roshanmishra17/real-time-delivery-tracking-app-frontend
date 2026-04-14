import { MapContainer, TileLayer, Marker,useMapEvents} from "react-leaflet";
import { useState } from "react";

function LocationPicker({onSelect}){
    useMapEvents({
        click(e){
            onSelect(e.latlng)
        }
    })
}

export default function MapSelector({onSelect}){
    const [position,setPosition] = useState(null);

    return (
        <MapContainer center={[19.076, 72.877]} zoom={13} style={{ height: "300px" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationPicker onSelect={(latlng) => {
                setPosition(latlng);
                onSelect(latlng);
            }} />

            {position && <Marker position={position} />}
        </MapContainer>
    )
}   