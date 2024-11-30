<script lang="ts">
    import { osmosis } from 'osmojs';
    import type { OfflineSigner } from '@cosmjs/proto-signing';
	import { createStargateClient } from '$lib/stargate';
    import BurnToken from '$lib/components/BurnToken.svelte';
    import MintToken from '$lib/components/MintToken.svelte'

      
    export let signer: OfflineSigner;
    export let walletAddress: string;

    const RPC_ENDPOINT = import.meta.env.VITE_RPC_ENDPOINT || "https://osmosis-rpc.publicnode.com:443";
    
    let client: any;
    let balances: any[] = [];

    let burnAmount: string = "";
    let selectedToken: string = "";
    let mintAmount: string = "";
    let sendAmount: string = "";
    let recipientAddress: string = "";
    
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

    async function handleMint() {
        try {
            const signingClient = await createStargateClient(RPC_ENDPOINT, signer);

            const msg = {
                typeUrl: "/osmosis.tokenfactory.v1beta1.MsgMint",
                value: {
                    sender: walletAddress,
                    amount: {
                        denom: selectedToken,
                        amount: mintAmount
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
            
            console.log("Mint successful:", tx);
            mintAmount = "";
            selectedToken = "";
        } catch (error) {
            console.error("Error minting tokens:", error);
        }
    }

    async function handleSend() {
        try {
            const signingClient = await createStargateClient(RPC_ENDPOINT, signer);

            const msg = {
                typeUrl: "/cosmos.bank.v1beta1.MsgSend",
                value: {
                    fromAddress: walletAddress,
                    toAddress: recipientAddress,
                    amount: [{
                        denom: selectedToken,
                        amount: sendAmount
                    }]
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
            
            console.log("Send successful:", tx);
            sendAmount = "";
            selectedToken = "";
            recipientAddress = "";
        } catch (error) {
            console.error("Error sending tokens:", error);
        }
    }

</script>

<div class="container mx-auto max-w-2xl px-4">
    <p class="mb-4">To manage a coin, this page provides simple actions needed to do so such as burning tokens, 
        potentially minting new tokens if the admin is not burned. Eventually it will also contain helpers for setting
    up the necessary pools on Osmosis.</p>
    <ul class="mb-4">
        <li>Create CL pool</li>
        <li>Add to CL pool</li>
    </ul>

    <div class="mb-4">
        <BurnToken
            {signer}
            {walletAddress}
            {balances}
        />
    </div>

    <div class="mb-4">
        <MintToken
            {signer}
            {walletAddress}
            {balances}
        />
    </div>

    <div class="bg-blue-50 border-2 border-blue-400 rounded-lg p-4 my-2 shadow-sm">
        <h3 class="text-blue-700 text-lg font-semibold mb-2">Send Tokens</h3>
        <form on:submit|preventDefault={handleSend} class="flex flex-col gap-2">
            <select 
                bind:value={selectedToken} 
                required
                class="w-full p-1.5 border border-blue-200 rounded-md text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none"
            >
                <option value="">Select token</option>
                {#if balances}
                    {#each balances.filter(b => b.denom.startsWith('factory')) as balance}
                        <option value={balance.denom}>{balance.denom}</option>
                    {/each}
                {/if}
            </select>
            
            <input 
                type="text" 
                bind:value={recipientAddress} 
                placeholder="Recipient Address" 
                required 
                class="w-full p-1.5 border border-blue-200 rounded-md text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none"
            />
            
            <input 
                type="number" 
                bind:value={sendAmount} 
                placeholder="Amount" 
                required 
                min="0"
                class="w-full p-1.5 border border-blue-200 rounded-md text-sm focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none"
            />
            
            <button 
                type="submit" 
                disabled={!selectedToken || !sendAmount || !recipientAddress}
                class="bg-blue-500 text-white px-3 py-2 rounded-md font-medium text-sm transition-colors duration-200 hover:bg-blue-600 disabled:bg-blue-200 disabled:cursor-not-allowed"
            >
                📤Send
            </button>
        </form>
    </div>
</div>
