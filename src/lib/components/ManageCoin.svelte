<script lang="ts">
    import { osmosis } from 'osmojs';
    import { SigningStargateClient } from '@cosmjs/stargate';
    import { coin } from '@cosmjs/amino';
    import { Dec, IntPretty } from '@keplr-wallet/unit';
    import type { OfflineSigner } from '@cosmjs/proto-signing';
	import { createStargateClient } from '$lib/stargate';

      
    export let signer: OfflineSigner;
    export let walletAddress: string;

    const RPC_ENDPOINT = import.meta.env.VITE_RPC_ENDPOINT || "https://osmosis-rpc.publicnode.com:443";
    
    let client: any;
    let balances: any[] = [];

    let burnAmount: string = "";
    let selectedToken: string = "";
    
    async function initClient() {
        const { createRPCQueryClient } = osmosis.ClientFactory;
        client = await createRPCQueryClient({ rpcEndpoint: RPC_ENDPOINT });

        balances = (await client.cosmos.bank.v1beta1
                .allBalances({ address: walletAddress })).balances;
    }

    initClient();

    async function handleBurn() {
        try {
            const signingClient = await createStargateClient(RPC_ENDPOINT, signer);

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
            // Reset form after successful burn
            burnAmount = "";
            selectedToken = "";
        } catch (error) {
            console.error("Error burning tokens:", error);
        }
    }

</script>

<p>TODO add a section for common actions such as burning</p>
<ul>
    <li>Mint</li>
    <li>Send</li>
    <li>Create CL pool</li>
    <li>Add to CL pool</li>
</ul>

<div class="bg-red-50 border-2 border-red-400 rounded-lg p-6 my-4 shadow-md">
    <h3 class="text-red-700 text-xl font-semibold mb-4">Burn Tokens</h3>
    <form on:submit|preventDefault={handleBurn} class="flex flex-col gap-4">
        <select 
            bind:value={selectedToken} 
            required
            class="p-2 border border-red-200 rounded-md text-base focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none"
        >
            <option value="">Select token</option>
            {#if balances}
                {#each balances.filter(b => b.denom.startsWith('factory')) as balance}
                    <option value={balance.denom}>{balance.denom}</option>
                {/each}
            {/if}
        </select>
        
        <input 
            type="number" 
            bind:value={burnAmount} 
            placeholder="Amount to burn" 
            required 
            min="0"
            class="p-2 border border-red-200 rounded-md text-base focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none"
        />
        
        <button 
            type="submit" 
            disabled={!selectedToken || !burnAmount}
            class="bg-red-500 text-white py-3 px-4 rounded-md font-semibold transition-colors duration-200 hover:bg-red-600 disabled:bg-red-200 disabled:cursor-not-allowed"
        >
        🔥Burn Tokens🔥
        </button>
    </form>
</div>
