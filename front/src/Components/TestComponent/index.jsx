import { localStates, indexEffects } from "./localStates"
export const Test = props => {
    const { style } = localStates();
    indexEffects();

    return (
        <div className={`${style.testComponent}`}>
            Test Component
        </div>
    )
}
