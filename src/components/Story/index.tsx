interface Props {
    go: () => void,
    title: string
}

export function Story(props: Props) {
    return (
        <div className={`box box-black bordered shadowed-green story`} onClick={props.go}>
            <h2>{props.title}</h2>
        </div>
    )
}