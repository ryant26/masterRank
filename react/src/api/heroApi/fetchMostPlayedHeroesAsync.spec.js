import { mockLocalStorage, getMockResponse, generateMockUser } from 'utilities/test/mockingUtilities';

import fetchMostPlayedHeroesAsync from 'api/heroApi/fetchMostPlayedHeroesAsync';

import { getHeroes } from 'resources/heroes';

describe('fetchMostPlayedHeroesAsync', () => {
    const forUser = generateMockUser();
    const mostPlayedHeroesArray = getHeroes();
    let mostPlayedHeroesPromise;

    const setupAndFetchMostPlayedHeroes = (status = 200, result = mostPlayedHeroesArray) => {
        let fetchPromise = Promise.resolve(
            getMockResponse(status, null, result)
        );

        window.fetch = jest.fn().mockImplementation(() => fetchPromise);
        mostPlayedHeroesPromise = fetchMostPlayedHeroesAsync(forUser);
        return fetchPromise;
    };

    describe('when response is ok', () => {
        beforeEach(() => {
            mockLocalStorage();
            return setupAndFetchMostPlayedHeroes();
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

        it('should resolve the promise for cached empty array', () => {
            return setupAndFetchMostPlayedHeroes(304, []).then(() => {
                mostPlayedHeroesPromise.then((responseObject) => {
                    expect(responseObject).toEqual([]);
                });
            });
        });

        it('should resolve the promise for empty array', () => {
            return setupAndFetchMostPlayedHeroes(200, []).then(() => {
                mostPlayedHeroesPromise.then((responseObject) => {
                    expect(responseObject).toEqual([]);
                });
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
            mostPlayedHeroesPromise = fetchMostPlayedHeroesAsync(forUser);
            return fetchPromise;
        });

        it('should throw an error', () => {
            return mostPlayedHeroesPromise.catch((error) => {
                expect(error).toEqual(Error("Network request failed"));
            });
        });
    });
});