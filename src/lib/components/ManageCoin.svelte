<script lang="ts">
    import { osmosis } from 'osmojs';
    import { SigningStargateClient } from '@cosmjs/stargate';
    import { coin } from '@cosmjs/amino';
    import { Dec, IntPretty } from '@keplr-wallet/unit';
    import type { OfflineSigner } from '@cosmjs/proto-signing';

      
    export let signer: OfflineSigner;
    export let walletAddress: string;

</script>

<p>TODO add a section for common actions such as burning</p>
<ul>
    <li>Burn</li>
    <li>Mint</li>
    <li>Send</li>
    <li>Create CL pool</li>
    <li>Add to CL pool</li>
</ul>
