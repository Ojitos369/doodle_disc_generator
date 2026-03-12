import { useEffect, useMemo } from 'react';

import style from './styles/index.module.scss';

export const localStates = props => {
    return { style }
}

export const indexEffects = props => {
    useEffect(() => {
        console.log("index effect component");
    }, []);
}