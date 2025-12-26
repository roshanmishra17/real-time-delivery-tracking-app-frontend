import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../CSS/CustomerDashBoard.css"
import NavBar from "./NavBar";

export default function CustomerDashboard() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await API.get("/order/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Error loading orders", err);
      }
    }
    loadOrders();
  }, [token]);

  return (
    <>
      <NavBar/>

      <div className="customer-container">
        <div className="dashboard-header">
          <h2>My Orders</h2>
          <button
            className="create-btn"
            onClick={() => navigate("/create-order")}
          >
            Create Order
          </button>
        </div>

        {orders.length === 0 && (
          <div className="empty-state">
            <p>No orders yet.</p>
            <button onClick={() => navigate("/create-order")}>
              Create your first order
            </button>
          </div>
        )}

        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-top">
                <span className="order-id">Order #{order.id}</span>
                <span className={`status ${order.status}`}>
                  {order.status.replace("_", " ")}
                </span>
              </div>

              <div className="order-body">
                <p><b>Pickup:</b> {order.pickup_add}</p>
                <p><b>Drop:</b> {order.drop_add}</p>
              </div>

              <div className="order-actions">
                <button
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="details-btn"
                >
                  View Details
                </button>

                {order.status !== "pending" && (
                  <button
                    onClick={() => navigate(`/track/${order.id}`)}
                    className="track-btn"
                  >
                    Track Live
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
