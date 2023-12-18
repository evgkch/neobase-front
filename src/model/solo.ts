import { SoloMaster } from "neobase/wrappers/SoloMaster";
import { Kaomoji } from "../helpers";
import { ContractState } from "../helpers/contract";
import { SoloAccount } from "neobase/wrappers/SoloAccount";
import { State } from "../helpers/state";
import { Address } from "ton-core";

type BoardingSettings = {
    goalAmount: number,
    risk: number,
    hero: string
}

interface SoloState {
    master: ContractState<SoloMaster>,
    account?: ContractState<SoloAccount>,
    boarding: State<BoardingSettings>
}

export const defaultBoardingSettings: Readonly<BoardingSettings> = {
    goalAmount: 100,
    risk: 1,
    hero: Kaomoji.REFLECTED.LOADING
};

export default new State<SoloState>({
    master: new ContractState(
        new SoloMaster(
            Address.parse(import.meta.env.VITE_SOLO_MASTER_TEST_ADDRESS)
        )
    ),
    boarding: new State<BoardingSettings>({ ...defaultBoardingSettings })
});