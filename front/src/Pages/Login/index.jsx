import { useState, useEffect, useRef, useMemo } from 'react';
import { useStates } from '../../Hooks/useStates';
import style from './styles/index.module.scss';

const myStates = () => {
    const { s, f } = useStates();
    const usuario = useMemo(() => s.auth?.form?.usuario ?? '', [s.auth?.form?.usuario]);
    const passwd = useMemo(() => s.auth?.form?.passwd ?? '', [s.auth?.form?.passwd]);

    const updateUsuario = (e) => {
        const value = e.target.value;
        f.u2("auth", "form", "usuario", value);
    }
    const updatePasswd = (e) => {
        const value = e.target.value;
        f.u2("auth", "form", "passwd", value);
    };

    const login = e => {
        if (!!e) e.preventDefault();
        f.auth.login(usuario, passwd);
    }

    return {
        usuario, passwd, updateUsuario, updatePasswd, login
    }
}

export const Login = () => {
    const { usuario, passwd, updateUsuario, updatePasswd, login } = myStates();
    return (
        <div className={`${style.loginPage}`}>
            <div className={`${style.logoPart}`}>
                <div className={`${style.logo}`}></div>
            </div>
            <form className={`${style.formContainer}`} onSubmit={login}>
                <div className={`${style.inputElement} w-full md:w-1/3`}>
                    <label>Usuario</label>
                    <input type="text" placeholder='usuario' value={usuario} onChange={updateUsuario} />
                </div>
                <div className={`${style.inputElement} w-full md:w-1/3`}>
                    <label>Contraseña</label>
                    <input type="password" placeholder='contraseña' value={passwd} onChange={updatePasswd} />
                </div>
                <div className={`${style.inputElement} w-full md:w-1/3`}>
                    <input type="submit" value='ingresar' className={`${style.submit}`} />
                </div>
            </form>
        </div>
    );
};
