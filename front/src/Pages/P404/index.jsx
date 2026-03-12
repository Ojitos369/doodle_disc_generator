import { useEffect, useMemo } from 'react';
import { useStates } from '../../Hooks/useStates';
import style from './styles/index.module.scss';

export const P404 = () => {
    const { f } = useStates();
    useEffect(() => {
        // console.log("actualizando test")
        f.u1('page', 'actual', '404 Not Found');
    }, []);

    return (
        <div>
            <div className={`${style.p404Page}`}>404 Not Found</div>
        </div>
    );
};