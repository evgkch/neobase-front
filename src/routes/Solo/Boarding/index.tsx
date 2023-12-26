import "./style.css"
import { Info } from './Info'
import { Title } from "./Title"
import { useNavigate } from "react-router-dom";
import { useTonWallet } from "@tonconnect/ui-react";
import WebApp from "@twa-dev/sdk";
import { useEffect, useState } from "react";
import solo from "../../../model/solo";
import { status } from "../../../helpers/state";
import { Colors } from "../../../helpers/colors";
import { Modal } from "../../../components/Modal";
import { ModalLoader } from "../../../components/Loader/Loader";
export { Target } from './Target';
export { Risk } from './Risk';
export { Hero } from './Hero';

export const Boarding = () => {

    const [loading, setLoader] = useState<false | string>(false);

    const navigate = useNavigate();

    const wallet = useTonWallet();

    let next: any;
    
    // Telegram Navigation
    useEffect(() => {

        const back = () => navigate(-1);
        WebApp.BackButton.show();
        WebApp.BackButton.onClick(back);
        
        next = async () => {
            if (wallet) {
                switch(solo.content.account.content[status]) {
                    case 'init':
                        setLoader('checking contract status...');
                        await solo.openAccount(wallet);
                        break;
                    case 'opened':
                        resolveOpenedAccount();
                        break;
                }
            }
            else {
                WebApp.showPopup({ title: '(シ_ _)シ', message: `Please, connect Wallet!` });
            }
        };

        const unsubscribe = solo.content.account.rx.on('opened', () => {
            resolveOpenedAccount();
        });

        function resolveOpenedAccount() {
            if (solo.content.account.content.deployed) {
                if (import.meta.env.DEV) {
                    navigate('/solo/account')
                }
                else {
                    WebApp.showConfirm('You already have Account. Go?', (confirmed) => {
                        if (confirmed) navigate('/solo/account');
                    });
                }
            }
            else {
                navigate('/solo/target');
            }
        }

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
            solo.content.account.rx.off('opened', unsubscribe);
        }
    }, [])

    return (
        <div className="boarding">
            <Title />
            <Info />
            <Guide />
            {import.meta.env.DEV && <button className="button-green-acid" onClick={() => next && next()}>Next</button>}
            {loading &&
                <Modal>
                    <div className="modal-content">
                        <ModalLoader info={loading} />
                    </div>
                </Modal>
            }
        </div>
    )
}

function Guide() {
    return (
        <div className="box box-white bordered bordered-white shadowed guide ">
            <h2>How to Start?</h2>
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