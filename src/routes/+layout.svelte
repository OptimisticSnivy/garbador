<script>
	import Navbar from "$lib/navbar.svelte";
</script>

<Navbar />
<slot />

<style>
	:global(body) {
		background-color: #12161a;
		color: paleturquoise;
		font-family: "IBM Plex Sans", monospace;
		display: flex;
		margin: 0px;							/* adds a fucking margin to the whole page(container) if not specified */
		flex-direction: column;
		justify-content: center;
	}
</style>
