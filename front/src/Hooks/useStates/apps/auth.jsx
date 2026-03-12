export const auth = props => {
    const { miAxios, pjid, s, u1, u2, urs } = props

    const login = (usuario, passwd) => {
        if (s.loadings?.auth?.login) return;
        u2("loadings", "auth", "login", true);
        const url = "auth/login"
        const data = {
            usuario, passwd
        }
        miAxios.post(url, data)
        .then(response => {
            console.log(response.data);
            const { user, token } = response.data;
            u2("auth", "form", "usuario", "");
            u2("auth", "form", "passwd", "");
            u1("auth", "logged", true);
            u1("usuario", "data", user);

            // set cookie unqvs for 12 hr
            const date = new Date();
                                // ms  *  s  *  m  *  h
            const miliseconds = 1000 * 60 * 60 * 12;
            date.setTime(date.getTime() + (miliseconds));
            const dateExpired = date.toUTCString();
            const expires = 'expires=' + dateExpired
            const miCookie = pjid + "=" + token + ";" + expires + ";path=/";
            document.cookie = miCookie;

        }).catch(error => {
            console.log(error);
            const message = error.response.data.detail || "error";
            general.notificacion({
                message,
                title: "Error",
                mode: "danger"
            })
            u1("auth", "logged", false);

        }).finally(() => {
            u2("loadings", "auth", "login", false);
        })
    }

    const validateLogin = () => {
        if (s.loadings?.auth?.validateLogin) return;
        u2("loadings", "auth", "validateLogin", true);
        const end = 'auth/validate_login';
        miAxios.get(end)
        .then(res => {
            const { user, token } = res.data;
            // set cookie unqvs for 5 hr
            const date = new Date();
                                // ms  *  s  *  m  *  h
            const miliseconds = 1000 * 60 * 60 * 5;
            date.setTime(date.getTime() + (miliseconds));
            const dateExpired = date.toUTCString();
            const expires = 'expires=' + dateExpired
            const miCookie = pjid + "=" + token + ";" + expires + ";path=/";
            document.cookie = miCookie;
            u1("auth", "logged", true);
            u1("usuario", "data", user);
        })
        .catch(err => {
            auth.closeSession();
        }).finally(() => {
            u2("loadings", "auth", "validateLogin", false);
        });
    }

    const closeSession = () => {
        if (s.users?.logged) {
            const end = 'auth/close_session';
            miAxios.get(end)
            .then(res => {
                console.log(res.data);
            });
        }
        urs();
        document.cookie = pjid + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
    }

    return {
        login, validateLogin, closeSession
    }
}