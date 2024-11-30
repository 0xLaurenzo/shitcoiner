<script lang="ts">
    import { osmosis } from 'osmojs';
    import type { OfflineSigner } from '@cosmjs/proto-signing';
    import { createStargateClient } from '$lib/stargate';

    export let signer: OfflineSigner;
    export let walletAddress: string;
    export let balances: any[];

    let mintAmount: string = "";
    let selectedToken: string = "";
    let mintableTokens: string[] = [];
    let isLoading: boolean = false;

    $: if (balances && walletAddress) {
        fetchMintableTokens();
    }

    $: if (mintableTokens && !mintableTokens.includes(selectedToken)) {
        selectedToken = "";
    }

    async function fetchMintableTokens() {
        isLoading = true;
        try {
            const { createRPCQueryClient } = osmosis.ClientFactory;
            const client = await createRPCQueryClient({ rpcEndpoint: import.meta.env.VITE_RPC_ENDPOINT });

            const adminCheckPromises = balances
                .filter(b => b.denom.startsWith('factory'))
                .map(async (token) => {
                    try {
                        const response = await client.osmosis.tokenfactory.v1beta1.denomAuthorityMetadata({ denom: token.denom });
                        return {
                            denom: token.denom,
                            isAdmin: response.authorityMetadata.admin === walletAddress
                        };
                    } catch (error) {
                        console.error(`Error checking admin for ${token.denom}:`, error);
                        return {
                            denom: token.denom,
                            isAdmin: false
                        };
                    }
                });

            const results = await Promise.all(adminCheckPromises);
            mintableTokens = results
                .filter(result => result.isAdmin)
                .map(result => result.denom);

        } catch (error) {
            console.error("Error fetching mintable tokens:", error);
            mintableTokens = [];
        } finally {
            isLoading = false;
        }
    }

    async function handleMint() {
        try {
            const signingClient = await createStargateClient(import.meta.env.VITE_RPC_ENDPOINT, signer);

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
</script>

<div class="bg-green-50 border-2 border-green-400 rounded-lg p-4 my-2 shadow-sm">
    <h3 class="text-green-700 text-lg font-semibold mb-2">Mint Tokens</h3>
    
    {#if isLoading}
        <p class="text-sm text-gray-600">Loading mintable tokens...</p>
    {:else if mintableTokens.length === 0}
        <p class="text-sm text-gray-600">No tokens available for minting. You need to be the admin of a token to mint it.</p>
    {:else}
        <form on:submit|preventDefault={handleMint} class="flex flex-col gap-2">
            <select 
                bind:value={selectedToken} 
                required
                class="w-full p-1.5 border border-green-200 rounded-md text-sm focus:ring-1 focus:ring-green-400 focus:border-green-400 outline-none"
            >
                <option value="">Select token</option>
                {#each mintableTokens as tokenDenom}
                    <option value={tokenDenom}>{tokenDenom}</option>
                {/each}
            </select>
            
            <div class="flex gap-2">
                <input 
                    type="number" 
                    bind:value={mintAmount} 
                    placeholder="Amount" 
                    required 
                    min="0"
                    class="flex-1 p-1.5 border border-green-200 rounded-md text-sm focus:ring-1 focus:ring-green-400 focus:border-green-400 outline-none"
                />
                
                <button 
                    type="submit" 
                    disabled={!selectedToken || !mintAmount}
                    class="bg-green-500 text-white px-3 rounded-md font-medium text-sm transition-colors duration-200 hover:bg-green-600 disabled:bg-green-200 disabled:cursor-not-allowed"
                >
                    💰Mint
                </button>
            </div>
        </form>
    {/if}
</div>