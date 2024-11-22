<script lang="ts">
    import { osmosis } from 'osmojs';
    import { SigningStargateClient } from '@cosmjs/stargate';
    import { coin } from '@cosmjs/amino';
    import { Dec, IntPretty } from '@keplr-wallet/unit';
    import type { OfflineSigner } from '@cosmjs/proto-signing';

      
    export let signer: OfflineSigner;
    export let walletAddress: string;

    const RPC_ENDPOINT = import.meta.env.VITE_RPC_ENDPOINT || "https://osmosis-rpc.publicnode.com:443";
    
    let client: any;
    let tokens: any;
    let balances: any[] = [];

    let burnAmount: string = "";
    let selectedToken: string = "";
    
    async function initClient() {
        const { createRPCQueryClient } = osmosis.ClientFactory;
        client = await createRPCQueryClient({ rpcEndpoint: RPC_ENDPOINT });

        balances = (await client.cosmos.bank.v1beta1
                .allBalances({ address: walletAddress })).balances;
        
        console.log(balances)
        
        // // now you can query the cosmos modules
        // tokens = await client.osmosis.tokenfactory.v1beta1.denomsFromCreator({ creator: walletAddress });
        // console.log(tokens);
    }

    initClient();

    async function handleBurn() {
        try {
            const signingClient = await SigningStargateClient.connectWithSigner(
                RPC_ENDPOINT,
                signer
            );
            
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

<div class="burn-section">
    <h3>Burn Tokens</h3>
    <form on:submit|preventDefault={handleBurn}>
        <select bind:value={selectedToken} required>
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
        />
        
        <button type="submit" disabled={!selectedToken || !burnAmount}>
            Burn Tokens
        </button>
    </form>
</div>
