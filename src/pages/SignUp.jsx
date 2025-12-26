import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/signup.css"
import API from "../api/axios";

export default function SignUp(){
    const navigate = useNavigate();

    const [form,setForm] = useState({
        name : "",
        email : "",
        password : "",
        confirm : ""
    })
    const [error,setError] = useState("");
    const [success,setSuccess] = useState("");

    async function handleSignup(e) {

        e.preventDefault()
        setError("");
        setSuccess("");

        if (form.password !== form.confirm) {
            setError("Passwords do not match.");
            return;
        }

        try{
            await API.post("/users", form);
            alert("Account created! Now login.");
            setSuccess("Account created successfully!");
            setTimeout(() => navigate("/login"), 1200);            
        }catch(err){
            setError("Signup failed - Email may already exist")
        }
    }

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h2>Create Account</h2>

                {error && <p className="error-msg">{error}</p>}
                {success && <p className="success-msg">{success}</p>}
                <form onSubmit={handleSignup}>
                    <input
                        name="name"
                        type="text"
                        placeholder="Full name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                    />

                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                    />
                    <input
                        name="confirm"
                        type="password"
                        placeholder="Confirm Password"
                        value={form.confirm}
                        onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                        required
                    />

                    <button type="submit">Create Account</button>
                </form>
                <p className="login-text">
                    Already have an account?  
                    <span onClick={() => navigate("/login")}> Login</span>
                </p>
            </div>
        </div>
    );
}