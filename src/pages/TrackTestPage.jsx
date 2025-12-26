import useOrderTracking from "../hooks/useWebsocket";
import { useParams } from "react-router-dom";


export default function TrackTestPage() {
  const { order_id } = useParams();
  const token = localStorage.getItem("token");

  const location = useOrderTracking(order_id, token);

  console.log("orderId:", order_id);
  console.log("token:", token);
  if (!token) {
    console.log("Token not loaded yet");
    return <div>Loading...</div>;
  }

  return (
      <div>
        <h2>Testing WebSocket for Order #{order_id}</h2>
        <pre>
          {location ? JSON.stringify(location, null, 2) : "Waiting for updates..."}
        </pre>
      </div>
  );
}
