import WebApp from "@twa-dev/sdk"

import { SoloMaster } from "neobase/wrappers/SoloMaster"

import "./style.css"
import { useNavigate } from "react-router-dom"
import { ReactElement, ReactNode, useEffect, useState } from "react"
import client from "../../../controllers/client"
import { Address, fromNano } from "ton-core"

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
            navigate('/solo/settings');
        };

        WebApp.MainButton.enable();
        WebApp.MainButton.setParams({ color: '#1946e6' });
        WebApp.MainButton.setText('ok (ノ= ⩊ = )ノ go');
        WebApp.MainButton.onClick(next);
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
    }, [state.loaded])    

    return (
        <>
            <SoloStatistics>
                <StatisticsItem value={state.accountCounter}>accounts</StatisticsItem>
                <StatisticsItem value={state.fundBalance}>TON saved</StatisticsItem>
            </SoloStatistics>
            <Guide />
        </>
    )
}

function StatisticsItem(props: { value?: any, children: ReactNode }) {
    return (
        <div className="statistics-item">
            <div className={props.value ? 'loaded' : 'loading'}>{props.value}</div>
            <div>{props.children}</div>
        </div>
    )
}

function SoloStatistics(props: { children: ReactElement<typeof StatisticsItem>[] }) {
    return (
        <div className="statistics">
            {props.children}
        </div>
    )
}

function Guide() {
    return (
        <ol className="guide">
            <li>Set Target Amount</li>
            <li>Choose Risk</li>
            <li>Create Hero</li>
            <li>Start to safe in comfortable way</li>
            <li>Get dNFT in the end to your wallet and start to receive dividends</li>
        </ol>
    )
}