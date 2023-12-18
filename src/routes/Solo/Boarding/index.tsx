import "./style.css"
import { Info } from './Info'
import { Title } from "./Title"
import { Story } from "../../../components/Story";
import { useNavigate } from "react-router-dom";
export { Target } from './Target';
export { Risk } from './Risk';
export { Hero } from './Hero';

export const Boarding = () => {
    const navigate = useNavigate();
    const next = () => {
        navigate('/solo/target')
    }
    return (
        <div className="boarding">
            <Title />
            <Info />
            <div className="scroll-box-x row stories">
                <section>
                    <Story title="What is Solo? " go={() => {}}/>
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
            <Guide />
            {import.meta.env.DEV && <button className="button-green-acid" onClick={next}>Next</button>}
        </div>
    )
}

function Guide() {
    return (
        <div className="box box-white bordered bordered-white shadowed guide ">
            <h2>How to Start?</h2>
            <ol>
                <li>Set Target Amount</li>
                <li>Choose Risk</li>
                <li>Create Hero</li>
                <li>Start to safe in comfortable way</li>
                <li>Get dNFT in the end to your wallet and start to receive dividends</li>
            </ol>
        </div>
    )
}