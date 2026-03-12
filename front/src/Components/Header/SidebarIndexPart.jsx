import { localStates } from "./localStates";
import { SidebarIcon } from "../SidebarIcon";

export const SidebarIndexPart = () => {
    const { logo, style } = localStates();
    return (
        <div className={`${style.menuIndexPart}`}>
            <div className={`${style.sidebarIcon}`}>
                <SidebarIcon />
            </div>
        </div>
    )
}