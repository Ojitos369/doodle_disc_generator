import { localStates, localEffects } from './localStates';

export const ZBase = () => {
    const { styles } = localStates();
    localEffects();

    return (
        <div className={`${styles.zbasePage}`}>
            ZBase
        </div>
    );
};
