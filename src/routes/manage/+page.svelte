<script lang="ts">
    import { wallet } from '$lib/stores/wallet';
    import CreateCoin from '$lib/components/CreateCoin.svelte';
    import { goto } from '$app/navigation';
	import ManageCoin from '$lib/components/ManageCoin.svelte';

    // Subscribe to the wallet store
    $: if (!$wallet.address) {
        // Redirect to home if not connected
        goto('/');
    }
</script>

<div class="w-[90%] mx-auto px-[5%] flex justify-center">
    {#if $wallet.address && $wallet.signer}
        <ManageCoin signer={$wallet.signer} walletAddress={$wallet.address} />
    {/if}
</div>