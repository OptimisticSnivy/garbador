<script context="module">
	import img from "$lib/assets/greenTrashMarker.svg";
	import img1 from "$lib/assets/location-dot-solid.svg";
	import imgred from "$lib/assets/redTrashMarker.svg";
	import PocketBase from "pocketbase";

	let map;
	let coords = [];
	let initialView = [18.5252, 73.8851];
	let API_KEY = import.meta.env.VITE_MAPBOX_KEY;
	const pb = new PocketBase("http://127.0.0.1:8090");

	async function getCoords() {
		const records = await pb.collection("sensors").getFullList({});

		for (let i = 0; i < records.length; i++) {
			coords[i] = [records[i].lat, records[i].long];
		}
		return coords;
	}

	let batnfill = [];
	async function getBatnfill() {
		const records = await pb.collection("sensors").getFullList({});

		for (let i = 0; i < records.length; i++) {
			batnfill[i] = [records[i].battperc, records[i].fillperc];
		}
		return batnfill;
	}

	export async function setMarkers(m) {
		let trashIcon = L.icon({
			iconUrl: img,
			iconSize: [38, 95], // size of the icon
			iconAnchor: [21, 60], // point of the icon which will correspond to marker's location
			popupAnchor: [-3, -46], // point from which the popup should open relative to the iconAnchor
		});

		let trashIconRed = L.icon({
			iconUrl: imgred,
			iconSize: [38, 95], // size of the icon
			iconAnchor: [21, 60], // point of the icon which will correspond to marker's location
			popupAnchor: [-3, -46], // point from which the popup should open relative to the iconAnchor
		});

		let customOptions = {
			maxWidth: 400,
			width: 200,
			className: "customPopup",
		};

		let markers = await getCoords();
		let batnfill = await getBatnfill();
		for (let i = 0; i < markers.length; i++) {
			if (batnfill[i][1] < 75) {
				L.marker(markers[i], { icon: trashIcon })
					.addTo(m)
					.bindPopup(
						`<p>Name: BN#${i} <br />Battery: ${batnfill[i][0]}%<br/> Filled: ${batnfill[i][1]}%<br/> Coordinates: ${markers[i]}<br/></p>`,
						customOptions,
					);
			} else {
				L.marker(markers[i], { icon: trashIconRed })
					.addTo(m)
					.bindPopup(
						`<p>Name: BN#${i} <br />Battery: ${batnfill[i][0]}%<br/> Filled: ${batnfill[i][1]}%<br/> Coordinates: ${markers[i]}<br/></p>`,
						customOptions,
					);
			}
		}
	}

	function createMap(container) {
		let m = L.map(container).setView(initialView, 13);
		L.tileLayer(
			`https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/{z}/{x}/{y}?access_token=${API_KEY}`,
			{
				tileSize: 512,
				zoomOffset: -1,
				attribution:
					'&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>',
			},
		).addTo(m);

		setMarkers(m);
		return m;
	}

	function mapAction(container) {
		map = createMap(container);
		return {
			destroy: () => {
				map.remove();
			},
		};
	}
</script>

<div id="maptile" use:mapAction />
<div class="toolbar">
	<button
		on:click={() => {
			map.setView(initialView, 13, { animate: true });
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
	#maptile {
		height: 782px;
		width: 100%;
		margin-top: 30px;
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

	/* global allows access for selectors from leaflet.css, for svelte to grab */
	:global(.customPopup .leaflet-popup-content-wrapper) {
		background-color: #12161a;
		color: paleturquoise;
		font-family: "IBM Plex Sans", monospace;
		border-radius: 5px;
	}

	:global(.customPopup .leaflet-popup-tip) {
		background-color: #12161a;
	}
</style>
