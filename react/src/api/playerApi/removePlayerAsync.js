const apiBase = '/api';
const playersEndpoint = `${apiBase}/players`;

function removePlayerAsync(token) {
    const apiUrl = `${playersEndpoint}/remove`;
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

export default removePlayerAsync;