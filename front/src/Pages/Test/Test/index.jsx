import { localStates, indexEffects } from "./localStates";
import { ViewTransition } from "react";

export const Test = () => {
    const { styles } = localStates();
    indexEffects();

    return (
        <ViewTransition default="moveFront">
            <div className={`${styles.testPage}`}>
                <h1 className={`${styles.h1Component}`}>Test Component</h1>
            </div>
        </ViewTransition>
    );
};