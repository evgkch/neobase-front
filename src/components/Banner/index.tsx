import { Color } from "../../helpers"

interface Props {
    title: string,
    description: string,
    go: () => void,
    color: Color
}

export function Banner(props: Props) {
    return (
        <div className={`banner box box-${props.color} bordered bordered-${props.color} shadowed float-left`}>
            <h2>{props.title}</h2>
            <p>{props.description}</p>
            <button className={`button-${props.color}`} onClick={props.go}>ok <span className="kaomoji">(ノ ˘_˘)ノ</span> go</button>
        </div>
    )
}