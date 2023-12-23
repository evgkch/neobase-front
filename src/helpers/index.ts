export { Kaomoji } from './kaomoji'

export type Color = 'black' | 'white' | 'blue' | 'green' | 'green-acid' | 'purple-acid' | 'yellow' | 'red' | 'pink';

export const sleep = (timeout: number) => new Promise((resolve) => {
    setTimeout(resolve, timeout);
});