export const clearAccessToken = () => {
    window.localStorage.removeItem('accessToken');
};

export const clearLocalStorage = () => {
    window.localStorage.clear();
};