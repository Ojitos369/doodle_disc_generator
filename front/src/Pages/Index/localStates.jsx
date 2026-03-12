import { useMemo, useEffect } from 'react';
import { useStates, createState } from '../../Hooks/useStates';
import styles from './styles/index.module.scss';


export const localStates = props => {
    const { ls, lf, s, f } = useStates();
    const theme = useMemo(() => ls.theme, [ls.theme]);
    const { prod_mode, dev_mode } = useMemo(() => s.app?.modes ?? {}, [s.app?.modes]);
    const actualTheme = useMemo(() => ls.theme, [ls.theme]);
    const [modalMode, setModalMode] = createState(['changeTheme', 'modalMode'], "N");
    const [showModal, setShowModal] = createState(['changeTheme', 'showModal'], false);
    const [menubarOpen, setMenuBarOpen] = createState(['menubar', 'open'], false);
    const [titulo, setTitulo] = createState(['page', 'title'], "");
    const [actualPage, setActualPage] = createState(['page', 'actual'], "");
    const hhMessage = useMemo(() => s.app?.hh?.response?.message, [s.app?.hh?.response?.message]);
    const [menuBarMode, setMenuBarMode] = createState(['menubar', 'menuMode'], null);
    const isInMd = useMemo(() => s.app?.general?.isInMd, [s.app?.general?.isInMd]);

    const init = () => {
        f.app.helloWorld();
        setTitulo("Index");
        setActualPage("index");
        setMenuBarMode('menuBarDefault');
        setMenuBarOpen(isInMd);
    }

    const toggleNot = () => {
        f.general.notificacion({
            mode: 'info',
            title: 'Cambio Thema',
            message: `Thema Cambiado a: ${theme}`
        });
    }

    const toggleModalMode = () => {
        setModalMode(modalMode === "M" ? "N" : "M");
    }

    const toggleShowModal = () => {
        setShowModal(!showModal);
    }

    const changeTheme = () => {
        lf.toggleTheme();
    }

    const closeSession = () => {
        f.auth.closeSession();
    }

    const elementos = useMemo(() => {
        return [
            {name: `Theme: ${actualTheme}`, action: changeTheme},
            {name: `Cerrar Sesion`, action: closeSession},
        ]
    }, [actualTheme, changeTheme]);

    return {
        init, toggleNot, 
        styles,
        theme, toggleModalMode, toggleShowModal, 
        showModal, modalMode, 
        hhMessage,
        menubarOpen, changeTheme, elementos, 
    }
}

export const indexEffect = props => {
    const { init, toggleNot, theme, showModal } = localStates();

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if (!showModal) return;
        toggleNot();
    }, [theme, showModal]);
}