import { ReactNode, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import WebApp from "@twa-dev/sdk";
import { Kaomoji } from "../../../../helpers";
import { Colors } from "../../../../helpers/colors";

import "./style.css"
import solo from "../../../../model/solo";

const risk2comission = (risk: number) => (100 / (1 << risk)).toFixed(2) + '%';

const heroes = [
    Kaomoji.REFLECTED.LOADING,
    Kaomoji.REFLECTED.SUNGLASSES,
    Kaomoji.REFLECTED.DOUBT,
    Kaomoji.REFLECTED.PARTY,
    Kaomoji.REFLECTED.WOW,
    Kaomoji.REFLECTED.RABBIT,
    Kaomoji.REFLECTED.BEAR,
    Kaomoji.REFLECTED.CAT,
    Kaomoji.REFLECTED.HUGS,
    Kaomoji.REFLECTED.CONFUSION
] as const;

export const Hero = () => {

    const [hero, setHero] = useState(solo.content.boarding.content.hero);

    const navigate = useNavigate();

    useEffect(() => {

        const back = () => navigate(-1);
        WebApp.BackButton.show();
        WebApp.BackButton.onClick(back);

        const next = () => navigate('/solo/check');
        WebApp.MainButton.enable();
        WebApp.setHeaderColor(Colors.BLUE);
        WebApp.MainButton.setText(`ok ${Kaomoji.REFLECTED.YEEE} check`);
        WebApp.MainButton.onClick(next);
        WebApp.MainButton.show();

        return () => {
            WebApp.BackButton.offClick(back);
            WebApp.MainButton.offClick(next);
        }
    }, []);

    return (
        <div className="boarding">
            <div className="box box-white guide">
                <ol>
                    <li>Target is {solo.content.boarding.content.goalAmount} TON</li>
                    <li>Risk is {risk2comission(solo.content.boarding.content.risk)}</li>
                </ol>
            </div>
            <div className="box box-white">
                <div className="row float-near-border">
                        <b>Choose Hero</b>
                </div>
                <div className="row float-near-border">
                    <div>Just character, nothing more!</div>
                </div>
            </div>
            <div className="in-2-columns scroll-box">
                {heroes.map(item =>
                    <HeroItem
                        key={item}
                        content={item}
                        selected={hero === item}
                        select={() => { setHero(item); solo.content.boarding.update({ hero: item }) }}
                    />
                )}
            </div>
        </div>
    )
}

export function HeroItem(props: { content: string, children?: ReactNode, selected: boolean, select: () => void }) {
    return (
        <div className={`box ${props.selected ? 'box-green-acid hero-selected' : 'box-black-green'} hero-content`} onClick={props.select}>
            <div className="reflecting">{props.content}</div>
            {props.children}
        </div>
    );
}