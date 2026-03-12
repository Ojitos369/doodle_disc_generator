export const app = props => {
    const { miAxios, u2, u1 } = props;

    const helloWorld = () => {
        const end = 'base/hh';
        const auth_code = "0e5a332d-9e2e-427d-bd84-4e581fe8a806"

        const header = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth_code}`
        }

        miAxios.get(end)
        .then(res => {
            console.log(res.data);
            u2("app", "hh", "response", res.data);
        })
        .catch(err => {
            console.log(err);
        });
    }

    const getModes = () => {
        const end = 'base/get_modes';
        miAxios.get(end)
        .then(res => {
            u1("app", "modes", res.data);
        })
        .catch(err => {
            console.log(err);
        });
    }

    return {
        helloWorld, getModes
    }
}

