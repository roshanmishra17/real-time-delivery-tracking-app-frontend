# 🚚 Real-Time Delivery Tracking (Frontend)

A React-based frontend application that enables users to track deliveries in real-time using live location updates and interactive maps.

## 🔗 Live Demo

👉 https://real-time-delivery-tracking-app-fro.vercel.app/

## 📸 Screenshots

### 🗺️ Live Tracking
<img width="2838" height="1489" alt="Screenshot 2026-04-13 121339" src="https://github.com/user-attachments/assets/88b150ed-a9dc-4327-8113-67cfe5c3ebbe" />


### 📱 Dashboard
<img width="2851" height="1431" alt="Screenshot 2026-04-13 121104" src="https://github.com/user-attachments/assets/6cc9ab1e-bf24-4936-8cba-5caf685b944a" />

## 🛠️ Tech Stack

- React.js
- JavaScript (ES6+)
- WebSockets
- Redis
- Map API (Leaflet)

## ⚙️ How It Works

- The frontend connects to the backend using WebSockets.
- Redis is used on the backend to store and stream real-time location updates.
- When the delivery agent’s location changes, it is pushed to Redis.
- The backend listens to Redis and sends updates to the frontend via WebSockets.
- The frontend updates the map marker instantly.

## ⚡ Role of Redis

- Used as an in-memory data store for fast location updates
- Helps in handling real-time data efficiently
- Reduces database load by caching frequently updated data
- Enables smooth and scalable real-time tracking
