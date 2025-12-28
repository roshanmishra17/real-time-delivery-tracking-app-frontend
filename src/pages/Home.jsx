import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
export default function Home(){
    const navigate = useNavigate()
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("role")

    return(
        <>
            <NavBar/>
            <section className="hero">
                <div className="hero-content">
                    <h1>Real-Time Delivery Tracking</h1>
                    <p>
                        Track your orders live on the map.  
                        Assign agents, update locations, and monitor deliveries in real time.
                    </p>
                    {!token && (
                        <button onClick={() => navigate("/login")} className="primary-btn">
                            Get Started
                        </button>
                    )}
                    {token && (
                        <button className="primary-btn"
                        onClick={() =>
                            navigate(
                            role === "customer"
                                ? "/dashboard"
                                : role === "agent"
                                ? "/agent/orders"
                                : "/admin/dashboard"
                            )
                        }
                        >
                            Go to Dashboard
                        </button>
                    )}
                </div>
            </section>

            <section className="features">
                <h2>Why Choose FastTrack</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <h3>📍 Live Location Tracking</h3>
                        <p>Track your delivery agent in real-time on our smart map.</p>
                    </div>
                    <div className="feature-card">
                        <h3>⚡ Instant WebSocket Updates</h3>
                        <p>Location updates within milliseconds for all customers.</p>
                    </div>
                    <div className="feature-card">
                        <h3>🧑‍💼 Role-Based Dashboards</h3>
                        <p>Customer, Agent, and Admin – each gets their own UI.</p>
                    </div>
                    <div className="feature-card">
                        <h3>🎯 Smart Assignment</h3>
                        <p>Admins assign agents and manage all running orders.</p>
                    </div>
                </div>
            </section>
        </>
    )
}