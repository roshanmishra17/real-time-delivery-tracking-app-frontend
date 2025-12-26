import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
export default function OrderPage(){
    const navigate = useNavigate()
    const[orders,setOrders] = useState([])

    useEffect(() => {
        async function loadOrders(){
            const token = localStorage.getItem("token")
            if(!token){
                navigate('/login')
                return
            }

            const res = await API.get("order/my",{
                headers : {
                    Authorization : `Bearer ${token}`
                }
            })

            setOrders(res.data)
        }
        loadOrders()
    },[]) 
    return (
        <div>
          <h1>Your Orders</h1>
    
          {orders.map((order) => (
            <div key={order.id} style={{ marginBottom: 10 }}>
              Order #{order.id}
    
              <button
                onClick={() => navigate(`/orders/${order.id}`)}
                style={{ marginLeft: 10 }}
              >
                Track Order
              </button>
            </div>
          ))}
        </div>
      );
}