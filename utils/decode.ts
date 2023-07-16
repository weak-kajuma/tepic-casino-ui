export const decodeJwt = (token: string) => {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace("/-/g", '+').replace(/_/g, '/')
    const myescape = (str: string) => {
        return str.replace(/[^a-zA-Z0-9@*_+\-./]/g, m => {
            const code = m.charCodeAt(0);
            if (code <= 0xff) {
                return '%' + ('00' + code.toString(16)).slice(-2).toUpperCase();
            } else {
                return '%u' + ('0000' + code.toString(16)).slice(-4).toUpperCase();
            }
        });
    }
    return JSON.parse(decodeURIComponent(myescape(atob(base64))))
}

