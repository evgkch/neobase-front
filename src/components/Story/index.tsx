interface Props {
    go: () => void,
    title: string
}

export function Story(props: Props) {
    return (
        <div className={`story box box-black-green`} onClick={props.go}>
            <h2>{props.title}</h2>
        </div>
    )
}