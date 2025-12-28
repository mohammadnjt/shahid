
exports.getQueryParam = function getQueryParam(url, paramName) {
    const params = url.split('?')[1];
    if (!params) return null;
    
    const paramPairs = params.split('&');
    for (const pair of paramPairs) {
        const [key, value] = pair.split('=');
        if (key === paramName) {
            return decodeURIComponent(value || '');
        }
    }
    return null;
}