import { mockLocalStorage, getMockResponse } from 'utilities/test/mockingUtilities';

import removePlayerAsync from 'api/playerApi/removePlayerAsync';

describe('removePlayerAsync', () => {
    
    const setupAndFetchPlayerRemove = (status = 200) => {
        let fetchPromise = Promise.resolve(
            getMockResponse(status, null, null)
        );
        window.fetch = jest.fn().mockImplementation(() => fetchPromise);
        removePlayerAsync(localStorage.getItem('accessToken'));
        return fetchPromise;
    };

    beforeEach(() => {
        mockLocalStorage();
        return setupAndFetchPlayerRemove();
    });

    it('should fetch removal in player api', () => {
        const apiUrl = '/api/players/remove';
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