import "./style.css"
import { ReactNode, useEffect, useState } from "react"
import { OpenedContract, fromNano } from "ton-core"
import { Animations } from "../../../components/Loader/Loader"
import { Kaomoji } from "../../../helpers"
import solo from "../../../model/solo"
import { SoloMaster } from "neobase/wrappers/SoloMaster"
import { status } from "../../../helpers/state"

export type Status =  'pending' | 'loaded' | 'error';

interface State {
    status: Status,
    accountCounter?: string,
    balance?: string
}

export const Info = () => {

    const [state, setState] = useState({ status: 'pending' } as State);
    
    // Load data
    useEffect(() => {

        let unsubscribe: any;

        if (solo.content.master.content[status] === 'opened') {
            loadData(solo.content.master.content.contract!)
        }
        else {
            unsubscribe = solo.content.master.rx.on('opened', async content => {
                loadData(content.contract!);
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
            solo.content.master.rx.off('opened', unsubscribe);
        };

    }, [])

    return (
        <>
            <div className="statistics row">
                <Statistics value={state.accountCounter} status={state.status} class="box-white bordered bordered-white shadowed-blue">accounts</Statistics>
                <Statistics value={state.balance} status={state.status} class="box-white bordered bordered-white shadowed-blue">TON saved</Statistics>
            </div>
        </>
    )
}

export function Statistics(props: { status: Status, value?: any, children: ReactNode, class?: string }) {
    return (
        <div className={`box column float-center ${props.class ?? ''}`}>
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