<script>
	import { onMount } from "svelte";
	import { setMarkers } from "../mapinterface/+page.svelte";
	import PocketBase from "pocketbase";
	import polyline from "@mapbox/polyline"; // For decoding Mapbox polylines

	let map;
	let stops = [];
	const pb = new PocketBase("http://127.0.0.1:8090");
	let API_KEY = import.meta.env.VITE_MAPBOX_KEY;

	async function getStops() {
		const records = await pb.collection("sensors").getFullList({});
		stops = records
			.filter((record) => record.fillperc > 80) // Only high-priority stops
			.map((record) => [record.long, record.lat]); // Map to [lng, lat]

		stops.sort((a, b) => a[0] - b[0]); // Sort by longitude (west to east)
		return stops;
	}

	async function getRoute() {
		let stops = await getStops();
		if (stops.length < 2) {
			console.error("Not enough stops to create a route.");
			return;
		}

		// Format stops for Mapbox API (lng,lat format)
		const waypoints = stops.map((coord) => coord.join(",")).join(";");

		const url = `https://api.mapbox.com/directions/v5/mapbox/cycling/${waypoints}?geometries=polyline&access_token=${API_KEY}`;

		const response = await fetch(url);
		const data = await response.json();

		if (data.routes && data.routes.length > 0) {
			const decodedPath = polyline.decode(data.routes[0].geometry); // Decode Mapbox polyline
			const leafletPath = decodedPath.map((coord) => [coord[0], coord[1]]); // Convert to Leaflet format
			drawRoute(leafletPath);
		} else {
			console.error("No route found", data);
		}
	}

	function drawRoute(routePath) {
		L.polyline(routePath, { color: "#12161a", weight: 2 }).addTo(map);
	}

	function initMap() {
		map = L.map("map").setView([18.5204, 73.8567], 12); // Center on Pune
		L.tileLayer(
			"https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", // Change to something more consistent to the style
			{
				attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
          &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`,
				subdomains: "abcd",
				maxZoom: 18,
			},
		).addTo(map);

		setMarkers(map);
		getRoute();
	}

	onMount(() => {
		initMap();
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
