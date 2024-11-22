import { SigningStargateClient } from '@cosmjs/stargate';
import type { OfflineSigner } from '@cosmjs/proto-signing';
import { registry } from "./registry";

export async function createStargateClient(rpcEndpoint: string, signer: OfflineSigner): Promise<SigningStargateClient> {
    return await SigningStargateClient.connectWithSigner(
        rpcEndpoint,
        signer,
        { registry }
    );
}