import { Kaomoji } from "../../helpers";

import "./style.css";

export namespace Animations {

    export const Terminal = () => <div className="terminal-loading">█ </div>

    export const RunnigMan = () => <div className="reflecting kaomoji">{Kaomoji.LOADING}</div>

    export const ReflectingKaomoji = (props: { content: string, class?: string }) => <div className={`reflecting kaomoji ${props.class ?? ''}`}>{props.content}</div>

}