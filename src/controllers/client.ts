import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient } from "ton";

const client = new TonClient({
    endpoint: await getHttpEndpoint({
        network: "testnet"
    })
});

export default client;