<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';


	let { children } = $props();

	// Generate random peppers
	const peppers = Array.from({ length: 20 }, () => ({
		x: Math.random() * 100,
		y: Math.random() * 100,
		rotation: Math.random() * 360,
		emoji: '🌶️'
	}));
</script>

<Navbar/>;
<div class="pepper-background">
	{#each peppers as pepper}
		<span
			class="pepper"
			style="left: {pepper.x}%; top: {pepper.y}%; transform: rotate({pepper.rotation}deg);"
		>
			{pepper.emoji}
		</span>
	{/each}
</div>

<main class="pt-16">
  <slot />
</main>

<style>
	.pepper-background {
		position: fixed;
		inset: 0;
		z-index: -1;
		overflow: hidden;
		pointer-events: none;
	}

	.pepper {
		position: absolute;
		opacity: 0.2;
		font-size: 2rem;
	}
</style>
