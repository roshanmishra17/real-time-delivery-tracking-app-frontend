import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate,useParams } from "react-router-dom";
import useOrderTracking from "../hooks/useWebsocket";
import "../CSS/AgentOrderPageDetail.css"
import NavBar from "./NavBar";

export default function AgentOrderDetailsPage () {
    const {order_id} = useParams()
    const navigate = useNavigate();
    const [order,setOrder] = useState(null)
    const [speed, setSpeed] = useState(1000); // 1 second per step
    const [routePath,setRoutePath] = useState([])
    let simInterval = null;

    const token = localStorage.getItem("token")
    const {location : agentLocation,connected} = useOrderTracking(order_id,token)

    console.log("Live agent location:", agentLocation);
    console.log("WS Connected:", connected);

    useEffect(() => {
        async function loadOrder() {
            const res = await API.get(`/order/${order_id}`,{
                headers:{Authorization : `Bearer ${token}`}
            })
            setOrder(res.data)

            const route = await fetchRoute(
              { lat: res.data.pickup.lat, lng: res.data.pickup.lng },
              { lat: res.data.drop.lat, lng: res.data.drop.lng }
            );
            setRoutePath(route);
        }
        loadOrder()
    },[order_id,token])

    if (!order) {
      return (
        <div className="center-text-loader">
          <h2>Loading order…</h2>
          <p>Please wait a moment</p>
        </div>
      );
    }
    const pickup = {
        lat : order.pickup.lat,
        lng : order.pickup.lng,
        address : order.pickup.address
    }
    const drop = {
        lat : order.drop.lat,
        lng : order.drop.lng,
        address : order.drop.address
    }   

    async function fetchRoute(pickup,drop) {
        const url = `https://router.project-osrm.org/route/v1/driving/` +
            `${pickup.lng},${pickup.lat};${drop.lng},${drop.lat}` +
            `?overview=full&geometries=geojson`;

        const res = await fetch(url)
        const data = await res.json()

        if(!data.routes || data.routes.length === 0) return null

          return data.routes[0].geometry.coordinates.map(coord => ({
            lat: coord[1],
            lng: coord[0]
        }));
    }

    async function startSimulation() {
        if(!routePath || routePath.length === 0){
            console.log("Cannot start simulation : routePath empty")
            return
        }
        if (simInterval) clearInterval(simInterval);

        const path = routePath;

        let index = 0;

        simInterval = setInterval(async () => {
            if (index >= path.length) {
                stopSimulation()
                console.log("Simulation complete");
                return;
            }
            const jitter = () => (Math.random() - 0.5) * 0.0001;

            const lat = routePath[index].lat + jitter();
            const lng = routePath[index].lng + jitter();

            try{
                await API.post(
                    "/location/update",
                    {
                        order_id: order_id,
                        lat: path[index].lat,
                        lng: path[index].lng
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }catch(err){
                console.error("❌ Error sending simulated location", err);
            }

            index++ ;
        }, speed);
    }
    function stopSimulation() {
        if (simInterval) {
            clearInterval(simInterval);
            simInterval = null;
            console.log("Simulation stopped");
        }
    }

    async function updateStatus(newStatus) {
        try{
            await API.put(
                `/order/${order_id}/status`,
                {status : newStatus},
                {headers : {Authorization : `Bearer ${token}`}}
            )
            setOrder({...order,status:newStatus})
        }catch(err){
            console.error("Status update failed", err);
        }
    }

  return (
    <>
      <NavBar/>
      <div className="agent-details-container">
        <header className="agent-details-header">
          <h2>Order #{order_id}</h2>
            <span className={`status-badge status-${order.status}`}>
              {order.status.replace("_", " ").toUpperCase()}
            </span>      
        </header>

        <div className="info-grid">
          <div className="info-card">
            <h3>Pickup</h3>
            <p><span style={{fontWeight:"bold"}}>Address : </span>{order.pickup.address}</p>
            <p className="coords">
              <span style={{fontWeight:"bold"}}>Latitude : </span>{order.pickup.lat} , <span style={{fontWeight:"bold"}}>Langitude : </span> {order.pickup.lng}
            </p>
          </div>
          <div className="info-card">
            <h3>Drop</h3>
            <p><span style={{fontWeight:"bold"}}>Address :</span> {order.drop.address}</p>
            <p className="coords">
              <span style={{fontWeight:"bold"}}>Latitude : </span>{order.drop.lat} , <span style={{fontWeight:"bold"}}>Langitude : </span>{order.drop.lng}
            </p>
          </div>
        </div>
        <div className="agent-actions">
          {order.status === "assigned" && (
            <button onClick={() => updateStatus("picked")}>Accept Order</button>
          )}

          {order.status === "picked" && (
            <button onClick={() => updateStatus("in_transit")}>
              Start Delivery
            </button>
          )}
          {order.status === "in_transit" && (
            <>
              <button
                className="secondary"
                onClick={() => navigate(`/track/${order_id}`)}
              >
                Track Live
              </button>

              <button className="primary" onClick={startSimulation}>
                Start Simulation
              </button>

              <button className="danger" onClick={stopSimulation}>
                Stop Simulation
              </button>

              <button
                onClick={() => updateStatus("delivered")}
                className="success"
              >
                Mark Delivered
              </button>
            </>
          )}
          {order.status === "delivered" && (
            <span className="delivered-text">✔ Delivery Completed</span>
          )}
        </div>
      </div>
    </>
  );
}
