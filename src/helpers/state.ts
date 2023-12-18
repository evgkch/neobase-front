import Channel, { Rx } from "channeljs";

export class State<T> {

    static #channels = new WeakMap<State<any>, Channel<[
        ['update', [content: Readonly<any>]]
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
        return State.#channels.get(this)!.rx as  Rx<[["update", [content: Readonly<T>]]]>;
    }

    set = (content: T) => {
        this.#content = content;
        State.#channels.get(this)!.tx.send('update', this.content);
    }

    update = (content: Partial<T>) => {
        this.#content = { ...this.#content, ...content };
        State.#channels.get(this)!.tx.send('update', this.content);
    }

}