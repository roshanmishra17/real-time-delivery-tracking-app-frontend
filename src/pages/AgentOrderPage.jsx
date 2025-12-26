import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import '../CSS/AgentOrderPage.css'
import NavBar from "./NavBar";

export default function AgentOrdersPage() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function load() {
      try {
        const res = await API.get("/order/assigned", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Error loading agent orders", err);
      }
    }
    load();
  }, [token]);

  return (
    <>
      <NavBar/>
      <div className="agent-container">
        <header className="agent-header">
          <h1>Agent Dashboard</h1>
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </header>

        <h3 className="agent-title">Assigned Orders</h3>

        <div className="agent-orders">
          {orders.length === 0 ? (
            <p className="empty-text">No orders assigned yet.</p>
          ) : (
            orders.map((order) => (
              <div className="agent-order-card" key={order.id}>
                <div className="order-top">
                  <h4>Order #{order.id}</h4>
                  <span className={`status-badge status-${order.status}`}>
                    {order.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>

                <p><b>Pickup:</b> {order.pickup_add}</p>
                <p><b>Drop:</b> {order.drop_add}</p>

                <div className="agent-actions">
                  {order.status === "assigned" && (
                    <button
                      className="primary"
                      onClick={() => navigate(`/agent/order/${order.id}`)}
                    >
                      Accept Order
                    </button>
                  )}

                  {order.status === "picked" && (
                    <button
                      className="primary"
                      onClick={() => navigate(`/agent/order/${order.id}`)}
                    >
                      Start Delivery
                    </button>
                  )}

                  {order.status === "in_transit" && (
                    <>
                      <button
                        className="secondary"
                        onClick={() => navigate(`/track/${order.id}`)}
                      >
                        Track Live
                      </button>

                      <button
                        className="primary"
                        onClick={() => navigate(`/agent/order/${order.id}`)}
                      >
                        Manage Delivery
                      </button>
                    </>
                  )}

                  {order.status === "delivered" && (
                    <span className="delivered-text">✔ Delivered</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
