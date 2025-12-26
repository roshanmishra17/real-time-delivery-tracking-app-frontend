import { MapContainer, TileLayer, Marker, Popup,useMap} from "react-leaflet";
import L from 'leaflet'
import { useEffect,useRef } from "react";
import { Polyline } from "react-leaflet";


export const pickupIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

export const dropIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/685/685901.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

export const agentIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149995.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38]
});

function AgentMarker({ agentLocation }) {
  const map = useMap();
  const markerRef = useRef(null);

  useEffect(() => {
    if (!agentLocation) return;

    // Create marker only once
    if (!markerRef.current) {
      const marker = L.marker(
        [agentLocation.lat, agentLocation.lng],
        { icon: agentIcon }
      ).addTo(map);

      // BIND POPUP HERE (IMPORTANT)
      marker.bindPopup(`
        <b>Delivery Agent</b><br/>
        Lat: ${agentLocation.lat}<br/>
        Lng: ${agentLocation.lng}<br/>
        Updated: ${new Date(agentLocation.timestamp).toLocaleString()}
      `);

      markerRef.current = marker;
      return;
    }

    // Animate marker smoothly
    const marker = markerRef.current;
    const start = marker.getLatLng();
    const end = L.latLng(agentLocation.lat, agentLocation.lng);

    const duration = 500;
    const startTime = performance.now();

    function animate(time) {
      const t = Math.min((time - startTime) / duration, 1);
      const lat = start.lat + (end.lat - start.lat) * t;
      const lng = start.lng + (end.lng - start.lng) * t;
      marker.setLatLng([lat, lng]);
      if (t < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

    // Update popup content on each location update
    marker.setPopupContent(`
      <b>Delivery Agent</b><br/>
      Lat: ${agentLocation.lat}<br/>
      Lng: ${agentLocation.lng}<br/>
      Updated: ${new Date(agentLocation.timestamp).toLocaleString()}
    `);

  }, [agentLocation]);

  return null;
}

export default function LiveMap({pickup,drop,agentLocation,routePath}){
    const center = agentLocation || pickup

    if(!center) return <h3>Waiting for Location...</h3>

    return(
        <MapContainer center={[center.lat, center.lng]} zoom={13} style={{ height: "500px" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[pickup.lat, pickup.lng]} icon={pickupIcon}>
                <Popup>
                    <b>Pickup Location</b><br />
                    {pickup.address ? pickup.address : "No address available"}<br/>
                    Lat: {pickup.lat}, Lng: {pickup.lng}
                </Popup>
            </Marker>

            <Marker position={[drop.lat, drop.lng]} icon={dropIcon}>
                <Popup>
                    <b>Drop Location</b><br />
                    {drop.address ? drop.address : "No address available"}<br/>
                    Lat: {drop.lat}, Lng: {drop.lng}
                </Popup>
            </Marker>
          {routePath.length > 0 && (
            <Polyline
              positions={routePath.map(p => [p.lat, p.lng])}
              pathOptions={{ color: "blue", weight: 4 }}
            />
          )}
            <AgentMarker agentLocation={agentLocation}/>
        </MapContainer>
    )
}