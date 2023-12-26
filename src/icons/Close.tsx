export const Close = (props?: { close?: () => void }) => (
    <svg onClick={props?.close} className="icon close" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(45)">
        <path d="M12 5V19" stroke="#18191F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M5 12H19" stroke="#18191F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
)