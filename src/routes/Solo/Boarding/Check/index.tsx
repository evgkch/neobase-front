import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import { Kaomoji } from "../../../../helpers";
import { Colors } from "../../../../helpers/colors";

import * as model from '../../../../model';

import "./style.css"

import { Op } from "neobase/wrappers/constants";
import { Address, beginCell, toNano } from "ton-core";
import { SendTransactionRequest, useTonConnectUI } from "@tonconnect/ui-react";

const risk2comission = (risk: number) => (100 / (1 << risk)).toFixed(2) + '%';

export const Check = () => {

    const navigate = useNavigate();

    const [tonConnectUi] = useTonConnectUI();

    useEffect(() => {

        const back = () => navigate(-1);
        WebApp.BackButton.show();
        WebApp.BackButton.onClick(back);
        
        //const contract = SoloMaster.createFromAddress(Address.parse(import.meta.env.VITE_SOLO_MASTER_TEST_ADDRESS));

        const next = () => {

            const body = beginCell()
                .storeUint(Op.create_account, 32)
                .storeRef(
                    beginCell()
                        .storeUint(1, 32)
                        .storeCoins(toNano(model.solo.state.goalAmount))
                        .storeUint(model.solo.state.risk, 7)
                        .endCell()
                )
                .endCell();

            const transaction = {
                validUntil: Math.floor(Date.now() / 1000) + 360,
                messages: [
                    {
                        address: Address.parse(import.meta.env.VITE_SOLO_MASTER_TEST_ADDRESS).toRawString(),
                        amount: toNano(0.1).toString(),
                        payload: body.toBoc().toString("base64") // payload with comment in body
                    }
                ]
            } as SendTransactionRequest;

            tonConnectUi.sendTransaction(transaction).
                then(res => {console.log(res)})
                .catch(err => {console.log(err)})
            
            // clientPromise.then(client => {
            //     const api = client.open(contract);
            //     const sender = getSender(tonConnectUi)!;
            //     api.sendCreateAccount(sender, toNano(0.1), {
            //         goalAmount: toNano(model.solo.state.goalAmount),
            //         risk: model.solo.state.risk,
            //         heroId: 1
            //     });

                
            //     console.log('Create Account Sent');
            // })
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