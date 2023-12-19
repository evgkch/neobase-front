import { Kaomoji } from "../../helpers";

import "./style.css";

export namespace Animations {

    export const Terminal = () => <span className="terminal-loading">▊</span>

    export const RunnigMan = (props?: { class?: string }) => <span className={`reflecting kaomoji ${props?.class ?? ''}`}>{Kaomoji.REFLECTED.LOADING}</span>

    export const ReflectingKaomoji = (props: { content: string, class?: string }) => <div className={`reflecting kaomoji ${props.class ?? ''}`}>{props.content}</div>

}

export const ModalLoader = () =>
    <div className="modal-loader">
        <Animations.RunnigMan />
        loading...
    </div>