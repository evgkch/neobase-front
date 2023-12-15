import "./style.css"
import { Info } from './Info'
import { Title } from "./Title"

export { Target } from './Target';
export { Risk } from './Risk';
export { Hero } from './Hero';

export const Boarding = () => {
    
    return (
        <div className="boarding">
            <Title />
            <Info />
        </div>
    )
}