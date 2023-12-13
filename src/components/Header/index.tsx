import { TonConnectButton } from '@tonconnect/ui-react'
import WebApp from '@twa-dev/sdk';
import "./style.css"

const Avatar = (props: { src?: string }) => {
    return props.src
        ? <img className='avatar' src={props.src} alt='٩(◕‿◕)۶' />
        : <div className='avatar'></div>
}

const Username = (props: { name?: string }) => {
    return <div>@{props.name ?? 'anonymus'}</div>
}

const User = () => (
    <div className='user'>
        <Avatar src={WebApp.initDataUnsafe.user?.photo_url} />
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