import { Contract, OpenedContract } from "ton-core";
import { State } from "./state";
import { client } from "../api";

import { status } from "./state";

export class ContractState<T extends Contract>  extends State<
    {
        [status]: 'init' | 'pending' | 'error' | 'opened' | 'closed',
        contract?: OpenedContract<T>,
        deployed?: boolean
    }> {

    constructor() {
        super({ [status]: 'init' });
        // MAYBE TODO 
        // open on error again
    }

    open = (contract: T) => {
        switch(this.content[status]) {
            case 'init':
            case 'error':
            case 'closed':
                this.update({ [status]: 'pending' });
                client
                    .then(async (client) => {
                        this.update({
                            [status]: 'opened',
                            contract: client.open(contract),
                            deployed: await client.isContractDeployed(contract.address)
                        });
                    })
                    .catch(() => {
                        this.set({
                            [status]: 'error'
                        });
                    })
                break;
            default:
                break;
        }
        return this;
    }

    close = () => {
        switch(this.content[status]) {
            case 'opened':
                this.set({ [status]: 'closed' })
                break;
            default:
                break;
        }
        return this;
    }

    checkIsDeployed = async () => {
        if (this.content[status] === 'opened') {
            try {
                await client
                    .then(async (client) => {
                        this.update({
                            [status]: 'opened',
                            deployed: await client.isContractDeployed(this.content.contract?.address!)
                        });
                    });
            }
            catch (e) {
                throw `Can't check the Contract status`;
            }
        }
        else throw `The Contract is not opened`;
    }

};