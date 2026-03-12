import { useEffect, useMemo } from 'react';
import { useStates } from '../../Hooks/useStates';
import style from './styles/index.module.scss';

export const P401 = () => {
    const { f } = useStates();
    useEffect(() => {
        f.u1('page', 'actual', '401 Unauthorized');
        f.u1('page', 'title', '401 Unauthorized');
        f.u1('page', 'actualMenu', '401');
    }, []);

    return (
        <div>
            <div className={`${style.p401Page}`}>401 Unauthorized</div>
        </div>
    );
};