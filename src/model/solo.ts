import { Kaomoji } from "../helpers";
import { Struct } from "./struct";

interface SoloSettings {
    goalAmount: number,
    risk: number,
    hero: string
}

export const solo = new Struct<SoloSettings>({
    goalAmount: 100,
    risk: 1,
    hero: Kaomoji.REFLECTED.LOADING
});