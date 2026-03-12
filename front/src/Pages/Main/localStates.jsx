import { useMemo, useEffect, useState } from "react";
import { useStates, createState } from "../../Hooks/useStates";
import style from './style/index.module.scss';

export const localStates = () => {
    const { s } = useStates();
    // const sidebarOpen = useMemo(() => s.sidebar?.open, [s.sidebar?.open]);
    const [sidebarOpen, setSidebarOpen] = createState(['sidebar', 'open'], false);
    // const menubarOpen = useMemo(() => s.menubar?.open, [s.menubar?.open]);
    const [menubarOpen, setMenubarOpen] = createState(['menubar', 'open'], false);
    const [isInMd, setIsInMd] = createState(['app', 'general', 'isInMd'], window.innerWidth >= 768);
    const menuMode = useMemo(() => s.menubar?.menuMode, [s.menubar?.menuMode]);
    const [menuInit, setMenuInit] = useState(false);

    const init = () => {
        setSidebarOpen(isInMd);
        setIsInMd(window.innerWidth >= 768);
    }
    const startMenuMode = (isInMd, menuMode) => {
        setMenubarOpen(isInMd && menuMode);
        setMenuInit(true);
    }

    const openSectionClass = useMemo(() => {
        if (!sidebarOpen && !menubarOpen) return '';
        if (sidebarOpen && !menubarOpen) return 'sidebarOpen';
        if (!sidebarOpen && menubarOpen) return 'menubarOpen';
        return 'bothOpen';
    }, [sidebarOpen, menubarOpen]);

    return { 
        style, openSectionClass, init, isInMd, setIsInMd, 
        startMenuMode, menuMode, menuInit, 
    }
}

export const localEffects = () => {
    const { init, setIsInMd, startMenuMode, menuMode, isInMd, menuInit } = localStates();
    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsInMd(window.innerWidth >= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (menuInit) return;
        const md = (isInMd ?? -1) === -1;
        const mm = (menuMode ?? -1) === -1;
        if (md || mm) return;
        startMenuMode(isInMd, menuMode);
    }, [menuMode, isInMd, menuInit]);
}