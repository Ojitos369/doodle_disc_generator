import { localStates, indexEffects } from "./localStates";
export const Test = () => {
    const { style } = localStates();
    indexEffects();

    return (
        <div>
            <h1 className={`${style.h1Component}`}>Test Component</h1>
        </div>
    );
};