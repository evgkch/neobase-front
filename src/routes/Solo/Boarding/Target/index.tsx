import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import { Kaomoji } from "../../../../helpers";
import { Animations } from "../../../../components/Loader/Loader";
import { Colors } from "../../../../helpers/colors";

import "./style.css"
import solo from "../../../../model/solo";

interface State {
    goalAmount: number,
    valid: boolean
}

export const Target = () => {

    const [state, setState] = useState<State>({
        goalAmount: solo.content.boarding.content.goalAmount,
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
            solo.content.boarding.update({ goalAmount: value });
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
        WebApp.MainButton.setText(`ok ${Kaomoji.REFLECTED.YEEE} next`);
        WebApp.MainButton.onClick(next);
        WebApp.MainButton.show();

        return () => {
            WebApp.BackButton.offClick(back);
            WebApp.MainButton.offClick(next);
        }
    }, [])
    

    return (
        <div className="boarding">
            <div className="box box-white bordered bordered-white shadowed">
                <div className="row float-near-border">
                    <b>Set target</b>
                        {state.valid
                            ? <b className="kaomoji status">{Kaomoji.HAPPY}</b>
                            : <Animations.ReflectingKaomoji class="invalid" content={Kaomoji.REFLECTED.INPUT_ERROR} />
                        }
                    </div>
                    <div className="row float-left description">
                        <p>Description how to set Target Amount and will be happy</p>
                    </div>
                </div>
                <div className="box box-black bordered bordered-black shadowed-green target">
                    <label className="float-right ">
                        <input
                            type="number"
                            step={1}
                            pattern="\d*"
                            inputMode="numeric"
                            // defaultValue={state.goalAmount}
                            onChange={onGoalAmountChange}
                            value={'' + state.goalAmount}
                        />
                        <div>TON <Animations.Terminal /></div>
                    </label>
                </div>
        </div>
    )
}