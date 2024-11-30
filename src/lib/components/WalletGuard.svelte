<script lang="ts">
    import { wallet } from '$lib/stores/wallet';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { connectWallet } from '$lib/stores/wallet';

    let mounted = false;
    let connecting = false;
    let intendedPath: string;

    onMount(() => {
        mounted = true;
        // Store the current path when component mounts
        intendedPath = $page.url.pathname;
    });

    async function handleConnect() {
        connecting = true;
        await connectWallet();
        connecting = false;
    }

    // Watch wallet connection status
    $: if (mounted && $wallet.address && intendedPath && intendedPath !== '/') {
        // Small delay to ensure store is updated
        setTimeout(() => {
            goto(intendedPath, { replaceState: true });
        }, 100);
    }
</script>

{#if mounted && $wallet.address}
    <slot />
{:else if mounted}
    <div class="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 class="text-xl font-semibold">Wallet Connection Required</h2>
        <p class="text-gray-600">Please connect your wallet to access this page</p>
        <button 
            on:click={handleConnect}
            disabled={connecting}
            class="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
            {connecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
    </div>
{/if} 