import { ReactElement, useEffect, useState } from "react"
import { Title } from "./Title";
import { useNavigate } from "react-router-dom";
import WebApp from "@twa-dev/sdk";

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
        const value = Number(event.target.value);
        if (value >= 1 && value <= 10000) {
            setState({
                ...state,
                goalAmount: Number(event.target.value),
                risk: 1,
                valid: value >= 100
            })
        }
        else if (value < 1) {
            setState({
                ...state,
                valid: false
            })
        }
    }

    const handleRiskOptionClick = (risk: number) => {
        setState({
            ...state,
            risk
        })
    }

    useEffect(() => {

        const back = () => navigate(-1);
        WebApp.BackButton.show();
        WebApp.BackButton.onClick(back);

        const next = () => {};
        WebApp.MainButton.enable();
        WebApp.MainButton.setParams({ color: '#18191F' });
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
            <Setting color="green">
                <div>Set target</div>
                <div className="total-balance-value">
                    <input
                        id="goal-amount"
                        type="number"
                        step={1}
                        min={1}
                        max={10000}
                        pattern="\d*"
                        inputMode="numeric"
                        defaultValue={state.goalAmount}
                        onChange={onGoalAmountChange}
                        value={state.goalAmount}
                    />
                    <div>TON</div>
                    <div className="status">{state.valid ? "(o˘◡˘o)" : "(个_个)"}</div>
                </div>
            </Setting>
            <Setting color="yellow">
                <div>Set risk</div>
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
                    <div className="status">{state.goalAmount === 1 ? "(｡•́︿•̀｡)" : state.risk <= 4 ? "＼(º □ º l|l)" : "┐( ˘_˘ )┌"}</div>
                </div>
            </Setting>
        </div>
    )
}

type SettingColor = 'green' | 'pink' | 'yellow';

function Setting(props: { children: ReactElement[], color: SettingColor }) {
    return (
        <div className={`setting setting-${props.color}`}>
            {props.children}
        </div>
    )
}