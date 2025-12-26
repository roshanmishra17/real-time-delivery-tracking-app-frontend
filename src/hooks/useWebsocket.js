import { useEffect, useRef, useState } from "react";

export default function useOrderTracking(order_id,token){
    const wsRef = useRef(null)
    const [location,setLocation] = useState(null)
    const [connected,setConnected] = useState(false)

    useEffect(() => {
        if(!order_id || !token) return

        const wsUrl = `ws://localhost:8000/ws/track/${order_id}?token=${token}`;
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        
        ws.onopen = () => {
            setConnected(true)
            console.log("WS connected")
        }

        ws.onmessage = (event) => {
            try{
                const data = JSON.parse(event.data)
                console.log('WS update',data)
                if (data.type === "ping") return;

                if(data.lat && data.lng){
                    setLocation({
                        lat : data.lat,
                        lng : data.lng,
                        timestamp : data.timestamp
                    })
                }
            }catch(err){
                console.error('WS JSON parse error',err)
            }
        }

        ws.onclose = () => {
            setConnected(false)
            console.log('WS Disconnected')
        }

        return () => ws.close()
    },[order_id,token])
    return {location,connected}
}