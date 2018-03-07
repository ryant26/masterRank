const apiBase = "/api";
const heroesEndpoint = `${apiBase}/heros`;

function fetchMostPlayedHeroes(forUser) {
    let platformDisplayName = forUser.platformDisplayName.replace(/#/g, '-');

    const apiUrl = `${heroesEndpoint}?platformDisplayName=${platformDisplayName}&platform=${forUser.platform}&region=${forUser.region}&filterBy=top&limit=5`;
    const headers = {
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `bearer ${localStorage.getItem('accessToken')}`
    }};

    return fetch(apiUrl, headers)
        .then(response => {
            if (!response.ok && response.status !== 304) {
                throw Error("Network request failed");
            }
            return response;
        })
        .then(response => response.json());
}

export default fetchMostPlayedHeroes;