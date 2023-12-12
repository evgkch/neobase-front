import WebApp from "@twa-dev/sdk";
import { Header } from "../../components/Header"
import "./style.css"

export function Main() {

    WebApp.setHeaderColor("#18191F");
    WebApp.MainButton.disable();

    return (
        <div className="main">
            <Header />
            <div className="content">
                <h1>Comming Soon</h1>
            </div>
        </div>
    );
}