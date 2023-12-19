import Channel, { Rx } from "channeljs";

export const status = Symbol('status');

export class State<T extends { [status]: string | number | symbol }> {

    static #channels = new WeakMap<State<any>, Channel<[
        [string | symbol | number, [content: Readonly<any>]]
    ]>>;

    #content: T;

    constructor(content: T) {
        this.#content = content;
        State.#channels.set(this, new Channel);
    }

    get content() {
        return this.#content as Readonly<T>;
    }

    get rx() {
        return State.#channels.get(this)!.rx as  Rx<[[T[typeof status], [content: Readonly<T>]]]>;
    }

    set = (content: T) => {
        this.#content = content;
        State.#channels.get(this)!.tx.send(content[status], this.content);
    }

    update = (content: Partial<T>) => {
        this.#content = { ...this.#content, ...content };
        State.#channels.get(this)!.tx.send(this.#content[status], this.content);
    }

}