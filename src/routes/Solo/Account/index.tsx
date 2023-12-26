import {  useEffect, useState } from "react";
import { useTonWallet } from "@tonconnect/ui-react";
import { OpenedContract,  fromNano, toNano } from "ton-core";
import { Status } from "../Boarding/Info";
import { Kaomoji, sleep } from "../../../helpers";
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
import { Modal } from "../../../components/Modal";
import { InputTON } from "../../../components/InputTON";

import * as Icons from "../../../icons";

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

    const [modal, setModal] = useState(0b000);

    const { sender } = useTonConnect();

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

    async function sendDeposit(value: number) {
        await solo.content.account.content!.contract!.sendDeposit(sender, toNano(value));
        setModal(0);
        setState({ status: 'pending' });
        await waitForUpdate(solo.content.account.content.contract!, 5);
    }

    async function sendWithdraw(value: number) {
        await solo.content.account.content!.contract!.sendWithdraw(sender, toNano(0.05), toNano(value));
        setModal(0);
        setState({ status: 'pending' });
        await waitForUpdate(solo.content.account.content.contract!, 5);
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

    async function waitForUpdate(contract: OpenedContract<SoloAccount>, attempts: number) {
        if (attempts < 1) return;
        await sleep(5000);
        try {
            const balance = await contract.getMyBalance();
            if (Number(fromNano(balance)) !== state.balance) {
                return loadData(contract);
            }
            else {
                return waitForUpdate(contract, attempts - 1);
            }
        } catch(e) {}
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
    const days = Math.floor((Date.now() / 1000 - state.t0) / (60 * 24));

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
                <div className="row">
                    <div className="box action" onClick={() => setModal(0b001)}>
                        <Icons.Withdraw />
                        <h3 className="withdraw">Withdraw</h3>
                    </div>
                    <div className="box">
                        <ProgressBar progress={progress}/>
                        {progress
                            ? <h3>{(progress * 100).toFixed(2)}% progress</h3>
                            : <h3><Animations.Terminal /> progress</h3>
                        }
                    </div>
                    <div className="box action" onClick={() => setModal(0b010)}>
                        <Icons.Deposit />
                        <h3>&nbsp;Deposit&nbsp;</h3>
                    </div>
                </div>
                <div className="row">
                    <Statistics value={`${state.risk && risk2comission(state.risk)}`} status={state.status} class="value">Risk</Statistics>
                    <Statistics value={`${state.bN?.toFixed(2)}/${state.goalAmount?.toFixed(2)}`} status={state.status} class="value">TON</Statistics>
                    <Statistics value={days} status={state.status} class="value">Days</Statistics>
                </div>
            </div>
           <div className="box">
                <button className="button-purple" onClick={() => setModal(0b100)}>Close Account</button>
           </div>
           {modal === 0b010 &&
            <Modal>
                <Deposit sendDeposit={sendDeposit} close={() => setModal(0)} />
            </Modal>
           }
           {modal === 0b001 &&
            <Modal>
                <Withdraw sendWithdraw={sendWithdraw} risk={state.risk!} balance={state.balance!} close={() => setModal(0)} />
            </Modal>
           }
           {modal === 0b100 &&
            <Modal>
                <Close sendClose={closeAccount} close={() => setModal(0)} balance={state.balance!} risk={state.risk!} grade={Number(state.grade!)} />
            </Modal>
           }
        </div>
    );

}

function ProgressBar(props: { progress?: number }) {
    console.log(props.progress);
    
    return (
        <div className="bordered progress-bar">
            {props.progress !== undefined && !isNaN(props.progress) && props.progress > 0.01 &&
                <div className="progress" style={{ width: `${props.progress * 100}%` }}>
                </div>
            }
        </div>
    );
}

function Hero() {
    return (
        <div className={`box box-black-purple bordered bordered-purple hero-content`}>
            <div className="reflecting">{Kaomoji.REFLECTED.SUNGLASSES}</div>
        </div>
    );
}

function Deposit(props: { sendDeposit: (value: number) => Promise<void>, close: () => void }) {

    const [deposit, setDeposit] = useState(1);

    const setDepositState = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        // Update state
        setDeposit(value);
    }

    return (
        <div className="box box-blue bordered bordered-blue shadowed account-action">
            <div className="row float-near-border header">
                <h2>Deposit</h2>
                <Icons.Close close={props.close} />
            </div>
            <div className="box box-black bordered bordered-black shadowed-green target">
                <InputTON value={deposit} onChange={setDepositState} />
            </div>
            <p className="description">We do not charge gas fees. All unspent gas expenses will be deposited to your account</p>
            <button className="button-blue" onClick={() => props.sendDeposit(deposit)}>Send</button>
        </div>
    )
}

function Withdraw(props: { sendWithdraw: (value: number) => Promise<void>, risk: number, balance: number, close: () => void }) {

    const max = props.balance / (1 + (1 / (1 << props.risk))) - 0.05;    

    const [withdraw, setWithdraw] = useState(Math.min(1, max));

    const comission = withdraw / (1 << props.risk);

    const setWithdrawState = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        // Update state
        setWithdraw(Math.min(value, max));
    }

    return (
        <div className="box box-purple bordered bordered-purple shadowed account-action">
            <div className="row float-near-border header">
                <h2>Withdraw</h2>
                <Icons.Close close={props.close} />
            </div>
            <div className="box box-black bordered bordered-black shadowed-green target">
                <InputTON value={Number(fromNano(toNano(withdraw)))} onChange={setWithdrawState} />
            </div>
            <p>Max amount to withdraw is {fromNano(toNano(max))} TON</p>
            <p>Comission is {fromNano(toNano(comission))} TON</p>
            <p className="description">We do not charge gas fees. All unspent gas expenses will be deposited to your account</p>
            <button className="button-purple" onClick={() => props.sendWithdraw(withdraw)}>Receive</button>
        </div>
    )
}

function Close(props: { sendClose: () => Promise<void>, risk: number, balance: number, close: () => void, grade: number }) {

    const max = props.balance / (1 + (1 / (1 << props.risk))) - 0.05;

    const comission = max / (1 << props.risk);

    return (
        <div className="box box-purple bordered bordered-purple shadowed account-action">
            <div className="row float-near-border header">
                <h2>Close Account</h2>
                <Icons.Close close={props.close} />
            </div>
            <p>Account will be deleted. You'll get {fromNano(toNano(max))} TON and {props.grade} Grade to your wallet</p>
            <p>Comission is {fromNano(toNano(comission))} TON</p>
            <p className="description">We do not charge gas fees. All unspent gas expenses will be deposited to your account</p>
            <button className="button-purple" onClick={() => props.sendClose()}>Submit</button>
        </div>
    )
}