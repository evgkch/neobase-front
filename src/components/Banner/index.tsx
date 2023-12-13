import "./style.css"

interface Props {
    title: string,
    description: string,
    go: () => void
}

export function Banner(props: Props) {
    return (
        <div className="banner">
            <h2>{props.title}</h2>
            <p>{props.description}</p>
            <button onClick={props.go}>Go</button>
        </div>
    )
}