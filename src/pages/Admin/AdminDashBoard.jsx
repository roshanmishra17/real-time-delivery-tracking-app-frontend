import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import NavBar from "../NavBar";
import "../../CSS/AdminDashBoard.css"

export default function AdminDashboard(){
    const navigate = useNavigate();
    const [stats,setStats] = useState({
        totalOrders: 0,
        activeOrders: 0,
        deliveredOrders: 0,
        agents: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        async function load() {
            try{
                const res = await API.get("/order/recent",{
                    headers : {Authorization : `Bearer ${token}`},
                });
                
                const agentsRes = await API.get("/admin/agents", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const orders = res.data

                setStats({
                    totalOrders: orders.length,
                    activeOrders: orders.filter(
                        (o) => o.status !== "delivered"
                    ).length,
                    deliveredOrders: orders.filter(
                        (o) => o.status === "delivered"
                    ).length,
                    agents: agentsRes.data.length,
                });
                setRecentOrders(orders.slice(0, 5));
            }catch(err){
                console.error("Stats Failed to load",err);
            }
        }
        load()
    },[token])

    if(!stats) return <h2>Loading...</h2>

    return (
        <>
            <NavBar/>
            <div className="admin-dash-container">
                <h2 className="dash-title">Admin Dashboard</h2>

                {/* STATS */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>{stats.totalOrders}</h3>
                        <p>Total Orders</p>
                    </div>

                    <div className="stat-card active">
                        <h3>{stats.activeOrders}</h3>
                        <p>Active Orders</p>
                    </div>

                    <div className="stat-card delivered">
                        <h3>{stats.deliveredOrders}</h3>
                        <p>Delivered</p>
                    </div>

                    <div className="stat-card agents">
                        <h3>{stats.agents}</h3>
                        <p>Agents</p>
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="quick-actions">
                    <button onClick={() => navigate("/admin/orders")}>
                        View All Orders
                    </button>

                    <button onClick={() => navigate("/admin/orders")}>
                        Assign Agents
                    </button>
                </div>

                {/* RECENT ORDERS */}
                <div className="recent-orders">
                    <h3>Recent Orders</h3>

                    {recentOrders.length === 0 ? (
                        <p>No recent orders</p>
                        ) : (
                        recentOrders.map((order) => (
                            <div key={order.id} className="recent-card">
                                <span>Order #{order.order_id}</span>
                                <span className={`status status-${order.status}`}>
                                    {order.status.replace("_", " ").toUpperCase()}
                                </span>
                                <button className="view" onClick={() => navigate(`/orders/${order.order_id}`)}>
                                    View Details
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}