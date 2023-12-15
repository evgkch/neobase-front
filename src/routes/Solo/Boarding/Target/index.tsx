import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import { Kaomoji } from "../../../../helpers";
import { Animations } from "../../../../components/Loader/Loader";
import { Colors } from "../../../../helpers/colors";

import * as model from '../../../../model';

interface State {
    goalAmount: number,
    valid: boolean
}

export const Target = () => {

    const [state, setState] = useState<State>({
        goalAmount: model.solo.state.goalAmount,
        valid: true
    });

    const navigate = useNavigate();

    const onGoalAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.floor(Number(event.target.value));
        const isValid = value >= 1 && value <= 10000;

        // Update state
        setState({
            ...state,
            goalAmount: value,
            valid: isValid
        });

        if (isValid) {
            model.solo.set('goalAmount', value);
            WebApp.MainButton.enable();
        }
        else {
            WebApp.MainButton.disable();
        }
    }

    useEffect(() => {

        const back = () => navigate(-1);
        WebApp.BackButton.show();
        WebApp.BackButton.onClick(back);

        const next = () => navigate('/solo/risk');
        WebApp.MainButton.enable();
        WebApp.setHeaderColor(Colors.BLUE);
        WebApp.MainButton.setText(`ok ${Kaomoji.YEEE} next`);
        WebApp.MainButton.onClick(next);
        WebApp.MainButton.show();

        return () => {
            WebApp.BackButton.offClick(back);
            WebApp.MainButton.offClick(next);
        }
    })

    return (
        <div className="boarding">
            <div className="setting box box-green-acid">
                <div className="row float-near-border">
                    {state.valid
                        ? <div className="kaomoji status">{Kaomoji.HAPPY}</div>
                        : <Animations.ReflectingKaomoji class="invalid" content={Kaomoji.INPUT_ERROR} />
                    }
                    <div>Set target</div>
                </div>
                <div className="row float-right description">
                    <p>Description how to set Target Amount and will be happy</p>
                </div>
                <div className="value row float-right">
                    <input
                        id="goal-amount"
                        type="number"
                        step={1}
                        pattern="\d*"
                        inputMode="numeric"
                        defaultValue={state.goalAmount}
                        onChange={onGoalAmountChange}
                        value={state.goalAmount}
                    />
                    <div>TON</div>
                </div>
            </div>
        </div>
    )
}