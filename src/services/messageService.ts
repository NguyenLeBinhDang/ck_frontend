export const encodeMessage = (message: string): string => {
    try {
        if (!message) return "";
        return window.btoa(unescape(encodeURIComponent(message)));
    } catch (e) {
        return message;
    }
}

export const decodeMessage = (message: string): string => {
    try {
        if (!message) return "";
        return decodeURIComponent(escape(window.atob(message)));
    } catch (e) {
        return message;
    }
}