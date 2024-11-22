import type { OfflineSigner } from '@cosmjs/proto-signing';

import type { Window as KeplrWindow } from "@keplr-wallet/types";
import { err, ok, Result } from 'neverthrow';

declare global {
  /* eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type */
  interface Window extends KeplrWindow {}
}

export async function connectKeplr(): Promise<Result<{address: string, signer: OfflineSigner}, string>>{
    if (!window.keplr) {
        alert('Please install Keplr extension');
        return err("Keplr was not installed");
    }
    await window.keplr?.enable("osmosis-1");
    const offlineSigner = window.keplr?.getOfflineSigner("osmosis-1") as OfflineSigner;
    if (!offlineSigner) {
        return err("Failed to get offline signer");
    }
    const accounts = await offlineSigner.getAccounts();

    return ok({
        address: accounts[0].address,
        signer: offlineSigner
    });
}

// export async function signAndBroadcast(signer: OfflineSigner, tx) {
//     const client = await SigningStargateClient.connectWithSigner("https://rpc-osmosis.blockapsis.com", signer);
//     const result = await client.signAndBroadcast(signer.address, [tx], { amount: [{ denom: "uosmo", amount: "2000" }], gas: "200000" });
//     return result;
// }
