import { writable } from 'svelte/store';
import type { OfflineSigner } from '@cosmjs/proto-signing';
import { connectKeplr } from '$lib/keplr';

interface WalletStore {
    address: string;
    signer: OfflineSigner | null;
}

export const wallet = writable<WalletStore>({
    address: '',
    signer: null
});


// TODO this should prob no be part of a store file
export async function connectWallet() {
    const walletResult = await connectKeplr();

    if (walletResult.isOk()) {
        wallet.set({
            address: walletResult.value.address,
            signer: walletResult.value.signer
        });
    }
}