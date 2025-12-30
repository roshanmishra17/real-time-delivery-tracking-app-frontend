import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "../CSS/CreateOrder.css"
import NavBar from "./NavBar";
import Footer from "./footer";

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

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try{
            await API.post('/order',form,{
                headers : {Authorization : `Bearer ${token}`}
            })
            navigate('/dashboard')
        }catch(err){
            if (err.response && err.response.data){
                setError(err.response.data.detail || "Failed to create order");
            }else{
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
                    <p className="subtitle">
                        Enter pickup and drop details to start delivery
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="section">
                            <h4>Pickup Details</h4>
                            <input
                                name="pickup_add"
                                placeholder="Pickup Address"
                                value={form.pickup_add}
                                onChange={handleChange}
                                required
                            />
                            <div className="row">
                                <input
                                    name="pickup_lat"
                                    placeholder="Pickup Latitude"
                                    value={form.pickup_lat}
                                    onChange={handleChange}
                                    required
                                />

                                <input
                                    name="pickup_lng"
                                    placeholder="Pickup Longitude"
                                    value={form.pickup_lng}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="section">
                            <h4>Drop Details</h4>
                            <input
                                name="drop_add"
                                placeholder="Drop Address"
                                value={form.drop_add}
                                onChange={handleChange}
                                required
                            />
                            <div className="row">
                                <input
                                    name="drop_lat"
                                    placeholder="Drop Latitude"
                                    value={form.drop_lat}
                                    onChange={handleChange}
                                    required
                                />

                                <input
                                    name="drop_lng"
                                    placeholder="Drop Longitude"
                                    value={form.drop_lng}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="submit-Btn">
                            Create Order
                        </button>
                    </form>
                </div>
            </div>
            <Footer/>
        </>
    );
}