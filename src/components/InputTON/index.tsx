import React from "react";
import { Animations } from "../Loader/Loader";

import "./style.css";

export const InputTON = (props: { onChange: React.ChangeEventHandler<HTMLInputElement>, value: number }) => (
    <label className="float-right row">
        <input
            type="number"
            step={0.01}
            pattern="\d*"
            inputMode="numeric"
            onChange={props.onChange}
            value={'' + props.value}
        />
        <div>TON  <Animations.Terminal /></div>
    </label>
)