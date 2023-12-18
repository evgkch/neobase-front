import { Contract, OpenedContract } from "ton-core";
import { State } from "./state";
import { client } from "../api";

export class ContractState<T extends Contract>  extends State<
    {
        status: 'init' | 'pending' | 'error' | 'opened',
        contract?: OpenedContract<T>,
        deployed?: boolean
    }> {

    constructor(contract: T) {
        super({ status: 'init' });
        this.open(contract);
        // MAYBE TODO 
        // open on error again
    }

    open = (contract: T) => {
        switch(this.content.status) {
            case 'init':
            case 'error':
                this.update({ status: 'pending' });
                client
                    .then(async (client) => {
                        this.update({
                            status: 'opened',
                            contract: client.open(contract),
                            deployed: await client.isContractDeployed(contract.address)
                        });
                    })
                    .catch(() => {
                        this.set({
                            status: 'error'
                        });
                    })
                return;
            default:
                return;
        }
    }

    checkIsDeployed = () => {
        switch(this.content.status) {
            case 'opened':
                client
                    .then(async (client) => {
                        this.update({
                            status: 'opened',
                            deployed: await client.isContractDeployed(this.content.contract?.address!)
                        });
                    })
                    .catch(() => {
                        this.set({
                            status: 'error'
                        });
                    })
                return;
        }
    }

};