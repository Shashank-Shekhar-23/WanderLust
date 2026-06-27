mapboxgl.accessToken = mapToken;

const coordinates = (listing.geometry && listing.geometry.coordinates && listing.geometry.coordinates.length === 2)
    ? listing.geometry.coordinates
    : [77.209, 28.613]; // Default to Delhi coordinates if none exists

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: coordinates, // starting position [lng, lat]
    zoom: 12
});

const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h4>${listing.title}</h4><p>Exact location will be provided after booking</p>`))
    .addTo(map);