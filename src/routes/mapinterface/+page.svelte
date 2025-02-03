<script>
	import img from "$lib/assets/trashmarker.svg";
	let map;

	function setMarkers(m) {
		let trashIcon = L.icon({
			iconUrl: img,
			iconSize: [38, 95], // size of the icon
			iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
			popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
		});

		let markers = [
			[18.4854, 73.8028],
			[18.5452, 73.9081],
			[18.5689, 73.9268],
			[18.509, 73.8237],
			[18.4422, 73.8596],
			[18.5301, 73.8703],
			[18.4815, 73.9085],
			[18.5198, 73.8471],
			[18.5463, 73.7826],
			[18.6562, 73.8227],
			[18.7221, 73.8063],
		];
		let var1 = 92; // standin variables
		let var2 = 12;
		for (let i = 0; i < markers.length; i++) {
			L.marker(markers[i], { icon: trashIcon })
				.addTo(m)
				.bindPopup(
					`<p>Name: BN#${i} <br />Battery: ${var1}<br/> Filled: ${var2}%<br/></p>`,
				);
		}
	}

	function createMap(container) {
		let m = L.map(container).setView([18.5252, 73.8851], 13);
		L.tileLayer(
			"https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", // Change to something more consistent to the style
			{
				attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
          &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`,
				subdomains: "abcd",
				maxZoom: 18,
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

<div></div>
<div id="maptile" use:mapAction />


<svelte:head>
	<link
		rel="stylesheet"
		href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
		integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
		crossorigin=""
	/>
	<!-- Make sure you put this AFTER Leaflet's CSS -->
	<script
		src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
		integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
		crossorigin=""
	></script>
</svelte:head>

<style>
	#maptile {
		height: 782px;
		width: 100%;
		margin-top: 30px;
	}
</style>
