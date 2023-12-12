//import { useNavigate } from 'react-router-dom';
import neobaseLogo from '/neobase.png'
import './style.css'
//import { useEffect } from 'react';

export const Welcome = () => {
    return (
        <div className='welcome'>
            <img src={neobaseLogo} className="logo" alt="Neobase logo" />
            <p>neobase</p>
        </div>
    )
}