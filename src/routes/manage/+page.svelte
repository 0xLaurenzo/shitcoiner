<script lang="ts">
    import { wallet } from '$lib/stores/wallet';
    import ManageCoin from '$lib/components/ManageCoin.svelte';
    import WalletGuard from '$lib/components/WalletGuard.svelte';
</script>

<WalletGuard>
    <div class="w-[90%] mx-auto px-[5%] flex justify-center">
        {#if $wallet.signer}
            <ManageCoin signer={$wallet.signer} walletAddress={$wallet.address} />
        {/if}    
    </div>
</WalletGuard>