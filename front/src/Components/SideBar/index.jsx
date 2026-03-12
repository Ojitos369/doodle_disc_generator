import { Link } from "react-router-dom";
import { Fragment } from "react";
import { localStates, localEffects } from "./localStates";

export const SideBar = props => {
    const { style, sidebarOpen, setSidebarOpen, toggleMenu, elementos, actualPage, isInMd, setMenuBarMode } = localStates();
    localEffects();

    return (
        <nav className={`${style.SideBarContent} ${!sidebarOpen && style.hiddeBar}`}>
            <li className={`${style.elementsList}`}>
                {elementos.map((ele, index) => {
                    const show = ele.show ?? true;
                    if (!show) return null;
                    return (
                        <Fragment key={index}>
                        <button 
                            className={`${style.link} ${ele.opened && style.linkSelected}`}
                            onClick={() => {
                                toggleMenu(ele.menu_name);
                            }}
                            >
                            {ele.name}
                        </button>
                        <div className={`${style.linksList} ${style[ele.menu_name]} ${ele.opened && style.linksListSelected}`}>
                            <div className={style.linksListContent}>
                                {ele.elements.map((ele2, index2) => {
                                    const show2 = ele2.show ?? true;
                                    if (!show2) return null;
                                    return (
                                        <Link 
                                            key={index2}
                                            className={`${style.linkPage} ${style.link} ${actualPage === ele2.page_name && style.linkSelected}`}
                                            to={ele2.to}
                                            onClick={() => {
                                                setMenuBarMode(ele2.menuBarMode);
                                                if (!isInMd) setSidebarOpen(false);
                                            }}
                                        >
                                            {ele2.name}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                        </Fragment>
                    )
                })}
            </li>
        </nav>
    )
}
/* */