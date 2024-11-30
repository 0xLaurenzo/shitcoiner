<script lang="ts">
    import { wallet } from '$lib/stores/wallet';
    import CreateCoin from '$lib/components/CreateCoin.svelte';
    import WalletGuard from '$lib/components/WalletGuard.svelte';
</script>

<WalletGuard>
    {#if $wallet.signer}
    <CreateCoin signer={$wallet.signer} walletAddress={$wallet.address} />
{/if}
</WalletGuard>