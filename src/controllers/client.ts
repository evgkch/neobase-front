import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonConnectUI } from "@tonconnect/ui-react";
import { TonClient } from "ton";
import { Address, SenderArguments, } from "ton-core"


// TODO
// use as provideer

const clientPromise = getHttpEndpoint({
    network: "testnet"
}).then(endpoint => new TonClient({ endpoint }));

// Overload Sender
export interface Sender {
    readonly address?: Address;
    send(args: SenderArguments): Promise<void>;
}

export const getSender = (tonConnectUI: TonConnectUI): Sender | null =>  {
    if (!tonConnectUI.connected) return null;
    return {
        address: Address.parse(tonConnectUI.account?.address!),
        send: async (args: SenderArguments) => {
            await tonConnectUI.sendTransaction({
                messages: [
                {
                    address: args.to.toString(),
                    amount: args.value.toString(),
                    payload: args.body?.toBoc().toString("base64"),
                },
                ],
                validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
            });
        },
    };
}

export default clientPromise;