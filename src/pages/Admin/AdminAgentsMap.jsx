import { useEffect, useState } from "react";
import API from "../../api/axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";


export const agentIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149995.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38]
});
export default function AdminAgentMap(){
    const [agents,setAgents] = useState([]);
    const token = localStorage.getItem("token");

    let interval;

    useEffect(() =>{
        async function loadAgents() {
            try{
                const res = await API.get('/location/agents-locations',{
                    headers : {Authorization : `Bearer ${token}`},
                })
                setAgents(res.data)
            }catch(err){
                console.error("Failed to load agent locations", err);
            }
        }
        loadAgents();
        interval = setInterval(loadAgents, 3000); // refresh every 3s

        return () => clearInterval(interval);
    },[token])
    if (agents.length === 0) {
    return <h2 style={{ padding: 20 }}>No active agents</h2>;
  }

  const center = [agents[0].lat, agents[0].lng];

    return (
        <div style={{ height: "90vh", width: "100%" }}>
            <h2 style={{ padding: 10 }}>Live Agent Map (Admin)</h2>

            <MapContainer center={center} zoom={12} style={{ height: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {agents.map((a) => (
                    <Marker
                    key={a.agent_id}
                    position={[a.lat, a.lng]}
                    icon={agentIcon}
                    >
                        <Popup>
                            <b>Agent ID:</b> {a.agent_id} <br />
                            <b>Order ID:</b> {a.order_id ?? "Idle"} <br />
                            <b>Last Update:</b><br />
                            {new Date(a.timestamp).toLocaleString()}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}