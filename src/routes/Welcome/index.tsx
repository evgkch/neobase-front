import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import neobaseLogo from '/neobase.png'
import './style.css'
import WebApp from "@twa-dev/sdk";
//import { useEffect } from 'react';

export const Welcome = () => {

    WebApp.expand();
    WebApp.setHeaderColor("#1946e6");

    const navigate = useNavigate();

    useEffect(() => {
        const cx = setTimeout(navigate, 2000, 'main');
        return () => clearTimeout(cx);
    });

    return (
        <div className='welcome'>
            <img src={neobaseLogo} className="logo" alt="Neobase logo" />
            <p>neobase</p>
        </div>
    )
}