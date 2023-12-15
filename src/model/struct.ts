import Channel, { Rx, Tx } from "channeljs";

type IfEquals<X, Y, A, B> =
    (<T>() => T extends X ? 1 : 2) extends
    (<T>() => T extends Y ? 1 : 2) ? A : B;

export type WritableKeysOf<T> = {
    [P in keyof T]: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P, never>
}[keyof T];

export type StructMessageMap<A> = {
    [Key in WritableKeysOf<A>]: [value: A[Key]]
} & {
    [Struct.MAP]: [nextState: Maybe<A>, prevState: A, f: (state: A) => A]
};

type Maybe<T> = T | undefined;

export class Struct<A extends object> {

	static readonly MAP = Symbol("map");

	#state: Maybe<A>;
	constructor(state: A) {
		Channel.add(this);
		this.#state = state;
	}

	get state() {
		return this.#state as Readonly<A>;
	}

	get #tx() {
		return Channel.get(this)?.tx as Tx<StructMessageMap<A>>;
	}

	get rx() {
		return Channel.get(this)?.rx as Rx<StructMessageMap<A>>;
	}

	map(f: (state: Readonly<A>) => Readonly<A>) {
        if (!this.#state) throw 'Struct destroyed';
		const prevState = this.#state;
		this.#state = f(prevState);
        // @ts-ignore
		this.#tx.send(Struct.MAP, this.state, prevState, f);
		return this;
	}

    set<K extends WritableKeysOf<A>>(key: K, value: A[K]) {
        if (!this.#state) throw 'Struct destroyed';
        this.#state[key] = value;
        // @ts-ignore
        this.#tx.send(key, value);
        return this;
    }

}