<script>
	import Icon from "@iconify/svelte";
</script>

<div id="nav">
	<div id="brand">wasteWise.</div>
	<nav id="routes">
		<a href="/"
			><Icon icon="material-symbols-light:home" width="28" height="28" /></a
		>
		<a href="/mapinterface">
			<Icon
				icon="material-symbols:location-on-rounded"
				width="24"
				height="24"
			/>
		</a>
		<a href="/routinginterface"
			><Icon
				icon="material-symbols:map-search-outline"
				width="28"
				height="28"
			/></a
		>
		<a href="/about"><Icon icon="mdi:about" width="28" height="28" /></a>
	</nav>
</div>

<style>
	#nav {
		display: flex;
		flex-wrap: wrap;
		margin: auto;
		margin-top: 30px;
		min-width: 80%;
		font-size: 20px;
	}

	#brand {
		font-size: 27px;
		flex-grow: 1;
	}

	a {
		color: paleturquoise;
		text-decoration: none;
	}
</style>
