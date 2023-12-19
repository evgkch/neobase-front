import { ReactElement } from "react"

export const Modal = (props: { children: ReactElement }) => {

    return (
        <div className="modal">
            <div className="modal-content">
                {props.children}
            </div>
        </div>
    )

}