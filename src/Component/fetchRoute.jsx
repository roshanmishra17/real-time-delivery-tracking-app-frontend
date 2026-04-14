export async function fetchRoute(pickupPoint, dropPoint) {
    try {
        const url =
            `https://router.project-osrm.org/route/v1/driving/` +
            `${pickupPoint.lng},${pickupPoint.lat};${dropPoint.lng},${dropPoint.lat}` +
            `?overview=full&geometries=geojson`;

        const resp = await fetch(url);
        const data = await resp.json();


        if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];

            const coords = route.geometry.coordinates.map(c => ({
                lat: c[1],
                lng: c[0]
            }));

            return {
                path: coords,
                distance: route.distance,   
                duration: route.duration
            };
        }

        return { path: [], distance: 0, duration: 0 };

    } catch (err) {
        console.error("Route fetch failed", err);
        return {path: [], distance: 0, duration: 0};
    }
}