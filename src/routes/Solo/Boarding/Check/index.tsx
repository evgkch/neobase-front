import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import { Kaomoji } from "../../../../helpers";
import { Colors } from "../../../../helpers/colors";

import * as model from '../../../../model';

import "./style.css"
import clientPromise, { getSender } from "../../../../controllers/client";
import { SoloMaster } from "neobase/wrappers/SoloMaster";
import { Address, toNano } from "ton-core";
import { useTonConnectUI } from "@tonconnect/ui-react";

const risk2comission = (risk: number) => (100 / (1 << risk)).toFixed(2) + '%';

export const Check = () => {

    const navigate = useNavigate();

    const [tonConnectUi] = useTonConnectUI();

    useEffect(() => {

        const back = () => navigate(-1);
        WebApp.BackButton.show();
        WebApp.BackButton.onClick(back);
        
        const contract = SoloMaster.createFromAddress(Address.parse(import.meta.env.VITE_SOLO_MASTER_TEST_ADDRESS));

        const next = () => {
            
            clientPromise.then(client => {
                const api = client.open(contract);
                const sender = getSender(tonConnectUi)!;
                api.sendCreateAccount(sender, toNano(0.05), {
                    goalAmount: toNano(model.solo.state.goalAmount),
                    risk: model.solo.state.risk,
                    heroId: 2
                });
                console.log('Create Account Sent');
            })
        };
        WebApp.MainButton.enable();
        WebApp.setHeaderColor(Colors.BLUE);
        WebApp.MainButton.setText(`${Kaomoji.REFLECTED.MAGIC} do magic`);
        WebApp.MainButton.onClick(next);
        WebApp.MainButton.show();

        return () => {
            WebApp.BackButton.offClick(back);
            WebApp.MainButton.offClick(next);
        }
    }, []);

    return (
        <div className="boarding">
            <div className="box box-black-purple card">
                <div className="row float-near-border info">
                    <h2>{model.solo.state.goalAmount} TON</h2>
                    <h2>RISK {risk2comission(model.solo.state.risk)}</h2>
                </div>
                <div className="row float-near-border hero">
                    <h1 className="reflecting">{model.solo.state.hero}</h1>
                </div>
            </div>
        </div>
    )
}