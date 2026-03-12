import { localStates } from "./localStates";
import { GeneralModal } from "../Modals/GeneralModal";

const Component = props => {
    const { style, username, closeSession, changeTheme } = localStates();
    return (
        <div className={`${style.menuUserContainer}`}>
            <p className={`${style.userTitle}`}>
                Hello
            </p>

            <div className={`${style.menuActions}`}>
                <button
                    type="button"
                    className={`${style.menuAction} ${style.chageTheme}`}
                    onClick={changeTheme}
                    aria-label="Cambiar tema"
                >
                    Cambiar tema
                </button>
            </div>
        </div>
    )
}


export const ModalUserMenu = () => {
    return (
        <GeneralModal
            lvl1="user"
            lvl2="menu"
            modal_container_w="modal_container_90"
            Component={Component}
        />
    )
}