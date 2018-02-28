import { mockLocalStorage, getMockResponse, generateMockUser } from '../../utilities/test/mockingUtilities';

import fetchMostPlayedHeroes from './fetchMostPlayedHeroes';

import { getHeroes } from '../../resources/heroes';

describe('fetchMostPlayedHeroes', () => {
    const forUser = generateMockUser();
    const mostPlayedHeroesArray = getHeroes();
    let mostPlayedHeroesPromise;

    describe('when response is ok', () => {
        beforeEach(() => {
            mockLocalStorage();
            let fetchPromise = Promise.resolve(
                getMockResponse(200, null, mostPlayedHeroesArray)
            );

            window.fetch = jest.fn().mockImplementation(() => fetchPromise);
            mostPlayedHeroesPromise = fetchMostPlayedHeroes(forUser);
            return fetchPromise;
        });

        it('should call fetch with correct api url and headers', () => {
            let platformDisplayName = forUser.platformDisplayName.replace(/#/g, '-');
            const apiUrl = `/api/heros?platformDisplayName=${platformDisplayName}&platform=${forUser.platform}&region=${forUser.region}&filterBy=top&limit=5`;
            const headers = {
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `bearer ${localStorage.getItem('accessToken')}`
            }};

            expect(window.fetch).toHaveBeenCalledWith(apiUrl, headers);
        });

        it('should return a promise that resolves to the response array returned from the API', () => {
            expect(mostPlayedHeroesPromise.then).toBeDefined();
            return mostPlayedHeroesPromise.then((responseObject) => {
                expect(responseObject).toEqual(mostPlayedHeroesArray);
            });
        });
    });

    describe('when response is not ok', () => {
        beforeEach(() => {
            mockLocalStorage();
            let fetchPromise = Promise.resolve(
                getMockResponse(400, null, [])
            );

            window.fetch = jest.fn().mockImplementation(() => fetchPromise);
            mostPlayedHeroesPromise = fetchMostPlayedHeroes(forUser);
            return fetchPromise;
        });

        it('should throw an error', () => {
            return mostPlayedHeroesPromise.catch((error) => {
                expect(error).toEqual(Error("Network request failed"));
            });
        });
    });
});