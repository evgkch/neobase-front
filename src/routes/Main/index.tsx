import WebApp from "@twa-dev/sdk";
import { Header } from "../../components/Header"
import "./style.css"
import { Banner } from "../../components/Banner";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function Main() {

    const navigate = useNavigate();

    useEffect(() => {
        WebApp.MainButton.hide();
        WebApp.BackButton.hide();
    })

    return (
        <div className="main">
            <Header />
            <div className="content">
                <Banner
                    title="Solo Challenge"
                    description="Start to save coins in comfortable way. Test version avaliable now"
                    onClick={() => navigate('/solo')}
                />
            </div>
        </div>
    );
}