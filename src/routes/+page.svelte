<script lang="ts">
	import { connectKeplr } from '$lib/keplr';
	import { SigningStargateClient } from '@cosmjs/stargate';
	import CreateCoin from '$lib/components/CreateCoin.svelte';
    import type { OfflineSigner } from '@cosmjs/proto-signing';
	import ManageCoin from '$lib/components/ManageCoin.svelte';
    import { wallet, connectWallet } from '$lib/stores/wallet';
    import { goto } from '$app/navigation';
  
	let activeTab = 'create';
  

  </script>
  
  <main>
	<h1 class="text-xl italic">Osmosis shitcoiner terminal</h1>
  
	{#if $wallet.address}
	  <p>
		All transactions are served from the Connected wallet.
		This means that newly created tokens will also be created under 
		the namespace of this token.
        This version of the shitcoiner works directly on Osmosis. On launch mechanisms,
        the creator needs to decide himself
	</p>
	  <p>Connected Wallet: {$wallet.address}</p>
  
	  <div class="tabs flex gap-2 justify-center my-4">
		<button 
		  class:active={activeTab === 'create'} 
		  class="px-4 py-2 rounded-lg font-medium transition-all duration-200 
			{activeTab === 'create' 
			  ? 'bg-green-600 text-white shadow-inner transform translate-y-0.5' 
			  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}"
		  on:click={() => goto("/create")}>
		  Create
		</button>
		<button 
		  class:active={activeTab === 'manage'} 
		  class="px-4 py-2 rounded-lg font-medium transition-all duration-200 
			{activeTab === 'manage' 
			  ? 'bg-green-600 text-white shadow-inner transform translate-y-0.5' 
			  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}"
		  on:click={() => goto("/manage")}>
		  Manage
		</button>
		<button 
		  class:active={activeTab === 'distribute'} 
		  class="px-4 py-2 rounded-lg font-medium transition-all duration-200 
			{activeTab === 'distribute' 
			  ? 'bg-green-600 text-white shadow-inner transform translate-y-0.5' 
			  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}"
		  on:click={() => goto("/distribute")}>
		  Distribute
		</button>
        <button 
		  class:active={activeTab === 'register'} 
		  class="px-4 py-2 rounded-lg font-medium transition-all duration-200 
			{activeTab === 'register' 
			  ? 'bg-green-600 text-white shadow-inner transform translate-y-0.5' 
			  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}"
		  on:click={() => goto("register")}>
		  Register
		</button>
	  </div>
	  <!-- {#if activeTab === 'create'}
		<CreateCoin {wallet.signer} {wallet.address} />
	  {:else if activeTab === 'manage'}
		<ManageCoin {wallet.signer} {wallet.address} />
	  {:else if activeTab === 'distribute'}
		<p>TODO add a section for common actions such as airdropping</p>
      {:else if activeTab === 'register'}
      <p>TODO add a section on how to properly register the token for different wallets and ecosystems</p>
	  {/if} -->
	{:else}
	  <button 
		class="mt-4 px-6 py-2 border-2 border-green-600 rounded-lg text-green-600 hover:bg-green-600 hover:text-white transition-colors duration-200"
		on:click={connectWallet}>
		Connect Keplr Wallet
	  </button>
	{/if}
  </main>
  
  <style>
	main {
	  text-align: center;
	  padding: 2rem;
	}
  </style>
  