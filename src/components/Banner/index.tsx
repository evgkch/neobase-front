import "./style.css"

interface Props {
    title: string,
    description: string,
    onClick: () => void
}

export function Banner(props: Props) {
    return (
        <div className="banner">
            <h2>{props.title}</h2>
            <p>{props.description}</p>
            <button onClick={props.onClick}>Go</button>
        </div>
    )
}