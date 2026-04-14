import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import useOrderTracking from "../hooks/useWebsocket";
import LiveMap from "../Component/LiveMap";
import NavBar from "./NavBar";
import '../CSS/LiveTrackPage.css'
import Footer from "./footer";
import { fetchRoute } from "../Component/fetchRoute";

export default function LiveTrackPage() {
  const { order_id } = useParams();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role")
  const[order,setOrder] = useState(null)

  const { location: agentLocation, connected } = useOrderTracking(order_id, token);

  const [pickup, setPickup] = useState(null);
  const [drop, setDrop] = useState(null);
  const [routePath, setRoutePath] = useState([]);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);

  const distanceKm = (distance / 1000).toFixed(2);
  const durationMin = (duration / 60).toFixed(1);

  useEffect(() => {
    async function load() {
      try {
        const res = await API.get(`/order/${order_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setOrder(res.data);

        const pickupData = {
          lat: res.data.pickup.lat,
          lng: res.data.pickup.lng,
          address: res.data.pickup.address,
        };

        const dropData = {
          lat: res.data.drop.lat,
          lng: res.data.drop.lng,
          address: res.data.drop.address,
        };

        setPickup(pickupData);
        setDrop(dropData);

        const routeData = await fetchRoute(pickupData, dropData);

        setRoutePath(routeData.path);
        setDistance(routeData.distance);
        setDuration(routeData.duration);

      } catch (err) {
        console.error("Failed to load order", err);
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

            {distance > 0 && (
              <div className="route-info">
                <div className="info-box">
                  <span className="label">Distance</span>
                  <span className="value">{distanceKm} km</span>
                </div>

                <div className="info-box">
                  <span className="label">ETA</span>
                  <span className="value">{durationMin} mins</span>
                </div>
              </div>
            )}
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
      <Footer/>
    </>
  );
}
