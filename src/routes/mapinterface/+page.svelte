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
		let marker = L.marker([18.5252, 73.8851], { icon: trashIcon }).addTo(m).bindPopup("I am a marker"); // do this nicer please, ik it's stupid, it's just to show multiple icons show up!
		let marker1 = L.marker([18.4252, 73.8851], { icon: trashIcon }).addTo(m);
		let marker2 = L.marker([18.5252, 73.9851], { icon: trashIcon }).addTo(m);
		let marker3 = L.marker([18.3252, 73.6851], { icon: trashIcon }).addTo(m);
		let marker4 = L.marker([18.3352, 73.8851], { icon: trashIcon }).addTo(m);
	}

	function createMap(container) {
		let m = L.map(container).setView([18.5252, 73.8851], 11);
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
