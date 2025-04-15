<script>
	import { onMount, onDestroy } from "svelte";
	import PocketBase from "pocketbase";
	import pkg from "mapbox-gl";
	const { Map } = pkg;
	import "mapbox-gl/dist/mapbox-gl.css";

	let map;
	let mapContainer;
	let lng, lat, zoom;
	const pb = new PocketBase("http://127.0.0.1:8090");
	let API_KEY = import.meta.env.VITE_MAPBOX_KEY;

	lat = 18.525;
	lng = 73.885;
	zoom = 12;

	let start = [73.8553, 18.5196]; // getRoute accepts reversed coords, ie, [long,lat] & not the default [lat,long]
	let initialState = { lng, lat, zoom };
	let stops = []

	async function getStops() {
		const records = await pb.collection("sensors").getFullList({});
		stops = records
			.filter((record) => record.fillperc > 75) // Only high-priority stops
			.map((record) => [record.long, record.lat]); // Map to [lng, lat]

		stops.sort((a, b) => a[0] - b[0]); // Sort by longitude (west to east)
		return stops;
	}

	async function getRoute(end) {
		let stops = await getStops();
		console.log(stops)
		const query = await fetch(
			`https://api.mapbox.com/directions/v5/mapbox/driving/${stops[0][0]},${stops[0][1]};${stops[1][0]},${stops[1][1]}?steps=true&geometries=geojson&access_token=${API_KEY}`,
		);
		const json = await query.json();
		const data = json.routes[0];
		const route = data.geometry;
		const geojson = {
			type: "Feature",
			properties: {},
			geometry: data.geometry,
		};

		if (map.getSource("route")) {
			// if the route already exists on the map, reset it using setData
			map.getSource("route").setData(geojson);
		}

		// otherwise, add a new layer using this data
		else {
			map.addLayer({
				id: "route",
				type: "line",
				source: {
					type: "geojson",
					data: geojson,
				},
				layout: {
					"line-join": "round",
					"line-cap": "round",
				},
				paint: {
					"line-color": "#3887be",
					"line-width": 5,
					"line-opacity": 0.75,
				},
			});
		}
	}

	onMount(() => {
		map = new Map({
			container: mapContainer,
			accessToken: API_KEY,
			style: "mapbox://styles/mapbox/dark-v11",
			center: [initialState.lng, initialState.lat],
			zoom: initialState.zoom,
		});
		map.on("load", () => {
			const defaultEnd = [73.8419, 18.5165];
			map.addLayer({
				id: "origin-circle",
				type: "circle",
				source: {
					type: "geojson",
					data: {
						type: "FeatureCollection",
						features: [
							{
								type: "Feature",
								properties: {},
								geometry: {
									type: "Point",
									coordinates: start,
								},
							},
						],
					},
				},
				paint: {
					"circle-radius": 10,
					"circle-color": "#4ce05b",
				},
			});

			// add destination circle to the map
			map.addLayer({
				id: "destination-circle",
				type: "circle",
				source: {
					type: "geojson",
					data: {
						type: "FeatureCollection",
						features: [
							{
								type: "Feature",
								properties: {},
								geometry: {
									type: "Point",
									coordinates: defaultEnd,
								},
							},
						],
					},
				},
				paint: {
					"circle-radius": 10,
					"circle-color": "#f30",
				},
			});
			getRoute(defaultEnd);
		});
	});
</script>

<div class="map" bind:this={mapContainer} />
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

	<button on:click={() => {}} title="Refresh">
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
	.map {
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
		top: 110px;
		right: 20px;
		background-color: rgba(255, 255, 255, 0);
		padding: 10px;
		/* border-radius: 8px; */
		box-shadow: 0 0px 0px rgba(0, 0, 0, 0.2);
		z-index: 1000;
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
