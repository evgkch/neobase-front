import { Struct } from "./struct";

interface SoloSettings {
    goalAmount: number,
    risk: number
}

export const solo = new Struct<SoloSettings>({
    goalAmount: 100,
    risk: 1
});