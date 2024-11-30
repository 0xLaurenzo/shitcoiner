<script lang="ts">
    import type { OfflineSigner } from '@cosmjs/proto-signing';
    import { createStargateClient } from '$lib/stargate';

    export let signer: OfflineSigner;
    export let walletAddress: string;
    export let balances: any[] = [];
    
    let burnAmount: string = "";
    let selectedToken: string = "";
    
    async function handleBurn() {
        try {
            const signingClient = await createStargateClient(import.meta.env.VITE_RPC_ENDPOINT, signer);

            const msg = {
                typeUrl: "/osmosis.tokenfactory.v1beta1.MsgBurn",
                value: {
                    sender: walletAddress,
                    amount: {
                        denom: selectedToken,
                        amount: burnAmount
                    }
                }
            };
            
            const tx = await signingClient.signAndBroadcast(
                walletAddress,
                [msg],
                {
                    amount: [{denom: "uosmo", amount: "5000"}],
                    gas: "200000"
                }
            );
            
            console.log("Burn successful:", tx);
            burnAmount = "";
            selectedToken = "";
        } catch (error) {
            console.error("Error burning tokens:", error);
        }
    }
</script>

<div class="bg-red-50 border-2 border-red-400 rounded-lg p-4 my-2 shadow-sm">
    <h3 class="text-red-700 text-lg font-semibold mb-2">Burn Tokens</h3>
    <form on:submit|preventDefault={handleBurn} class="flex flex-col gap-2">
        <select 
            bind:value={selectedToken} 
            required
            class="w-full p-1.5 border border-red-200 rounded-md text-sm focus:ring-1 focus:ring-red-400 focus:border-red-400 outline-none"
        >
            <option value="">Select token</option>
            {#each balances.filter(b => b.denom.startsWith('factory')) as balance}
                <option value={balance.denom}>{balance.denom}</option>
            {/each}
        </select>
        
        <div class="flex gap-2">
            <input 
                type="number" 
                bind:value={burnAmount} 
                placeholder="Amount" 
                required 
                min="0"
                class="flex-1 p-1.5 border border-red-200 rounded-md text-sm focus:ring-1 focus:ring-red-400 focus:border-red-400 outline-none"
            />
            
            <button 
                type="submit" 
                disabled={!selectedToken || !burnAmount}
                class="bg-red-500 text-white px-3 py-1.5 rounded-md font-medium text-sm transition-colors duration-200 hover:bg-red-600 disabled:bg-red-200 disabled:cursor-not-allowed"
            >
                🔥Burn
            </button>
        </div>
    </form>
</div>