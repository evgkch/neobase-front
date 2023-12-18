import { SoloMaster } from "neobase/wrappers/SoloMaster";
import { Kaomoji } from "../helpers";
import { ContractState } from "../helpers/contract";
import { SoloAccount } from "neobase/wrappers/SoloAccount";
import { State } from "../helpers/state";
import { Address } from "ton-core";

import { WalletInfoWithOpenMethod, Wallet } from '@tonconnect/ui';

type BoardingSettings = {
    goalAmount: number,
    risk: number,
    hero: string
}

interface SoloState {
    master: ContractState<SoloMaster>,
    account: ContractState<SoloAccount>,
    boarding: State<BoardingSettings>
}

export const defaultBoardingSettings: Readonly<BoardingSettings> = {
    goalAmount: 100,
    risk: 1,
    hero: Kaomoji.REFLECTED.LOADING
};

export default new class Solo extends State<SoloState> {

    constructor() {
        super({
            master: new ContractState<SoloMaster>()
                .open(new SoloMaster(
                    Address.parse(import.meta.env.VITE_SOLO_MASTER_TEST_ADDRESS)
                )),
            account: new ContractState<SoloAccount>,
            boarding: new State<BoardingSettings>({ ...defaultBoardingSettings })
        });
    }

    #unsafeOpenAccount = async (wallet: Wallet | (Wallet & WalletInfoWithOpenMethod)) => {
        const accountAddress = await this.content.master.content.contract!.getAccountAddress(
            Address.parse(wallet.account.address)
        )
        if (this.content.account.content.status === 'opened') {
            this.content.account.close();
        }
        this.content.account.open(new SoloAccount(accountAddress));
    }

    openAccount = (wallet: Wallet | (Wallet & WalletInfoWithOpenMethod)) => {
        if (wallet.account.address) {
            if (!this.content.master.content.contract) {
                this.content.master.rx.once('update', () =>
                    this.#unsafeOpenAccount(wallet)
                )
                return;
            }
            this.#unsafeOpenAccount(wallet);
        }
    }

};
