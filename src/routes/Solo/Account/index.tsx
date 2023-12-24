import {  useEffect, useState } from "react";
import { useTonWallet } from "@tonconnect/ui-react";
import { OpenedContract,  fromNano, toNano } from "ton-core";
import { Status } from "../Boarding/Info";
import { Kaomoji } from "../../../helpers";
import { SoloAccount } from "neobase/wrappers/SoloAccount";
import { Statistics } from "../Boarding/Info";

import "./style.css";
import solo from "../../../model/solo";
import { ContractState } from "../../../helpers/contract";
import { risk2comission } from "../Boarding/Risk";
import { useNavigate } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import { Colors } from "../../../helpers/colors";
import { Animations } from "../../../components/Loader/Loader";
import { status } from "../../../helpers/state";
import { useTonConnect } from "../../../hooks/useTonConnect";
import { client } from "../../../api";

interface State {
    status: Status
    balance?: number,
    goalAmount?: number,
    restAmount?: number,
    risk?: number,
    t0?: number,
    tN?: number,
    bN?: number,
    grade?: bigint
}

export const Account = () => {

    const wallet = useTonWallet();
    const navigate = useNavigate();

    const [state, setState] = useState<State>({ status: 'pending' });

    const { sender } = useTonConnect();

    const [deposit, setDeposit] = useState(0);
    const [withdraw, setWithdraw] = useState(0);

    useEffect(() => {
        
        const back = () => navigate(-1);
        WebApp.BackButton.show();
        WebApp.BackButton.onClick(back);
        
        //const contract = SoloMaster.createFromAddress(Address.parse(import.meta.env.VITE_SOLO_MASTER_TEST_ADDRESS));

        
        WebApp.MainButton.enable();
        WebApp.setHeaderColor(Colors.BLACK);
        WebApp.MainButton.hide();

        return () => {
            WebApp.BackButton.offClick(back);
        }
    }, []);

    useEffect(() => {

        if (!wallet) return;

        let unsubscribe: any;

        unsubscribe = solo.content.account.rx.on('opened', init);

        init(solo.content.account.content);

        client
            .then(client => 
                client.getTransactions(solo.content.account.content.contract?.address!, {
                    limit: 10
                })
            )
            .then(transactions => {
                console.log(transactions);
            })

        return () => {
            solo.content.account?.rx.off('opened', unsubscribe);
        };

    }, [wallet])

    const setDepositState = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.floor(Number(event.target.value));

        // Update state
        setDeposit(value);
    }

    const setWithdrawState = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.floor(Number(event.target.value));

        // Update state
        setWithdraw(value);
    }

    async function sendDeposit() {
        await solo.content.account.content!.contract!.sendDeposit(sender, toNano(deposit));
        
        solo.openAccount(wallet!);
    }

    async function sendWithdraw() {
        await solo.content.account.content!.contract!.sendWithdraw(sender, toNano(0.05), toNano(withdraw));
        solo.openAccount(wallet!);
    }

    async function closeAccount() {
        await solo.content.account.content!.contract!.sendCloseAccount(sender, toNano(0.05));
        navigate('/main');
    }

    function init(account: ContractState<SoloAccount>['content']) {
        switch(account[status]) {
            case 'init':
                solo.openAccount(wallet!);
                break;
            case 'opened':
                if (account.deployed) {
                    loadData(solo.content.account.content.contract!);
                }
                else throw `Solo Account is not deployed`;
                break;
            default:
                break;
        }
    }
    

    async function loadData(contract: OpenedContract<SoloAccount>) {
        try {
            const [
                balance,
                goalAmount,
                restAmount,
                risk,
                t0,
                tN,
                bN,
                grade
            ] =
                await Promise.all([
                    contract.getMyBalance(),
                    contract.getGoalAmount(),
                    contract.getRestAmount(),
                    contract.getRisk(),
                    contract.getT0(),
                    contract.getTN(),
                    contract.getBN(),
                    contract.getGrade()
                ]);
                setState({
                    ...state,
                    balance: Number(fromNano(balance)),
                    goalAmount: Number(fromNano(goalAmount)),
                    restAmount: Number(fromNano(restAmount)),
                    risk,
                    t0,
                    tN,
                    bN: Number(fromNano(bN)),
                    grade,
                    status: 'loaded'
                });
        } catch(e) {
            setState({ status: 'error' });
        }
    }
    
    // @ts-ignore
    const progress = state.bN / state.goalAmount;
    // @ts-ignore
    const days = Math.floor((state.tN - state.t0) / (60 * 60 * 24));

    return (
        <div className="account">
            <div className="info">
                <div className="box">
                   <Hero />
                   {state.grade !== undefined
                        ? <h2 className="purple">{state.grade.toString()} grade</h2>
                        : <h2 className="purple"><Animations.Terminal /> grade</h2>
                   }
                  
                </div>
                <div className="box">
                    <ProgressBar progress={progress}/>
                    {progress
                        ? <h3>{Math.floor(progress * 100)}% progress</h3>
                        : <h3><Animations.Terminal /> progress</h3>
                    }
                </div>
                
                <div className="row">
                    <Statistics value={`${state.risk && risk2comission(state.risk)}`} status={state.status} class="value">Risk</Statistics>
                    <Statistics value={`${state.bN?.toFixed(2)}/${state.goalAmount?.toFixed(2)}`} status={state.status} class="value">TON</Statistics>
                    <Statistics value={days} status={state.status} class="value">Days</Statistics>
                </div>
            </div>
           <div className="box">
            <div className="box box-black bordered bordered-black shadowed-green target">
                    <label className="float-right row">
                        <input
                            type="number"
                            step={1}
                            pattern="\d*"
                            inputMode="numeric"
                            // defaultValue={state.goalAmount}
                            onChange={setDepositState}
                            value={'' + deposit}
                        />
                        <div>TON  <Animations.Terminal /></div>
                    </label>
                    <button className="button-green-acid" onClick={sendDeposit}>Deposit</button>
                </div>
                <div className="box box-black bordered bordered-black shadowed-green target">
                    <label className="float-right row">
                        <input
                            type="number"
                            step={1}
                            pattern="\d*"
                            inputMode="numeric"
                            // defaultValue={state.goalAmount}
                            onChange={setWithdrawState}
                            value={'' + withdraw}
                        />
                        <div>TON  <Animations.Terminal /></div>
                    </label>
                    <button className="button-green-acid" onClick={sendWithdraw}>Withdraw</button>
                </div>
                <button className="button-red" onClick={closeAccount}>Close Account</button>
           </div>
        </div>
    );

}

function ProgressBar(props: { progress?: number }) {
    console.log(props.progress);
    
    return (
        <div className="bordered progress-bar">
            {props.progress !== undefined && !isNaN(props.progress) &&
                <div className="bordered bordered-green progress" style={{ width: `${props.progress * 100}%` }}>
                </div>
            }
        </div>
    );
}

function Hero() {
    return (
        <div className={`box box-black-purple bordered bordered-purple hero-content`}>
            <div className="reflecting">{Kaomoji.REFLECTED.CAT}</div>
        </div>
    );
}