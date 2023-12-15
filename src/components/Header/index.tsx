import { TonConnectButton } from '@tonconnect/ui-react'
import WebApp from '@twa-dev/sdk';
import "./style.css"
import { Kaomoji } from '../../helpers';
import { Animations } from '../Loader/Loader';

const Username = (props: { name?: string }) => {
    return <div> @{props.name ?? 'anonymus'}</div>
}

const User = () => (
    <div className='user'>
        <Animations.ReflectingKaomoji
            class='avatar'
            content={Kaomoji.REFLECTED.SUNGLASSES}
        />
        <Username name={WebApp.initDataUnsafe.user?.username} />
    </div>
);

export const Header = () => {
    return (
        <header>
            <User />
            <TonConnectButton className='connect-wallet-button' />
        </header>
    );
  };