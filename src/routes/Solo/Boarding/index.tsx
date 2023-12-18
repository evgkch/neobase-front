import "./style.css"
import { Info } from './Info'
import { Title } from "./Title"
import { Story } from "../../../components/Story";
export { Target } from './Target';
export { Risk } from './Risk';
export { Hero } from './Hero';

export const Boarding = () => {
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
        </div>
    )
}

function Guide() {
    return (
        <div className="box box-white guide">
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