const apiBase = '/api';
const herosEndpoint = `${apiBase}/heros`;

function removePlayerHeroesAsync(token) {
    const apiUrl = `${herosEndpoint}/remove`;
    const headers = {
        method: 'get',
        headers: new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `bearer ${token}`
        })
    };

    return fetch(apiUrl, headers).catch((err) => {throw err;});
}

export default removePlayerHeroesAsync;