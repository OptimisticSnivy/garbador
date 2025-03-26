<script>
	import { onMount } from "svelte";
	import "leaflet/dist/leaflet.css";
	import L from "leaflet";
	import polyline from "@mapbox/polyline"; // Required for decoding Google Maps polyline

	let map;
	const API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

	async function getRoute() {
		const url = `https://maps.googleapis.com/maps/api/directions/json?origin=18.5204,73.8567&destination=19.0760,72.8777&mode=driving&key=${API_KEY}`;

		try {
			const response = await fetch(url);
			const data = await response.json();

			if (data.routes && data.routes.length > 0) {
				const encodedPolyline = data.routes[0].overview_polyline.points;
				const decodedPath = polyline.decode(encodedPolyline);
				const leafletPath = decodedPath.map((coord) => [coord[0], coord[1]]);

				L.polyline(leafletPath, { color: "blue", weight: 5 }).addTo(map);
			} else {
				console.error("No route found", data);
			}
		} catch (error) {
			console.error("Error fetching route", error);
		}
	}

	onMount(() => {
		map = L.map("map").setView([18.5204, 73.8567], 12); // Center on Pune

		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution: "© OpenStreetMap contributors",
		}).addTo(map);

		getRoute(); // Fetch route and draw it on the map
	});
</script>

<div id="title">
	<div id="text">routing.</div>
</div>
<div id="map"></div>

<style>
	#map {
		height: 782px;
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
