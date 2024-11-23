<script lang="ts">
	import { wallet, connectWallet } from '$lib/stores/wallet';
</script>

<nav class="fixed top-0 left-0 right-0 flex justify-between items-center p-4 backdrop-blur-sm border-b border-gray-300">
	<a href="/" class="font-bold text-lg italic px-3 py-1 rounded hover:bg-gray-100">
		Shitcoin artistically
	</a>
	
	<div class="space-x-4">
		<a href="/create" class="text-black hover:text-gray-600">Create</a>
		<a href="/manage" class="text-black hover:text-gray-600">Manage</a>
	</div>
	
	<div>
		{#if $wallet.address}
			<p>Connected Wallet: {$wallet.address}</p>
		{:else}
			<button 
				on:click={connectWallet}
				class="bg-green-600 text-white px-4 py-2 hover:bg-green-700 cursor-pointer"
			>
				Connect Wallet
			</button>
		{/if}
	</div>
</nav>