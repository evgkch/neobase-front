import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import { Kaomoji } from "../../../../helpers";
import { Colors } from "../../../../helpers/colors";

import * as model from '../../../../model';

import "./style.css"

const risk2comission = (risk: number) => (100 / (1 << risk)).toFixed(2) + '%';

export const Check = () => {

    const navigate = useNavigate();

    useEffect(() => {

        const back = () => navigate(-1);
        WebApp.BackButton.show();
        WebApp.BackButton.onClick(back);

        const next = () => {};
        WebApp.MainButton.enable();
        WebApp.setHeaderColor(Colors.BLUE);
        WebApp.MainButton.setText(`do ${Kaomoji.REFLECTED.MAGIC} magic`);
        WebApp.MainButton.onClick(next);
        WebApp.MainButton.show();

        return () => {
            WebApp.BackButton.offClick(back);
            WebApp.MainButton.offClick(next);
        }
    }, []);

    return (
        <div className="boarding">
            <div className="box box-black card">
                <div className="row float-near-border info">
                    <h2>{model.solo.state.goalAmount} TON</h2>
                    <h2>{risk2comission(model.solo.state.risk)} RISK</h2>
                </div>
                <div className="row float-near-border hero">
                    <h1 className="reflecting">{model.solo.state.hero}</h1>
                </div>
            </div>
        </div>
    )
}