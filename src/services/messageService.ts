export const encodeMessage = (message: string): string => {
    try {
        if (!message) return "";
        return window.btoa(unescape(encodeURIComponent(message)));
    } catch (e) {
        return message;
    }
};

export const decodeMessage = (message: string): string => {
    try {
        if (!message) return "";
        return decodeURIComponent(escape(window.atob(message)));
    } catch (e) {
        return message;
    }
};

export const getMessagePreview = (mes: string): string => {
    try {
        const parsed = JSON.parse(mes);
        if (parsed.type === 'image') {
            return '[Hình ảnh]';
        } else if (parsed.type === 'file') {
            return `[File: ${parsed.name || 'File'}]`;
        } else if (parsed.type === 'gif') {
            return '[GIF]';
        } else {
            return parsed.content || mes;
        }
    } catch {
        return mes;
    }
};

export const getMessageType = (mes: string): 'text' | 'image' | 'file' | 'gif' => {
    try {
        const parsed = JSON.parse(mes);
        if (parsed.type === 'image') return 'image';
        if (parsed.type === 'file') return 'file';
        if (parsed.type === 'gif') return 'gif';
        return 'text';
    } catch {
        return 'text';
    }
};