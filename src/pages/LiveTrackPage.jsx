import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import useOrderTracking from "../hooks/useWebsocket";
import LiveMap from "../Component/LiveMap";
import NavBar from "./NavBar";
import '../CSS/LiveTrackPage.css'

export default function LiveTrackPage() {
  const { order_id } = useParams();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role")
  const[order,setOrder] = useState(null)

  const { location: agentLocation, connected } = useOrderTracking(order_id, token);

  const [pickup, setPickup] = useState(null);
  const [drop, setDrop] = useState(null);
  const [routePath, setRoutePath] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await API.get(`/order/${order_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrder(res.data)
      setPickup({
        lat: res.data.pickup.lat,
        lng: res.data.pickup.lng,
        address: res.data.pickup.address,
      });

      setDrop({
        lat: res.data.drop.lat,
        lng: res.data.drop.lng,
        address: res.data.drop.address,
      });
      fetchRoute(
        { lat: res.data.pickup.lat, lng: res.data.pickup.lng },
        { lat: res.data.drop.lat, lng: res.data.drop.lng }
      );
    }

    async function fetchRoute(pickupPoint, dropPoint) {
      const url =
        `https://router.project-osrm.org/route/v1/driving/` +
        `${pickupPoint.lng},${pickupPoint.lat};${dropPoint.lng},${dropPoint.lat}` +
        `?overview=full&geometries=geojson`;

      const resp = await fetch(url);
      const data = await resp.json();

      if (data.routes && data.routes.length > 0) {
        const coords = data.routes[0].geometry.coordinates.map((c) => ({
          lat: c[1],
          lng: c[0],
        }));
        setRoutePath(coords);
      }
    }

    load();
  }, [order_id, token]);

    if (!pickup || !drop) return (
      <div className="center-text-loader">
        <h2>Loading map...</h2>
      </div>
    )
    if (!order) {
      return (
        <div className="center-text-loader">
          <h2>Loading order…</h2>
          <p>Please wait a moment</p>
        </div>
      );
    }


  return (
    <>
      <NavBar/>
      <div className="track-container">
          <div className="track-header">
            <div>
              <h2>Order #{order.order_id}</h2>
              <span className={`status status-${order.status}`}>
                {order.status.replace("_", " ").toUpperCase()}
              </span>
            </div>

            <div className={`ws-status ${connected ? "on" : "off"}`}>
              {connected ? "LIVE" : "DISCONNECTED"}
            </div>
          </div>

          <div className="map-section">
            <LiveMap
              pickup={pickup}
              drop={drop}
              agentLocation={agentLocation}
              routePath={routePath}
            />
          </div>

          <div className="info-panel">
            <h3>Live Agent Location</h3>

            {agentLocation ? (
              <>
                <p><b>Latitude:</b> {agentLocation.lat}</p>
                <p><b>Longitude:</b> {agentLocation.lng}</p>
                <p>
                  <b>Updated:</b>{" "}
                  {new Date(agentLocation.timestamp).toLocaleString()}
                </p>
              </>
            ) : (
              <p>No live updates yet</p>
            )}
          </div>

          {role === "agent" && order.status === "in_transit" && (
            <div className="controls">
              <button className="primary">Simulation Running</button>
            </div>
          )}
      </div>
    </>
  );
}

    // <div style={{ width: "100%", height: "80vh", marginTop: 20 }}>
    //   <h1>Tracking Order #{order_id}</h1>
    //   <p>WebSocket: {connected ? "🟢 Connected" : "🔴 Disconnected"}</p>

    //   <LiveMap
    //     pickup={pickup}
    //     drop={drop}
    //     agentLocation={agentLocation}
    //     routePath={routePath}
    //   />
    // </div>