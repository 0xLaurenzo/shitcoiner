  <script lang="ts">
    import { osmosis, cosmos } from 'osmojs';
    import { SigningStargateClient, type DeliverTxResponse } from '@cosmjs/stargate';
    import { coin } from '@cosmjs/amino';
    import { Dec, IntPretty } from '@keplr-wallet/unit';
    import type { OfflineSigner } from '@cosmjs/proto-signing';
    import { Result, ok, err } from 'neverthrow';

    import { registry } from "$lib/registry";

    export let signer: OfflineSigner;
    export let walletAddress: string;

    // Define form fields for creating a denom, minting, and removing admin
    let denomData = {
      denom: '',
      amount: 0,
      mintToAddress: walletAddress,
      removeAdmin: true,
      decimals: 6,
    };

    let txStatus = '';
    let isLoading = false;

    // Add env variables at the top of the script
    const REVENUE_ADDRESS = import.meta.env.VITE_REVENUE_ADDRESS;
    const REVENUE_PERCENTAGE = Number(import.meta.env.VITE_REVENUE_PERCENTAGE) || 0;

    function getMsges() {
      const {
        createDenom,
        mint,
        changeAdmin
      } = osmosis.tokenfactory.v1beta1.MessageComposer.withTypeUrl
      
      const { send } = cosmos.bank.v1beta1.MessageComposer.withTypeUrl;

      const create = createDenom({
        subdenom: denomData.denom,
        sender: walletAddress
      })

      const mintAmount = denomData.amount * Math.pow(10, denomData.decimals);
      const revenueAmount = Math.floor(mintAmount * (REVENUE_PERCENTAGE / 100));
      
      const mintmsg = mint({
        sender: walletAddress,
        amount: coin(mintAmount.toString(), `factory/${walletAddress}/${denomData.denom}`),
        mintToAddress: denomData.mintToAddress || walletAddress,
      })

      const sendMsg = send({
        fromAddress: denomData.mintToAddress || walletAddress,
        toAddress: REVENUE_ADDRESS,
        amount: [coin(revenueAmount.toString(), `factory/${walletAddress}/${denomData.denom}`)]
      })

      const removeAdmin = changeAdmin({
        sender: walletAddress,
        denom: `factory/${walletAddress}/${denomData.denom}`,
        newAdmin : 'osmo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqmcn030'
      })

      if (denomData.removeAdmin) {
        return REVENUE_PERCENTAGE > 0 
          ? [create, mintmsg, sendMsg, removeAdmin]
          : [create, mintmsg, removeAdmin];
      } else {
        return REVENUE_PERCENTAGE > 0
          ? [create, mintmsg, sendMsg]
          : [create, mintmsg];
      }
    }

    // Submit Transaction: Create Denom -> Mint Tokens -> Remove Admin
    async function submitTransaction(): Promise<Result<string, Error>> {
      try {
        isLoading = true;
        txStatus = 'Submitting transaction...';
        
        const msgs = getMsges();
        
        // Create SigningStargateClient from signer
        const stargateClient = await SigningStargateClient.connectWithSigner(
          "https://osmosis-rpc.publicnode.com:443", // Osmosis RPC endpoint
          signer,
          { registry }
        );

        const gasEstimated = await stargateClient.simulate(walletAddress, msgs, "");
        const fee = {
          amount: [coin(0, 'uosmo')],
          gas: new IntPretty(new Dec(gasEstimated).mul(new Dec(1.3)))
            .maxDecimals(0)
            .locale(false)
            .toString()
        };

        const response = await stargateClient.signAndBroadcast(walletAddress, msgs, fee);
        
        if (response.code === 0) {
          return ok(`Transaction successful! Hash: ${response.transactionHash}`);
        } else {
          return err(new Error(`Transaction failed: ${response.rawLog}`));
        }
      } catch (error) {
        return err(error instanceof Error ? error : new Error('Unknown error occurred'));
      } finally {
        isLoading = false;
      }
    }

    async function handleSubmit() {
      const result = await submitTransaction();
      
      result.match(
        (successMessage) => {
          txStatus = successMessage;
        },
        (error) => {
          txStatus = `Error: ${error.message}`;
        }
      );
    }
  </script>

  <div class="max-w-md mx-auto p-4">
    <h2 class="text-xl font-bold mb-4">Create, Mint, and Remove Admin for a Denom</h2>

    <div class="space-y-3">
      <input
        type="text"
        placeholder="Denom Name (subdenom)"
        bind:value={denomData.denom}
        class="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <input
        type="number"
        placeholder="Mint Amount"
        bind:value={denomData.amount}
        class="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <input
        type="text"
        placeholder="Mint To Address (optional)"
        bind:value={denomData.mintToAddress}
        class="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <input
        type="number"
        placeholder="Decimals (default: 6)"
        bind:value={denomData.decimals}
        min="0"
        max="18"
        class="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      <label class="flex items-center space-x-2 mb-4">
        <input type="checkbox" bind:checked={denomData.removeAdmin} />
        <span>Remove Admin After Minting</span>
      </label>

      <button 
        on:click={handleSubmit} 
        class="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 border-2 border-blue-600 shadow-md transition-all"
        disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Submit Transaction'}
      </button>

      {#if txStatus}
        <div class={`mt-4 p-4 rounded-md ${txStatus.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {txStatus}
        </div>
      {/if}
    </div>
  </div>
