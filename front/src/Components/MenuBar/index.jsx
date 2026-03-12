import { localStates, localEffects } from "./localStates";

export const MenuBar = props => {
    const { style, Component, menubarOpen } = localStates();
    localEffects();

    return (
        <div className={`${style.menuBarContent} ${!menubarOpen && style.hiddeBar}`}>
            {Component && <Component />}
        </div>
    )
}
/* 

*/