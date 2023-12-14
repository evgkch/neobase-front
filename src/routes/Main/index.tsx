import WebApp from "@twa-dev/sdk";
import { Header } from "../../components/Header"
import "./style.css"
import { Banner } from "../../components/Banner";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTonWallet } from "@tonconnect/ui-react";
import { Animations } from "../../components/Loader/Loader";
import { Kaomoji } from "../../helpers";

export function Main() {

    const wallet = useTonWallet();
    const navigate = useNavigate();

    useEffect(() => {
        WebApp.setHeaderColor("#1946e6");
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
                    color="green-acid"
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
        <div className="balance box box-white float-left">
            <div className="row float-near-border">
                <div>Total balance</div>
                {loaded
                    ? <div className="kaomoji status">{Kaomoji.CRYING}</div>
                    : <Animations.RunnigMan />
                }
            </div>
            <div className="value row float-left">
                {loaded
                    ? <div>0</div>
                    : <Animations.Terminal />
                }
                <div> TON</div>
            </div>
        </div>
    )
}