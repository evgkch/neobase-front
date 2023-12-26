import { ReactElement } from "react"

export const Modal = (props: { children: ReactElement }) => {

    return (
        <div className="modal">
                {props.children}
        </div>
    )

}