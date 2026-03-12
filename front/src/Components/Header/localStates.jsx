import { useMemo, useEffect } from "react";
import { useStates, createState } from "../../Hooks/useStates";
import style from './styles/index.module.scss';
import { ArrowLeft, ArrowRight } from '../Icons';

export const localStates = () => {
    const { f, lf, s } = useStates();

    const actualPage = useMemo(() => s.page?.actual || '', [s.page?.actual]);
    const { prod_mode, dev_mode } = useMemo(() => s.app?.modes ?? {}, [s.app?.modes]);
    const userMenu = useMemo(() => s.modals?.user?.menu, [s.modals?.user?.menu]);
    const username = useMemo(() => s.usuario?.data?.usuario, [s.usuario?.data?.usuario]);
    const isInMd = useMemo(() => s.app?.general?.isInMd, [s.app?.general?.isInMd]);
    const [menubarOpen, setMenubarOpen] = createState(['menubar', 'open'], false);
    const showIconMenu = useMemo(() => s.menubar?.menuMode, [s.menubar?.menuMode]);
    const pageTitle = useMemo(() => s.page?.title ?? '', [s.page?.title]);

    const openUserMenu = () => {
        // f.u1('menu', 'open', false);
        // f.u2('modals', 'user', 'menu', true);
        setMenubarOpen(!menubarOpen);
    }

    const IconMenu = useMemo(() => {
        return menubarOpen ? ArrowRight : ArrowLeft;
    }, [menubarOpen]);

    const changeTheme = () => {
        lf.toggleTheme();
    }

    const closeSession = () => {
        f.auth.closeSession();
        console.log("close session");
    }

    return {
        style, showIconMenu,
        closeSession, changeTheme,
        prod_mode, dev_mode,
        actualPage,
        userMenu, openUserMenu,
        username, menubarOpen, setMenubarOpen,
        pageTitle, IconMenu,
    }
}

export const localEffects = () => {
    const { showIconMenu, setMenubarOpen } = localStates();
    useEffect(() => {
        if (showIconMenu) {
            setMenubarOpen(true);
        }
    }, [showIconMenu]);
}