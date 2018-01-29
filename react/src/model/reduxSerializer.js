export const loadState = () => {
    let initialState = {};
    try {
        let serializedState = localStorage.getItem("state");

        if (serializedState === null) {
            return initialState;
        }

        return JSON.parse(serializedState);
    }
    catch (err) {
        return initialState;
    }
};

export const saveState = (state) => {
    try {
        let serializedState = JSON.stringify({
            user: state.user,
            preferredHeroes: state.preferredHeroes,
            heroFilters: state.heroFilters,
            platform: state.platform,
            region: state.region,
        });

        localStorage.setItem("state", serializedState);
    }
    catch (err) {
        return err;
    }
};

