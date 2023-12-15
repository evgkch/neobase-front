import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import { Kaomoji } from "../../../../helpers";
import { Colors } from "../../../../helpers/colors";

import * as model from '../../../../model';

import "./style.css";

interface State {
    risk: number
}

export const risk2comission = (risk: number) => (100 / (1 << risk)).toFixed(2) + '%';

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

        const next = () => navigate('/solo/hero');
        WebApp.setHeaderColor(Colors.BLUE);
        WebApp.MainButton.setText(`ok ${Kaomoji.REFLECTED.YEEE} next`);
        WebApp.MainButton.onClick(next);

        return () => {
            WebApp.BackButton.offClick(back);
            WebApp.MainButton.offClick(next);
        }
    }, [])

    return (
        <div className="boarding">
            <div className="box box-white guide">
                <ol>
                    <li>Target is {model.solo.state.goalAmount} TON</li>
                </ol>
            </div>
            <div className="box box-white">
                <div className="row float-near-border">
                        <div>Set risk</div>
                        <div className="kaomoji status">{
                            state.risk === 1
                                ? Kaomoji.LOVE
                                : state.risk <= 4
                                    ? Kaomoji.REFLECTED.WOW
                                    : Kaomoji.DISAPPOINTMENT
                        }</div>
                </div>
                <div className="row description float-left ">
                    <p>For example, if you widthdraw {(model.solo.state.goalAmount / 10).toFixed(2)} TONs you will pay {(model.solo.state.goalAmount / 10 / (1 << state.risk)).toFixed(2)} TONs as comission</p>
                </div>
            </div>
            <div className="risks scroll-box">
                {Array.from({ length: numRisk2select(model.solo.state.goalAmount) }, (_, i) =>
                    <div
                        className={`box risk ${state.risk === i + 1 ? 'box-black risk-selected' : 'box-green-acid'}`}
                        key={i}
                        onClick={() => handleRiskOptionClick(i + 1)}
                    >
                        {risk2comission(i + 1)}
                    </div>
                )}
            </div>
        </div>
    )
}