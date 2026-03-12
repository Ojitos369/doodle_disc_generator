import { useMemo, useEffect } from "react";
import { useStates, createState } from "../../Hooks/useStates";
import { pages } from "../../Core/helper";
import style from './styles/index.module.scss';

export const localStates = () => {
    const { f, s } = useStates();

    const actualPage = useMemo(() => s.page?.actual || '', [s.page?.actual]);
    const actualMenu = useMemo(() => s.page?.actualMenu || '', [s.page?.actualMenu]);
    const { prod_mode, dev_mode } = useMemo(() => s.app?.modes ?? {}, [s.app?.modes]);
    const isInMd = useMemo(() => s.app?.general?.isInMd, [s.app?.general?.isInMd]);
    const [sidebarOpen, setSidebarOpen] = createState(['sidebar', 'open'], false);
    const [menusAbiertos, setMenusAbiertos] = createState(['sidebar', 'menusAbiertos'], {});
    const [menuBarMode, setMenuBarMode] = createState(['menubar', 'menuMode'], null);

    const elementos = useMemo(() => {
        return pages.map(page => {return {...page, opened: menusAbiertos[page.menu_name]}})
    }, [menusAbiertos, pages]);

    const toggleMenu = menu => {
        setMenusAbiertos({ [menu]: !menusAbiertos[menu] });
    }

    return {
        style,
        prod_mode, dev_mode, isInMd,
        actualPage,
        toggleMenu, 
        sidebarOpen, setSidebarOpen,
        setMenusAbiertos,
        elementos, actualMenu, 
        setMenuBarMode, 
    }
}

export const localEffects = () => {
    const { actualMenu, setMenusAbiertos } = localStates();

    useEffect(() => {
        setMenusAbiertos({ [actualMenu]: true });
    }, [actualMenu]);
}