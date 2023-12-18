import {  useState } from "react";
import {  } from "@tonconnect/ui-react";
import { OpenedContract,  toNano } from "ton-core";
import { Status } from "../Boarding/Info";
import { Kaomoji } from "../../../helpers";
import { Animations } from "../../../components/Loader/Loader";
import { SoloAccount } from "neobase/wrappers/SoloAccount";
import { useTonConnect } from "../../../hooks/useTonConnect";

interface State {
    status: Status
    balance?: string,
    goalAmount?: string,
    restAmount?: string,
    risk?: number,
    t0?: number,
    tN?: number,
    bN?: string,
    grade?: bigint
}

let acc: OpenedContract<SoloAccount>;

export const Account = () => {

    // const wallet = useTonWallet();

    const [state] = useState<State>({ status: 'pending' });

    const { sender } = useTonConnect();

    const [deposit, setDeposit] = useState(0);

    // useEffect(() => {
    //     if (wallet?.account && solo) {
    //         solo.getAccountAddress(
    //             Address.parse(wallet.account.address)
    //         ).then(address => openContract(new SoloAccount(address)).then(account => {
    //             acc = account;
    //             Promise.all([
    //                 account.getMyBalance(),
    //                 account.getGoalAmount(),
    //                 account.getRestAmount(),
    //                 account.getRisk(),
    //                 account.getT0(),
    //                 account.getTN(),
    //                 account.getBN(),
    //                 account.getGrade()
    //             ]).then(res => {
    //                 const [balance, goalAmount, restAmount, risk, t0, tN, bN, grade] = res;
    //                 setState({
    //                     ...state,
    //                     balance: fromNano(balance),
    //                     goalAmount: fromNano(goalAmount),
    //                     restAmount: fromNano(restAmount),
    //                     risk,
    //                     t0,
    //                     tN,
    //                     bN: fromNano(bN),
    //                     grade,
    //                     status: 'loaded'
    //                 });
    //             })
    //         }));

    //     }
    // }, [wallet?.account, solo]);

    const onGoalAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.floor(Number(event.target.value));

        // Update state
        setDeposit(value);
    }
    

    return (
        <div className="balance box box-blue float-left">
            <div className="row float-near-border">
                <div>Total balance</div>
                {state.status === 'loaded'
                    ? <div className="kaomoji status">{Kaomoji.CRYING}</div>
                    : <Animations.RunnigMan />
                }
            </div>
            <div className="value row float-left">
                {state.status === 'loaded'
                    ? <div>{state.bN}</div>
                    : <Animations.Terminal />
                }
                <div> TON</div>
            </div>
            <div className="box box-black-green target">
                <label>
                    <input
                        type="number"
                        step={1}
                        pattern="\d*"
                        inputMode="numeric"
                        // defaultValue={state.goalAmount}
                        onChange={onGoalAmountChange}
                        value={'' + deposit}
                        style={{ width: ('1' + deposit).length + 'ch' }}
                    />
                    <div>TON <Animations.Terminal /></div>
                </label>
            </div>
            <button onClick={() => acc.sendDeposit(sender, toNano(deposit))}>SEND</button>
        </div>
    );

}