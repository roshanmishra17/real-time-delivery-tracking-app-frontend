import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";
import "../../CSS/AssignAgentPage.css"
import NavBar from "../NavBar";

export default function AssignAgentPage(){
    const {order_id} = useParams();

    const navigate = useNavigate();

    const [order,setOrder] = useState(null);
    const [agents,setAgents] = useState([]);
    const[error,setError] = useState("");
    const [selectedAgent,setSelectedAgent] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        async function loadPage() {
            try{
                const OrderRes = await API.get(`/order/${order_id}`,{
                    headers :{Authorization : `Bearer ${token}`},
                })
                setOrder(OrderRes.data);

                const agentRes = await API.get('/admin/agents',{
                    headers :{Authorization : `Bearer ${token}`}
                });
                setAgents(agentRes.data)
            }catch(err){
                setError("Failed to load order or agents")
            }
        }
        loadPage()
    },[order_id,token])

    async function assignAgent() {
        if (!selectedAgent) {
            setError("Please select an agent");
            return;
        }

        try {
            await API.post(
                `/order/${order_id}/assign`,
                {
                    agent_id: selectedAgent
                },
                {
                    headers: {Authorization : `Bearer ${token}`},
                }
            );

            alert("Agent Assigned Successfully");
            navigate("/admin/orders");
        } catch (err) {
            setError("Assign Agent failed");
            console.error("Agent assignment failed", err);
        }
    }

    if(!order) return <h2>Loading Order...</h2>

  return (
    <>
        <NavBar/>
        <div className="assign-container">
            <div className="assign-card">
                <h2>Assign Agent</h2>

                {error && <p className="error-msg">{error}</p>}

                <div className="order-summary">
                    <h3>Order #{order.order_id}</h3>
                    <p><b>Status : </b>{order.status.replace("_", " ").toUpperCase()}</p>
                    <p><b>Pickup :</b> {order.pickup.address}</p>
                    <p><b>Drop :</b> {order.drop.address}</p>
                </div>

                <div className="agent-list">
                    <h3>Select Agent</h3>
                    
                    {agents.length === 0 ? (
                        <p className="empty">No agents available</p>
                    ) : (
                        agents.map((agent) => (
                        <label key={agent.id} className="agent-item">
                            <input
                            type="radio"
                            name="agent"
                            value={agent.id}
                            onChange={() => setSelectedAgent(agent.id)}
                            />
                                <div className="agent-info">
                                    <span className="agent-name">Name : {agent.name}</span>
                                    <span className="agent-email">Email : {agent.email}</span>
                                </div>
                        </label>
                        ))
                    )}
                </div>

                <button className="assign-btn" onClick={assignAgent}>
                    Assign Agent
                </button>
            </div>
        </div>
    </>
  );
}