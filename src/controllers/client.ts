import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient } from "ton";

// TODO
// use as provideer

const clientPromise = getHttpEndpoint({
    network: "testnet"
}).then(endpoint => new TonClient({ endpoint }));

export default clientPromise;