import { getHttpEndpoint } from '@orbs-network/ton-access';
import { Contract, TonClient, Address } from "ton";

export const client = getHttpEndpoint({ network: 'testnet' }).then(endpoint => new TonClient({ endpoint }));

export const openContract = <T extends Contract>(contract: T) => client.then(client => client.open(contract));

export const isContractDeployed = (address: Address) => client.then(client => client.isContractDeployed(address));

export const getTransactions = (...args: Parameters<typeof TonClient.prototype.getTransactions>) => client.then(client => client.getTransactions(...args));

