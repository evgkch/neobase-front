import { useEffect, useState } from "react"
import { Title } from "./Title";
import { useNavigate } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import { Kaomoji } from "../../../helpers";
import { Animations } from "../../../components/Loader/Loader";

interface State {
    heroId: number,
    goalAmount: number,
    risk: number,
    valid: boolean
}

const risk2comission = (risk: number) => (100 / (1 << risk)).toFixed(2) + '%';

const numRisk2select = (goalAmount: number) => Math.floor(Math.log2(goalAmount));

export const Settings = () => {

    const [state, setState] = useState<State>({
        heroId: 1,
        goalAmount: 100,
        risk: 1,
        valid: true
    });

    const navigate = useNavigate();

    const onGoalAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.floor(Number(event.target.value));
        const isValid = value >= 1 && value <= 10000;

        // TMA
        isValid ? WebApp.MainButton.enable() : WebApp.MainButton.disable();

        // Update state
        setState({
            ...state,
            goalAmount: Number(event.target.value),
            risk: 1,
            valid: isValid
        });
    }

    const handleRiskOptionClick = (risk: number) => {
        setState({ ...state, risk })
    }

    useEffect(() => {

        const back = () => navigate(-1);
        WebApp.BackButton.show();
        WebApp.BackButton.onClick(back);

        const next = () => {};
        WebApp.MainButton.enable();
        WebApp.headerColor ='#18191F';
        WebApp.MainButton.setText('check (¬‿¬ )');
        WebApp.MainButton.onClick(next);
        WebApp.MainButton.show();

        return () => {
            WebApp.BackButton.offClick(back);
            WebApp.MainButton.offClick(next);
        }
    })

    return (
        <div className="boarding">
            <Title />
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
            <div className="setting box box-yellow-light">
                <div className="row float-near-border">
                    <div>Set risk</div>
                    {<div className="kaomoji status">{state.risk === 1 ? Kaomoji.LOVE : state.risk <= 4 ? Kaomoji.WOW : Kaomoji.DISAPPOINTMENT}</div>}
                </div>
                <div className="row description float-left ">
                    <p>For example, if you widthdraw {(state.goalAmount / 10).toFixed(2)} TONs you will pay {(state.goalAmount / 10 / (1 << state.risk)).toFixed(2)} TONs as comission</p>
                </div>
                <div className="options">
                    {Array.from({ length: numRisk2select(state.goalAmount) }, (_, i) =>
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