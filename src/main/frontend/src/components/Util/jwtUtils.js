export const parseJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Error parsing JWT:", e);
        return null;
    }
};

export const getUserIdFromToken = () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
        console.log("Token not found in session storage");
        return null;
    }

    const decoded = parseJwt(token);
    if (decoded && decoded.sub) {
        return decoded.sub;
    } else {
        console.log("sub not found in JWT");
        return null;
    }
};
