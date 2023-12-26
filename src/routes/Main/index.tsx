import WebApp from "@twa-dev/sdk";
import { Header } from "../../components/Header"
import "./style.css"
import { Banner } from "../../components/Banner";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Animations } from "../../components/Loader/Loader";
import { Kaomoji } from "../../helpers";
import { Colors } from "../../helpers/colors";
import { Story } from "../../components/Story";

export function Main() {

    const navigate = useNavigate();

    useEffect(() => {
        WebApp.setHeaderColor(Colors.BLACK);
        WebApp.MainButton.hide();
        WebApp.BackButton.hide();
    })

    const onSoloClick = () => navigate('/solo');

    return (
        <div className="main">
            <Header />
            <div className="content">
                <div className="scroll-box-x row stories">
                    <section>
                        <Story title="What is Neobase? " go={() => { WebApp.openLink('https://teletype.in/@neobase/intro', { try_instant_view: true }) }}/>
                    </section>
                    <section>
                        <Story title="What are Challenges? " go={() => { WebApp.openLink('https://teletype.in/@neobase/challenges', { try_instant_view: true }) }}/>
                    </section>
                    <section>
                        <Story title="How starts to receive devidens? " go={() => {}}/>
                    </section>
                    <section>
                        <Story title="What is Grade?" go={() => {}}/>
                    </section>
                    <section>
                        <Story title="More about Grade system " go={() => {}}/>
                    </section>
                    <section>
                        <Story title="A story will be there " go={() => {}}/>
                    </section>
                    <section>
                        <Story title="A story will be there " go={() => {}}/>
                    </section>
                    <section>
                        <Story title="A story will be there " go={() => {}}/>
                    </section>
                    <section>
                        <Story title="A story will be there " go={() => {}}/>
                    </section>
                </div>
                <Balance />
                <div className="scroll-box-x row banners">
                    <section>
                        <Banner
                            title="🥹 Solo Challenge #1"
                            description="Start to save coins in comfortable way. Test version avaliable now"
                            go={onSoloClick}
                            color="green-acid"
                        />
                    </section>
                    <section>
                        <Banner
                            title="🤟 Mass Challenge #1"
                            description="Start to save coins in comfortable way. Comming Soon. "
                            go={onSoloClick}
                            color="purple-acid"
                        />
                    </section>
                </div>
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
        <div className="balance box box-white bordered bordered-white shadowed float-left">
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