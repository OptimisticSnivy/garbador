<script>
	import { onMount } from "svelte";

	let map;
	let API_KEY = import.meta.env.VITE_KEY;

	const stops = [
		{ lat: 37.7749, lng: -122.4194, title: "San Francisco" }, // Origin
		{ lat: 35.3733, lng: -119.0187, title: "Bakersfield" }, // Stop
		{ lat: 34.0522, lng: -118.2437, title: "Los Angeles" }, // Destination
	];
	async function getRoute() {
		const apiKey = API_KEY;
		const url = `https://routes.googleapis.com/directions/v2:computeRoutes`;

		const requestBody = {
			origin: {
				location: { latLng: { latitude: 37.7749, longitude: -122.4194 } },
			}, // SF
			destination: {
				location: { latLng: { latitude: 34.0522, longitude: -118.2437 } },
			}, // LA
			intermediates: [
				{ location: { latLng: { latitude: 35.3733, longitude: -119.0187 } } }, // Bakersfield
			],
			travelMode: "DRIVE",
			routingPreference: "TRAFFIC_AWARE",
		};

		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Goog-Api-Key": apiKey,
				"X-Goog-FieldMask": "routes.polyline",
			},
			body: JSON.stringify(requestBody),
		});

		const data = await response.json();
		if (data.routes && data.routes.length > 0) {
			drawRoute(data.routes[0].polyline.encodedPolyline);
		} else {
			console.error("No route found", data);
		}
	}

	function drawRoute(encodedPolyline) {
		const decodedPath =
			google.maps.geometry.encoding.decodePath(encodedPolyline);
		const routePolyline = new google.maps.Polyline({
			path: decodedPath,
			geodesic: true,
			strokeColor: "#FF0000",
			strokeOpacity: 1.0,
			strokeWeight: 4,
		});
		routePolyline.setMap(map);
	}

	function addMarkers() {
		stops.forEach((stop) => {
			new google.maps.Marker({
				position: { lat: stop.lat, lng: stop.lng },
				map,
				title: stop.title,
			});
		});
	}

	function initMap() {
		map = new google.maps.Map(document.getElementById("map"), {
			zoom: 6,
			center: { lat: 36.5, lng: -120.5 }, // Center between SF and LA
		});

		getRoute();
		addMarkers();
	}

	onMount(() => {
		if (!window.google) {
			const script = document.createElement("script");
			script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=geometry&callback=initMap`;
			script.async = true;
			script.defer = true;
			document.body.appendChild(script);
		} else {
			initMap();
		}
	});
</script>

<div id="title">
	<div id="text">routing.</div>
</div>
<div id="map"></div>

<style>
	#map {
		height: 1000px;
		width: 100%;
	}

	#title {
		display: flex;
		font-size: 30px;
		margin: auto;
		margin-top: 50px;
		margin-bottom: 20px;
		width: 75%;
	}

	#text {
		flex-grow: 1;
		text-align: left;
	}
</style>
