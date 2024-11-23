<script lang="ts">
    import { wallet } from '$lib/stores/wallet';
    import CreateCoin from '$lib/components/CreateCoin.svelte';
    import { goto } from '$app/navigation';

    // Subscribe to the wallet store
    $: if (!$wallet.address) {
        // Redirect to home if not connected
        goto('/');
    }
</script>

{#if $wallet.address && $wallet.signer}
    <CreateCoin signer={$wallet.signer} walletAddress={$wallet.address} />
{/if}