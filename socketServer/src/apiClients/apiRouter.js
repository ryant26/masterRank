const getEndpoint = function(base, port, uri) {
    const portString = port ? `:${port}` : '';

    return base + portString + uri;
};

module.exports = {
    getEndpoint
};