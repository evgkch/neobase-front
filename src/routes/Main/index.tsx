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
        : WebApp.showPopup({ title: '(シ_ _)シ', message: `Please, connect Wallet!` });

    return (
        <div className="main">
            <Header />
            <div className="content">
                <Balance />
                <Banner
                    title="🥹 Solo Challenge #1"
                    description="Start to save coins in comfortable way. Test version avaliable now"
                    go={onSoloClick}
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
            <div>Total balance</div>
            <div className="total-balance-value">
                <div className={loaded ? '' : 'loading'}>{loaded ? '0' : ''}</div>
                <div>TON</div>
                <div className="status">{loaded ? "	(个_个)" : "(⌐■_■)"}</div>
            </div>
        </div>
    )
}