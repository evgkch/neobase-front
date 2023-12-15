import WebApp from "@twa-dev/sdk"

import { SoloMaster } from "neobase/wrappers/SoloMaster"

import "./style.css"
import { useNavigate } from "react-router-dom"
import { ReactNode, useEffect, useState } from "react"
import client from "../../../controllers/client"
import { Address, fromNano } from "ton-core"
import { Animations } from "../../../components/Loader/Loader"
import { Colors } from "../../../helpers/colors"

interface State {
    loaded: boolean,
    accountCounter?: string,
    fundBalance?: string
}

export const Info = () => {

    const navigate = useNavigate();
    const [state, setState] = useState({ loaded: false } as State);

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
        const api = client.open(contract);
        Promise
            .all([api.getAccountCounter(), api.getMyBalance()])
            .then(res => 
                setState({
                    loaded: true,
                    accountCounter: Number(res[0]).toString(),
                    fundBalance: Number(fromNano(res[1])).toFixed(2)
                })
            );

        return () => {
            WebApp.BackButton.offClick(back);
            WebApp.MainButton.offClick(next);
        }
    }, [])    

    return (
        <>
            <div className="statistics row">
                <Statistics value={state.accountCounter}>accounts</Statistics>
                <Statistics value={state.fundBalance}>TON saved</Statistics>
            </div>
            <Guide />
        </>
    )
}

function Statistics(props: { value?: any, children: ReactNode }) {
    return (
        <div className="column float-center">
            {props.value
                ? <div>{props.value}</div>
                : <Animations.Terminal />
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