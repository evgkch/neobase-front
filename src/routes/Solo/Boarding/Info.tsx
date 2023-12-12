interface Props {
    accountCounter: string,
    fundBalance: string
}

export const Info = (props: Props) => {
    return (
        <div>
            <h1>Solo start</h1>
            <p>You don’t think you should login first and behave like human not robot.</p>
            <Statistics {...props} />
            <Guide />
        </div>
    )
}

function Statistics(props: Props) {
    return (
        <div className="statistics">
            <div >
                <div>{props.accountCounter}</div>
                <div>accounts</div>
            </div>
            <div >
                <div>{props.fundBalance}</div>
                <div>TON saved</div>
            </div>
        </div>
    )
}

function Guide() {
    return (
        <ul className="guide">
            <li>Set Target Amount</li>
            <li>Choose Risk</li>
            <li>Create Hero</li>
            <li>Start to safe in comfortable way</li>
            <li>Get dNFT in the end to your wallet and start to receive dividends</li>
        </ul>
    )
}