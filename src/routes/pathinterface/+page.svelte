<script>
	import { onMount } from "svelte";
	import PocketBase from "pocketbase";

	let map;
	let stops = [];
	const pb = new PocketBase("http://127.0.0.1:8090");
	let API_KEY = import.meta.env.VITE_KEY;

	async function getStops() {
		const records = await pb.collection("sensors").getFullList({});

		for (let i = 0; i < records.length; i++) {
			if (records[i].fillperc > 80) {
				stops.push([records[i].lat, records[i].long]); // Use push()
				console.log(stops);
			}
		}
		stops.sort((a, b) => a.long - b.long);
		return stops;
	}

	async function getRoute() {
		const apiKey = API_KEY;
		const url = `https://routes.googleapis.com/directions/v2:computeRoutes`;

		let stops = await getStops();

		if (stops.length < 2) {
			console.error("Not enough stops to create a route.");
			return;
		}

		const origin = {
			location: {
				latLng: { latitude: stops[0][0], longitude: stops[0][1] },
			},
		};
		const destination = {
			location: {
				latLng: {
					latitude: stops[stops.length - 1][0],
					longitude: stops[stops.length - 1][1],
				},
			},
		};

		const intermediates = stops.slice(1, stops.length - 1).map((stop) => {
			return {
				location: { latLng: { latitude: stop[0], longitude: stop[1] } },
			};
		});

		const requestBody = {
			origin,
			destination,
			intermediates, // Use dynamically generated intermediates
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

	function initMap() {
		map = new google.maps.Map(document.getElementById("map"), {
			zoom: 12,
			center: { lat: 18.5204, lng: 73.8567 }, // Pune coordinates
		});

		getRoute();
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
