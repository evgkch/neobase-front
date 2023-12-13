import WebApp from "@twa-dev/sdk";
import { Header } from "../../components/Header"
import "./style.css"
import { Banner } from "../../components/Banner";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTonWallet } from "@tonconnect/ui-react";

export function Main() {

    const wallet = useTonWallet();
    const navigate = useNavigate();

    useEffect(() => {
        WebApp.MainButton.hide();
        WebApp.BackButton.hide();
    })

    const onSoloClick = () => wallet
        ? navigate('/solo')
        : WebApp.showPopup({ title: 'Tip', message: 'Connect Wallet first' });

    return (
        <div className="main">
            <Header />
            <div className="content">
                <Balance />
                <Banner
                    title="Solo Challenge"
                    description="Start to save coins in comfortable way. Test version avaliable now"
                    onClick={onSoloClick}
                />
            </div>
        </div>
    );
}

function Balance() {

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const cx = setTimeout(setLoaded, 2000, true);
        return () => clearTimeout(cx);
    })

    return (
        <div className="total-balance">
            <p>Total balance</p>
            <div className="total-balance-value">
                <div className={loaded ? '' : 'loading'}>{loaded ? '0' : ''}</div>
                <div>TON</div>
            </div>
        </div>
    )
}