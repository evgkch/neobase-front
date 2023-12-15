import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import { Kaomoji } from "../../../../helpers";
import { Colors } from "../../../../helpers/colors";

import * as model from '../../../../model';

interface State {
    risk: number
}

const risk2comission = (risk: number) => (100 / (1 << risk)).toFixed(2) + '%';

const numRisk2select = (goalAmount: number) => Math.floor(Math.log2(goalAmount));

export const Risk = () => {

    const [state, setState] = useState<State>({
        risk: model.solo.state.risk
    });

    const navigate = useNavigate();

    const handleRiskOptionClick = (risk: number) => {
        setState({ ...state, risk });
        model.solo.set('risk', risk);
    }

    useEffect(() => {

        const back = () => navigate(-1);
        WebApp.BackButton.show();
        WebApp.BackButton.onClick(back);

        const next = () => {};
        WebApp.MainButton.enable();
        WebApp.setHeaderColor(Colors.BLUE);
        WebApp.MainButton.setText(`ok ${Kaomoji.YEEE} next`);
        WebApp.MainButton.onClick(next);
        WebApp.MainButton.show();

        return () => {
            WebApp.BackButton.offClick(back);
            WebApp.MainButton.offClick(next);
        }
    }, [])

    return (
        <div className="boarding">
            <ol className="box box-white guide">
                <li>Target is {model.solo.state.goalAmount} TON</li>
            </ol>
            <div className="setting box box-yellow-light">
                <div className="row float-near-border">
                    <div>Set risk</div>
                    <div className="kaomoji status">{
                        state.risk === 1
                            ? Kaomoji.LOVE
                            : state.risk <= 4
                                ? Kaomoji.WOW
                                : Kaomoji.DISAPPOINTMENT
                    }</div>
                </div>
                <div className="row description float-left ">
                    <p>For example, if you widthdraw {(model.solo.state.goalAmount / 10).toFixed(2)} TONs you will pay {(model.solo.state.goalAmount / 10 / (1 << state.risk)).toFixed(2)} TONs as comission</p>
                </div>
                <div className="options">
                    {Array.from({ length: numRisk2select(model.solo.state.goalAmount) }, (_, i) =>
                        <div
                            className={`option ${state.risk === i + 1 ? 'option-selected' : ''}`}
                            key={i}
                            onClick={() => handleRiskOptionClick(i + 1)}
                        >
                            {risk2comission(i + 1)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}