import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../CSS/CreateOrder.css"
import NavBar from "./NavBar";
import Footer from "./footer";
import MapSelector from "./MapSelector";

export default function CreateOrder(){
    const navigate = useNavigate()
    const token = localStorage.getItem("token")
    const[error,setError] = useState("")
    const [form,setForm] = useState({
        pickup_lat : "",
        pickup_lng : "",
        pickup_add : "",

        drop_lat : "",
        drop_lng : "",
        drop_add : "",
    })

    const [selecting,setSelecting] = useState("pickup")
    const [loading,setLoading] = useState(false)

    async function getAddress(lat, lng) {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
            );
            const data = await res.json();
            return data.display_name;
        } catch (err) {
            console.error(err);
            return "Address not found";
        }
    }

    // function handleChange(e) {
    //     setForm({
    //         ...form,
    //         [e.target.name]: e.target.value
    //     });
    // }

    

    async function handleSubmit(e) {
        e.preventDefault();
        if (!form.pickup_lat || !form.drop_lat) {
            setError("Please select both pickup and drop locations on the map");
            return;
        }
        try{
            await API.post('/order/',form,{
                headers : {Authorization : `Bearer ${token}`}
            })
            navigate('/dashboard')
        }catch(err){
            if (err.response && err.response.data){
                setError(err.response.data.detail || "Failed to create order");
            }
            else{
                setError("Failed to create order. Check input values.");
            }
        }
    }

    return (
        <>
            <NavBar/>
            <div className="create-container">
                <div className="create-card">
                    <h2>Create New Order</h2>
                    {error && <p className="error-msg">{error}</p>}
                    {loading && <p>Fetching address...</p>}
                    <p className="subtitle">
                        Enter pickup and drop details to start delivery
                    </p>

                    <form onSubmit={handleSubmit}>

                        <div className="map-buttons">
                        <button
                            type="button"
                            style={{ background: selecting === "pickup" ? "green" : "" }}
                            onClick={() => setSelecting("pickup")}
                        >
                            Select Pickup
                        </button>
                            <button
                                type="button"
                                style={{ background: selecting === "drop" ? "green" : "" }}
                                onClick={() => setSelecting("drop")}
                            >
                                Select Drop
                            </button>
                        </div>
                        <MapSelector
                            onSelect={async (loc) => {
                                setLoading(true);

                                const address = await getAddress(loc.lat, loc.lng);

                                setLoading(false);

                                if (selecting === "pickup") {
                                    setForm(prev => ({
                                        ...prev,
                                        pickup_lat: loc.lat,
                                        pickup_lng: loc.lng,
                                        pickup_add: address
                                    }));
                                } else {
                                    setForm(prev => ({
                                        ...prev,
                                        drop_lat: loc.lat,
                                        drop_lng: loc.lng,
                                        drop_add: address
                                    }));
                                }
                            }}
                        />

                        <div className="section">
                            <h4>Pickup Details</h4>
                            <input
                                value={form.pickup_add} 
                                readOnly
                            />
                        </div>

                        <div className="section">
                            <h4>Drop Details</h4>
                            <input
                                value={form.drop_add}   
                                readOnly
                            />
                        </div>
                        <p>Pickup: {form.pickup_add || "Not selected"}</p>
                        <p>Drop: {form.drop_add || "Not selected"}</p>
                        <button 
                            type="submit" 
                            className="submit-Btn"
                            disabled={!form.pickup_lat || !form.drop_lat}

                        >
                            Create Order
                        </button>
                    </form>
                </div>
            </div>
            <Footer/>
        </>
    );
}