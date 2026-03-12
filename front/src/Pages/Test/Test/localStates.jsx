
import { useEffect } from 'react';
import { createState } from '../../../Hooks/useStates';
import styles from './styles/index.module.scss';
import stylesGen from '../styles/index.module.scss';


export const localStates = props => {
    const [titulo, setTitulo] = createState(['page', 'title'], "");
    const [actualPage, setActualPage] = createState(['page', 'actual'], "");
    
    const init = () => {
        setTitulo("test");
        setActualPage("test");
        console.log("index effect page");
    }


    return { 
        styles, stylesGen,
        init,
    }
}

export const indexEffects = () => {
    const { init } = localStates();
    
    useEffect(() => {
        init();
    }, []);

}