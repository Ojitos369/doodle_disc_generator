import { localStates } from "./localStates";

export const MenuBarDefault = props => {
    const { styles, menubarOpen, changeTheme, elementos } = localStates();

    return (
        <li className={`${styles.elementsList}`}>
            {elementos.map((ele, index) => {
                const show = ele.show ?? true;
                if (!show) return null;
                return (
                    <button key={index}  onClick={ele.action} className={`${styles.link}`}>
                        {ele.name}
                    </button>
                )
            })}
        </li>
    )
}
/* 

*/