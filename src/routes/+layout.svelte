<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';

	let { children } = $props();

	// Generate random peppers and mountains for the background
	const emojis = Array.from({ length: 40 }, () => ({
		x: Math.random() * 100,
		y: Math.random() * 100,
		rotation: Math.random() * 360,
		emoji: Math.random() > 0.5 ? '🌶️' : '🏔️'
	}));
</script>

<Navbar/>;
<div class="emoji-background">
	{#each emojis as emoji}
		<span
			class="pepper"
			style="left: {emoji.x}%; top: {emoji.y}%; transform: rotate({emoji.rotation}deg);"
		>
			{emoji.emoji}
		</span>
	{/each}
</div>

<main class="pt-16">
  {@render children()}
</main>

<style>
	.emoji-background {
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
