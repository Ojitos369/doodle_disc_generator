import { localStates } from "./localStates";

export const UserPart = () => {
    const { openUserMenu, style, IconMenu, showIconMenu } = localStates();
    return (
        <div className={`${style.userPart}`}>
            {showIconMenu && <IconMenu className="manita" onClick={openUserMenu} />}
        </div>
    )
}