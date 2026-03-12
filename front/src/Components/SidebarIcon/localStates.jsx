import { useMemo } from "react";
import { useStates } from "../../Hooks/useStates";
import style from './styles/index.module.scss';

export const localStates = () => {
    const { f, s } = useStates();
    const sidebarOpen = useMemo(() => s.sidebar?.open ?? false, [s.sidebar?.open]);

    const toggleSidebar = e => {
        if (!!e) {
            e.preventDefault(); 
            e.stopPropagation();
        }
        f.u1('sidebar', 'open', !sidebarOpen);
    }
    return {
        style, 
        sidebarOpen, toggleSidebar
    }
}