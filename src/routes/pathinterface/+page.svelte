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
			.filter((record) => record.fillperc > 75) // Only high-priority stops
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
		// L.polyline(routePath, { color: "#12161a", weight: 2 }).addTo(map);
		L.polyline(routePath, { color: "paleturquoise", weight: 1 }).addTo(map);
	}

	function initMap() {
		map = L.map("map").setView([18.5204, 73.8567], 13);
		L.tileLayer(
			`https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/{z}/{x}/{y}?access_token=${API_KEY}`,
			{
				tileSize: 512,
				zoomOffset: -1,
				attribution:
					'&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>',
			},
		).addTo(map);

		setMarkers(map);
		getRoute();
	}

	onMount(() => {
		initMap();
	});
</script>

<div id="map"></div>
<div class="toolbar">
	<button
		on:click={() => {
			map.setView([18.5204, 73.8567], 13);
		}}
		title="Reset-View"
	>
		<svg
			data-slot="icon"
			aria-hidden="true"
			fill="none"
			stroke-width="1.5"
			stroke="currentColor"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
				stroke-linecap="round"
				stroke-linejoin="round"
			></path>
		</svg>
	</button>

	<button
		on:click={() => {
			getRoute();
			setMarkers(map);
		}}
		title="Refresh"
	>
		<svg
			data-slot="icon"
			aria-hidden="true"
			fill="none"
			stroke-width="1.5"
			stroke="currentColor"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
				stroke-linecap="round"
				stroke-linejoin="round"
			></path>
		</svg>
	</button>
</div>

<style>
	#map {
		height: 782px;
		width: 100%;
		margin-top: 30px;
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

	.toolbar {
		position: absolute;
		top: 110px; /* Adjust position as needed */
		right: 20px; /* Adjust position as needed */
		background-color: rgba(255, 255, 255, 0); /* Transparent background */
		padding: 10px;
		/* border-radius: 8px; */
		box-shadow: 0 0px 0px rgba(0, 0, 0, 0.2); /* Slight shadow for better visibility */
		z-index: 1000; /* Make sure it's on top */
	}

	button {
		background-color: #12161a;
		color: paleturquoise;
		border: none;
		margin: 1px;
		width: 50%;
		padding: 10px 10px;
		cursor: pointer;
	}
</style>
