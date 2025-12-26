import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import NavBar from "./NavBar";
import "../CSS/OrderDetailsPage.css"

export default function OrderDetailsPage(){
    const navigate = useNavigate()
    const {order_id} = useParams()
    const [order,setOrder] = useState(null)
    const [latestLocation,setLatestLocation] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if(!token){
            navigate('/login')
            return
        }
        async function loadData() {
            try{
                const res = await API.get(`/order/${order_id}`,{
                    headers : { Authorization: `Bearer ${token}` }
                })
                setOrder(res.data)

                const locResult = await API.get(`/order/${order_id}/latest-location`,{
                    headers : {Authorization : `Bearer ${token}`}
                })
                setLatestLocation(locResult.data)
            }catch(err){
                console.error("Failed to load order:", err);
            }
        }
        loadData()
    },[order_id,navigate])

    if (!order) return <h2>Loading order details...</h2>;

    return(
        <>
            <NavBar/>
            <div className="order-details-container">
                <div className="order-header">
                    <h2>Order #{order.order_id}</h2>
                    <span className={`status-badge ${order.status}`}>
                        {order.status.replace("_", " ")}
                    </span>
                </div>

                <div className="order-grid">
                    <div className="card">
                        <h4>Pickup</h4>
                        <p>{order.pickup.address}</p>
                        <small>
                            Lat: {order.pickup.lat}, Lng: {order.pickup.lng}
                        </small>
                    </div>

                    <div className="card">
                        <h4>Drop</h4>
                        <p>{order.drop.address}</p>
                        <small>
                            Lat: {order.drop.lat}, Lng: {order.drop.lng}
                        </small>
                    </div>

                    <div className="card">
                        <h4>Delivery Agent</h4>
                        {order.agent ? (
                            <>
                                <p>{order.agent.name}</p>
                                <small>{order.agent.email}</small>
                            </>
                            ) : (
                                <p className="muted">Not assigned yet</p>
                            )
                        }
                    </div>

                    <div className="card">
                        <h4>Latest Location</h4>

                        {latestLocation?.latest_location ? (
                            <>
                            <p>
                                Lat: {latestLocation.latest_location.lat}, 
                                Lng: {latestLocation.latest_location.lng}
                            </p>
                            <small>{latestLocation.timestamp}</small>
                            </>
                        ) : (
                            <p className="muted">No location updates yet</p>
                        )}
                    </div>
                </div>

                <div className="order-actions">
                    {order.status !== "pending" && (
                        <button
                        className="track-btn"
                        onClick={() => navigate(`/track/${order_id}`)}
                        >
                            Track Live
                        </button>
                    )}

                    <button className="back-btn" onClick={() => navigate(-1)}>
                        Back to Orders
                    </button>
                </div>
            </div>
        </>
    )
}