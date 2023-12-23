import React from "react"
import { NavigateFunction, useNavigate } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import { Kaomoji, sleep } from "../../../../helpers";
import { Colors } from "../../../../helpers/colors";

import "./style.css"

import { Sender, toNano } from "ton-core";
import { useTonConnect } from "../../../../hooks/useTonConnect";
import solo from "../../../../model/solo";
import { useTonWallet, Wallet, WalletInfoWithOpenMethod } from "@tonconnect/ui-react";
import { Modal } from "../../../../components/Modal";
import { ModalLoader } from "../../../../components/Loader/Loader";

const risk2comission = (risk: number) => (100 / (1 << risk)).toFixed(2) + '%';

interface Props {
    wallet: Wallet | (Wallet & WalletInfoWithOpenMethod) | null,
    navigate: NavigateFunction,
    sender: Sender
}

interface State {
    loading: string | false
}

export const Submit = () => {

    const wallet = useTonWallet();

    const navigate = useNavigate();

    const { sender } = useTonConnect();

    return <Component wallet={wallet} navigate={navigate} sender={sender} />;

}

class Component extends React.Component<Props, State> {

    setLoader = (loading: string | false) => {
        this.setState({ loading });
    }

    sendCreateAccount = async () => {
        return await solo.content.master.content.contract?.sendCreateAccount(this.props.sender, toNano(0.1), {
            goalAmount: toNano(solo.content.boarding.content.goalAmount),
            risk: solo.content.boarding.content.risk,
            heroId: 1
        });
    }

    unsafeWaitForAccountDeploy = async (): Promise<boolean> => {
        try {
            await solo.content.account.checkIsDeployed();
            if (!solo.content.account.content.deployed) {
                await sleep(5000);
                return this.unsafeWaitForAccountDeploy();
            }
            else {
                return true;
            }
        } catch(e) {
            return false;
        }
    }

    next = async () => {
        if (this.state.loading) return;
        if (solo.content.account.content.deployed)
            return WebApp.showPopup({ title: '(シ_ _)シ', message: `You already have the Account` }); 
        if (!this.props.wallet)
            return WebApp.showPopup({ title: '(シ_ _)シ', message: `Please, connect Wallet!` });
        // IF Not Loading -> Not deployed -> Wallet connected
        this.setLoader('waiting for transaction confirmation...');
        try {
            await solo.content.master.content.contract?.sendCreateAccount(this.props.sender, toNano(0.1), {
                goalAmount: toNano(solo.content.boarding.content.goalAmount),
                risk: solo.content.boarding.content.risk,
                heroId: 1
            });
            this.setLoader('waiting for Account creation...');
            await this.unsafeWaitForAccountDeploy();
            this.props.navigate('/solo/account');

        } catch(e) {
            this.setLoader(false);
            WebApp.showPopup({ title: '(シ_ _)シ', message: `Confirm transaction to create account` });
        }
    }

    back = () => this.props.navigate(-1)

    componentDidMount(): void {
        // Back button
        WebApp.BackButton.show();
        WebApp.BackButton.onClick(this.back);
        // Main button
        WebApp.MainButton.enable();
        WebApp.setHeaderColor(Colors.BLUE);
        WebApp.MainButton.setText(`${Kaomoji.REFLECTED.MAGIC} do magic`);
        WebApp.MainButton.onClick(this.next);
        WebApp.MainButton.show();
    }

    componentWillUnmount(): void {
        WebApp.BackButton.offClick(this.back);
        WebApp.MainButton.offClick(this.next);
    }

    render() {
        return (
            <div className="boarding">
                <div className="box box-black-purple bordered shadowed-purple card">
                    <div className="row float-near-border info">
                        <h2>{solo.content.boarding.content.goalAmount} TON</h2>
                        <h2>RISK {risk2comission(solo.content.boarding.content.risk)}</h2>
                    </div>
                    <div className="row float-near-border hero">
                        <h1 className="reflecting">{solo.content.boarding.content.hero}</h1>
                    </div>
                    {import.meta.env.DEV && <button onClick={this.next}></button>}
                </div>
                {this.state.loading &&
                    <Modal>
                        <ModalLoader info={this.state.loading} />
                    </Modal>
                }
            </div>
        )
    }

}