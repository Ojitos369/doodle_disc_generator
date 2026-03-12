import { Outlet } from "react-router-dom";
import { SideBar } from "../../Components/SideBar";
import { MenuBar } from "../../Components/MenuBar";
import { Header } from "../../Components/Header";
import { localStates, localEffects } from "./localStates";


export const Main = props => {
    const { style, openSectionClass } = localStates();
    localEffects();

    return (
        <div className={`${style.mainPage}`}>
            <div className={`${style.headerContent}`}>
                <Header />
            </div>
            <div className={`${style.pageContent}`}>
                <SideBar />
                <section className={`${style.sectionContainer}`}>
                    <div className={`${style.contentContainer}`}>
                        <div className={`${style.outletContainer}`}>
                            <div className={`${style.outlet}`}>
                                <Outlet />
                            </div>
                        </div>
                    </div>
                </section>
                <MenuBar />
            </div>
        </div>
    )
}
