import WebApp from "@twa-dev/sdk"

import { SoloMaster } from "neobase/wrappers/SoloMaster"

import "./style.css"
import { useNavigate } from "react-router-dom"
import { ReactNode, useEffect, useState } from "react"
import clientPromise from "../../../controllers/client"
import { Address, fromNano } from "ton-core"
import { Animations } from "../../../components/Loader/Loader"
import { Colors } from "../../../helpers/colors"
import { Kaomoji } from "../../../helpers"

export type Status =  'pending' | 'loaded' | 'error';

interface State {
    status: Status,
    accountCounter?: string,
    fundBalance?: string
}

export const Info = () => {

    const navigate = useNavigate();
    const [state, setState] = useState({ status: 'pending' } as State);

    useEffect(() => {

        const back = () => navigate(-1);
        WebApp.BackButton.show();
        WebApp.BackButton.onClick(back);

        const next = () => {
            navigate('/solo/target');
        };

        WebApp.MainButton.enable();
        WebApp.setHeaderColor(Colors.BLUE);
        WebApp.MainButton.setText('ok (ノ= ⩊ = )ノ go');
        WebApp.MainButton.onClick(next);
        WebApp.MainButton.color = '#FFFFFF';
        WebApp.MainButton.textColor = Colors.BLACK;
        WebApp.MainButton.show();

        const contract = SoloMaster.createFromAddress(Address.parse(import.meta.env.VITE_SOLO_MASTER_TEST_ADDRESS));
        clientPromise.then(client => {
            const api = client.open(contract);
            Promise
                .all([api.getAccountCounter(), api.getMyBalance()])
                .then(res => 
                    setState({
                        status: 'loaded',
                        accountCounter: Number(res[0]).toString(),
                        fundBalance: Number(fromNano(res[1])).toFixed(2)
                    })
                )
        }).catch(() => {
            setState({
                status: 'error'
            })
        });

        return () => {
            WebApp.BackButton.offClick(back);
            WebApp.MainButton.offClick(next);
        }
    }, [])    

    return (
        <>
            <div className="statistics row">
                <Statistics value={state.accountCounter} status={state.status}>accounts</Statistics>
                <Statistics value={state.fundBalance} status={state.status}>TON saved</Statistics>
            </div>
            <Guide />
        </>
    )
}

function Statistics(props: { status: Status, value?: any, children: ReactNode }) {
    return (
        <div className="column float-center">
            {props.status === 'pending'
                ? <Animations.Terminal />
                : props.status === 'loaded'
                    ? <div>{props.value}</div>
                    : <div className="error">{Kaomoji.ERROR}</div>
            }
            <div>{props.children}</div>
        </div>
    )
}

function Guide() {
    return (
        <div className="box box-white guide">
            <ol>
                <li>Set Target Amount</li>
                <li>Choose Risk</li>
                <li>Create Hero</li>
                <li>Start to safe in comfortable way</li>
                <li>Get dNFT in the end to your wallet and start to receive dividends</li>
            </ol>
        </div>
    )
}