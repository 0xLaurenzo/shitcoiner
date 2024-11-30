<script lang="ts">
    import { wallet } from '$lib/stores/wallet';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let mounted = false;

    onMount(() => {
        mounted = true;
    });

    // Only redirect after component is mounted (client-side)
    $: if (mounted && !$wallet.address) {
        goto('/', { replaceState: true });
    }
</script>

{#if mounted && $wallet.address}
    <slot />
{:else if mounted}
    <div class="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 class="text-xl font-semibold">Wallet Connection Required</h2>
        <p class="text-gray-600">Please connect your wallet to access this page</p>
    </div>
{/if} 