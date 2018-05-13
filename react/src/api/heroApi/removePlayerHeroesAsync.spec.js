import { mockLocalStorage, getMockResponse } from 'utilities/test/mockingUtilities';

import removePlayerHeroesAsync from 'api/heroApi/removePlayerHeroesAsync';

describe('removePlayerHeroesAsync', () => {
    
    const setupAndFetchUserHerosRemove = (status = 200) => {
        let fetchPromise = Promise.resolve(
            getMockResponse(status, null, null)
        );
        window.fetch = jest.fn().mockImplementation(() => fetchPromise);
        removePlayerHeroesAsync(localStorage.getItem('accessToken'));
        return fetchPromise;
    };

    beforeEach(() => {
        mockLocalStorage();
        return setupAndFetchUserHerosRemove();
    });

    it('should fetch removal in player api', () => {
        const apiUrl = '/api/heros/remove';
        const headers = {
            method: 'get',
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `bearer ${localStorage.getItem('accessToken')}`
            })
        };
        expect(window.fetch).toHaveBeenCalledWith(apiUrl, headers);
    });
});