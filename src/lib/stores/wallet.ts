import { writable } from 'svelte/store';
import type { OfflineSigner } from '@cosmjs/proto-signing';
import { connectKeplr } from '$lib/keplr';
import { browser } from '$app/environment';

interface WalletStore {
    address: string;
    signer: OfflineSigner | null;
}

export const wallet = writable<WalletStore>({
    address: '',
    signer: null
});

// Function to handle wallet changes
async function handleWalletChange() {
    const walletResult = await connectKeplr();
    
    if (walletResult.isOk()) {
        wallet.set({
            address: walletResult.value.address,
            signer: walletResult.value.signer
        });
    } else {
        // Reset wallet state when disconnected
        wallet.set({
            address: '',
            signer: null
        });
    }
}

// Initialize wallet change listener
if (browser) {
    // Listen for Keplr account changes
    window.addEventListener("keplr_keystorechange", () => {
        handleWalletChange();
    });
}

export async function connectWallet() {
    await handleWalletChange();
}