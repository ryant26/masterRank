import { mockLocalStorage } from 'utilities/test/mockingUtilities';

import { clearAccessToken, clearLocalStorage} from 'utilities/localStorage/localStorageUtilities';

describe('clearAccessToken', () => {

    beforeEach(() => {
        mockLocalStorage();
    });

    it('clearAccessToken() should clear access token', () => {
        expect(window.localStorage.removeItem).not.toHaveBeenCalled();
        clearAccessToken();
        expect(window.localStorage.removeItem).toHaveBeenCalledWith('accessToken');
    });

    it('clearLocalStorage() should clear local storage', () => {
        expect(window.localStorage.clear).not.toHaveBeenCalled();
        clearLocalStorage();
        expect(window.localStorage.clear).toHaveBeenCalled();
    });
});