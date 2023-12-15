import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
// import neobaseLogo from '/neobase.png'
import './style.css'
import WebApp from "@twa-dev/sdk";
import { Colors } from "../../helpers/colors";
import { Animations } from "../../components/Loader/Loader";
//import { useEffect } from 'react';

export const Welcome = () => {

    WebApp.expand();
    WebApp.setHeaderColor(Colors.BLUE);

    const navigate = useNavigate();

    useEffect(() => {
        const cx = setTimeout(navigate, 2000, '/main');
        return () => clearTimeout(cx);
    });

    return (
        <div className='welcome'>
            <h1 className="logo">nb <Animations.Terminal/> </h1>
            {/* <img src={neobaseLogo} className="logo" alt="Neobase logo" /> */}
            <p>neobase</p>
        </div>
    )
}