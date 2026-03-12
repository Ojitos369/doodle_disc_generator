import { SidebarIndexPart } from "./SidebarIndexPart";
import { UserPart } from "./UserPart";
import { localStates, localEffects } from "./localStates";


export const Header = props => {
    const { dev_mode, style, pageTitle } = localStates();
    localEffects();

    return (
        <header className={`${style.headerContent} ${dev_mode && style.devModeBC}`}>
            <SidebarIndexPart />
            {!!pageTitle && 
                <h1 className={`${style.pageTitle}`}>{pageTitle}</h1>
            }
            <UserPart />
        </header>
    )
}
/* 

*/