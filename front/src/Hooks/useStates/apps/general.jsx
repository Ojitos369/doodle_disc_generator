export const general = props => {
    const { u1, u2 } = props;
    const notificacion = props => {
        u1("general", "notification", props);
        u2("modals", "general", "notification", true);
    }

    return {
        notificacion
    }
}

