import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient } from "ton";

// TODO
// use as provideer

const client = new TonClient({
    endpoint: await getHttpEndpoint({
        network: "testnet"
    })
});

export default client;