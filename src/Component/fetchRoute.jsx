export async function fetchRoute(pickupPoint, dropPoint) {
    try {
        const url =
            `https://router.project-osrm.org/route/v1/driving/` +
            `${pickupPoint.lng},${pickupPoint.lat};${dropPoint.lng},${dropPoint.lat}` +
            `?overview=full&geometries=geojson`;

        const resp = await fetch(url);
        const data = await resp.json();

        if (data.routes && data.routes.length > 0) {
            return data.routes[0].geometry.coordinates.map((c) => ({
                lat: c[1],
                lng: c[0],
            }));
        }

        return [];
    } catch (err) {
        console.error("Route fetch failed", err);
        return [];
    }
}