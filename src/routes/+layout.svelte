<script>
	import Navbar from "$lib/navbar.svelte";
</script>

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
<Navbar />
<slot />

<style>
	:global(body) {
		background-color: #12161a;
		color: paleturquoise;
		font-family: "IBM Plex Sans", monospace;
		display: flex;
		margin: 0px; /* adds a fucking margin to the whole page(container) if not specified */
		flex-direction: column;
		justify-content: center;
	}
</style>
