import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import { Kaomoji } from "../../../../helpers";
import { Colors } from "../../../../helpers/colors";

import "./style.css"

import { toNano } from "ton-core";
import { useTonConnect } from "../../../../hooks/useTonConnect";
import solo from "../../../../model/solo";

const risk2comission = (risk: number) => (100 / (1 << risk)).toFixed(2) + '%';

export const Check = () => {

    const navigate = useNavigate();

    const { sender } = useTonConnect();

    useEffect(() => {

        const back = () => navigate(-1);
        WebApp.BackButton.show();
        WebApp.BackButton.onClick(back);
        
        //const contract = SoloMaster.createFromAddress(Address.parse(import.meta.env.VITE_SOLO_MASTER_TEST_ADDRESS));

        
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

    const next = async () => {
        solo.content.master.content.contract?.sendCreateAccount(sender, toNano(0.1), {
            goalAmount: toNano(solo.content.boarding.content.goalAmount),
            risk: solo.content.boarding.content.risk,
            heroId: 1
        });
    };

    return (
        <div className="boarding">
            <div className="box box-black-purple card">
                <div className="row float-near-border info">
                    <h2>{solo.content.boarding.content.goalAmount} TON</h2>
                    <h2>RISK {risk2comission(solo.content.boarding.content.risk)}</h2>
                </div>
                <div className="row float-near-border hero">
                    <h1 className="reflecting">{solo.content.boarding.content.hero}</h1>
                </div>
                <button onClick={next}></button>
            </div>
        </div>
    )
}