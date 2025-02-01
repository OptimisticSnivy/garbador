<script>
	let map;

	function createMap(container) {
		let m = L.map(container).setView([18.5252, 73.8851], 13);
		L.tileLayer(
			"https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",																			// Change to something more consistent to the style
			{
				attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
          &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`,
				subdomains: "abcd",
				maxZoom: 18,
			},
		).addTo(m);

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
	#maptile{
		margin: auto;
		height: 1000px;
		width: 100%;
		margin-top: 50px;
	}
</style>
