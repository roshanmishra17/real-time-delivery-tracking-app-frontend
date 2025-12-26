import { useNavigate,Link } from "react-router-dom";
import "../CSS/Home_NavBar.css";
import { useEffect, useState } from "react";

export default function NavBar(){
    const navigate = useNavigate()
    const[isOpen,setIsOpen] = useState(false)
    const[scrolled,setIsScrolled] = useState(false);



    const token = localStorage.getItem("token")
    const role = localStorage.getItem("role")

    const logout = () => {
        localStorage.clear();
        navigate("/login");
    };
    useEffect(() => {
        const handleScroll = () => {
            if(window.scrollY > 50){
                setIsScrolled(true);
            }else{
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll',handleScroll);
    },[])
    
    function toggleMenu(){
        setIsOpen(!isOpen);
    }


    return (
        <header className={`navbar ${scrolled ? 'scroll':''}`}>
            <div className="navbar-logo">
                <h1>FastTrack</h1>
            </div>

            <nav className={`navbar-nav ${isOpen ? 'open':" "}`}>
                <ul>
                    <li><Link to="/">Home</Link></li>

                    {role === "customer" && (
                        <li><Link to="/dashboard">My Orders</Link></li>
                    )}

                    {role === "agent" && (
                        <li><Link to="/agent/orders">Agent Dashboard</Link></li>
                    )}

                    {role === "admin" && (
                        <li><Link to="/admin/dashboard">Admin Dashboard</Link></li>
                    )}

                    {!token ? (
                        <li><Link className="loginBtn" to="/login">Login</Link></li>
                    ) : (
                        <li>
                            <button className="logoutBtn" onClick={logout}>Logout</button>
                        </li>
                    )}
                    {role === "customer" && (
                        <li>
                            <Link to="/create-order" className="createBtn">Create Order</Link>
                        </li>
                    )}

                </ul>
            </nav>
            <div className="hamburger" onClick={toggleMenu}>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>
        </header>
    );
}