import { BrowserRouter, Routes, Route } from "react-router-dom";
import TrackTestPage from "./pages/TrackTestPage";
import Login from "./pages/Login";
import OrderPage from "./pages/Orders";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import LiveTrackPage from "./pages/LiveTrackPage";
import AgentOrderDetailsPage from "./pages/Agent_Order_Page_Details";
import AgentOrdersPage from "./pages/AgentOrderPage";
import AdminDashboard from "./pages/Admin/AdminDashBoard";
import AdminOrderPage from "./pages/Admin/AdminOrderPage";
import AssignAgentPage from "./pages/Admin/AssignAgentPage";
import "leaflet/dist/leaflet.css";
import AdminAgentMap from "./pages/Admin/AdminAgentsMap";
import SignUp from "./pages/SignUp";
import CustomerDashboard from "./pages/CustomerDashBoard";
import CreateOrder from "./pages/CreateOrder";
import Home from "./pages/Home";
function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/orders/:order_id" element={<OrderDetailsPage />} />
        <Route path="/track/:order_id" element={<LiveTrackPage />} />
        <Route path="/agent/orders" element={<AgentOrdersPage />} />
        <Route path="/agent/order/:order_id" element={<AgentOrderDetailsPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="admin/orders" element={<AdminOrderPage/>}/>
        <Route path="/admin/orders/:order_id" element={<AssignAgentPage />} />
        <Route path="/admin/agents-map" element={<AdminAgentMap />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<CustomerDashboard />} />
        <Route path="/create-order" element={<CreateOrder />} />

        <Route path="/" element={<Home />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
