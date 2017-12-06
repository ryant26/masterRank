/* eslint no-console: 0*/
/* eslint no-undef:0 */
const logger = {
    log(msg) {
        if(__DEV__) {
            console.log(msg);
        }
    },

    warn(msg) {
        if (__DEV__) {
            console.warn(msg);
        }
    },

    error(msg) {
        if (__DEV__) {
            console.error(msg);
        }
    }
};

export default logger;