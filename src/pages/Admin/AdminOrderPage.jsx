import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import '../../CSS/AdminOrderPage.css'
import NavBar from "../NavBar";

export default function AdminOrderPage(){
    const navigate = useNavigate();
    const [orders,setOrders] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        async function loadOrder() {    
            try{
                const res = await API.get('/order',{
                    headers : {Authorization : `Bearer ${token}`}
                })
                setOrders(res.data);
            }catch(err){
                console.error("Failed to load orders", err);
            }
        }
        loadOrder();
    },[token])

  return (
    <>
        <NavBar/>
        <div className="admin-orders-container">
            <h2 className="page-title">All Orders</h2>

            {orders.length === 0 && (
                <p className="empty-text">No orders found.</p>
            )}

            <div className="orders-grid">
                {orders.map((order) => (
                <div key={order.order_id} className="orders-card">
                    <div className="orders-header">
                    <h3>Order #{order.id}</h3>
                    <span className={`status status-${order.status}`}>
                        {order.status.replace("_", " ").toUpperCase()}
                    </span>
                    </div>

                    <div className="orders-info">
                        <p><b>Pickup:</b> {order.pickup_add}</p>
                        <p><b>Drop:</b> {order.drop_add}</p>
                        <p>
                            <b>Agent:</b>{" "}
                            {order.agent?.id ? `Agent #${order.agent.id}` : "Not Assigned"}
                        </p>
                    </div>

                    <div className="orders-action">
                        <button
                        className="assign-button"
                        disabled={order.agent?.id}
                        onClick={() =>
                            navigate(`/admin/orders/${order.id}`)
                        }
                        >
                            Assign Agent
                        </button>

                        <button
                            className="view-button"
                            onClick={() =>
                                navigate(`/orders/${order.id}`)
                            }
                        >
                            View Details
                        </button>
                    </div>
                </div>
                ))}
            </div>
        </div>
    </>
  );
}

