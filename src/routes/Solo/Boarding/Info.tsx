import WebApp from "@twa-dev/sdk"

import "./style.css"
import { useNavigate } from "react-router-dom"
import { ReactNode, useEffect, useState } from "react"
import { OpenedContract, fromNano } from "ton-core"
import { Animations } from "../../../components/Loader/Loader"
import { Colors } from "../../../helpers/colors"
import { Kaomoji } from "../../../helpers"
import solo from "../../../model/solo"
import { SoloMaster } from "neobase/wrappers/SoloMaster"

export type Status =  'pending' | 'loaded' | 'error';

interface State {
    status: Status,
    accountCounter?: string,
    balance?: string
}

export const Info = () => {

    const navigate = useNavigate();
    const [state, setState] = useState({ status: 'pending' } as State);
    
    // Telegram Navigation
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

        return () => {
            WebApp.BackButton.offClick(back);
            WebApp.MainButton.offClick(next);
        }
    }, [])

    // Load data
    useEffect(() => {

        let unsubscribe: any;

        if (solo.content.master.content.status === 'opened') {
            loadData(solo.content.master.content.contract!)
        }
        else {
            unsubscribe = solo.content.master.rx.on('update', async content => {
                if (content.status === 'opened') {
                    loadData(content.contract!);
                }
            })
        }

        async function loadData(contract: OpenedContract<SoloMaster>) {
            try {
                const [accountCounter, balance] =
                    await Promise.all([
                        contract.getAccountCounter(),
                        contract.getMyBalance()
                    ]);
                setState({
                    status: 'loaded',
                    accountCounter: Number(accountCounter).toString(),
                    balance: Number(fromNano(balance)).toFixed(2)
                })
            } catch(e) {
                setState({ status: 'error' });
            }
        }

        return () => {
            solo.content.master.rx.off('update', unsubscribe);
        };

    }, [])

    return (
        <>
            <div className="statistics row">
                <Statistics value={state.accountCounter} status={state.status}>accounts</Statistics>
                <Statistics value={state.balance} status={state.status}>TON saved</Statistics>
            </div>
        </>
    )
}

function Statistics(props: { status: Status, value?: any, children: ReactNode }) {
    return (
        <div className="box box-white bordered bordered-white shadowed-blue column float-center">
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