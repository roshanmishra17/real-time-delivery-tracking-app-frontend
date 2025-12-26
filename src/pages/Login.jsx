import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../CSS/login.css"
import NavBar from "./NavBar";

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const[error,setError] = useState("");

    async function handleLogin(e) {
      e.preventDefault();

      try {
        const response = await API.post(
          "/login",
          new URLSearchParams({
            username: email,  
            password: password
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          }
        );

        const token = response.data.access_token;
        const payload = JSON.parse(atob(token.split(".")[1]));
        const role = payload.role;


        localStorage.setItem("token", token);
        localStorage.setItem("role",role)
        // console.log("Stored token:", token);

        console.log(role)

        if (role === "customer") {
          navigate("/dashboard");
        } else if (role === "agent") {
          navigate("/agent/orders");
        } else if (role === "admin") {
          navigate("/admin/dashboard");
        }


      } catch (err) {
        console.error("Login failed:", err);
        setError(err)
      }
  }

  return (
    <>
      <NavBar/>
      <div className="login-container">
        <div className="login-card">
          <h1>Login</h1>
          {error && <p className="error-msg">{error}</p>}
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}r
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="submit-Btn">
              Login
            </button>
          </form>
          <p className="signup-text">
            New here? <span onClick={() => navigate("/signup")}>Create an account</span>
          </p>
        </div>
      </div>
    </>
  );
}
