// fileService.ts
import { v4 as uuidv4 } from 'uuid';

// Lưu file vào localStorage (hoặc IndexedDB cho file lớn)
export const saveFileToLocal = (file: File, messageId: string): Promise<{
    url: string;
    name: string;
    size: number;
    mimeType: string;
}> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const base64 = e.target?.result as string;
                const fileData = {
                    url: base64,
                    name: file.name,
                    size: file.size,
                    mimeType: file.type
                };

                // Lưu vào localStorage với key duy nhất
                localStorage.setItem(`file_${messageId}`, JSON.stringify(fileData));

                resolve(fileData);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};
// Thêm hàm xử lý URL (ảnh/gif từ internet)
export const isValidUrl = (urlString: string): boolean => {
    try {
        const url = new URL(urlString);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
};

// Lưu URL vào localStorage (cho cache)
export const saveUrlToLocal = (url: string, key: string): void => {
    try {
        localStorage.setItem(`url_${key}`, url);
    } catch (error) {
        console.error('Error saving URL to local:', error);
    }
};

// Lấy URL từ localStorage
export const getUrlFromLocal = (key: string): string | null => {
    return localStorage.getItem(`url_${key}`);
};

// Tải và cache ảnh
export const cacheImage = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        // Kiểm tra cache trước
        const cacheKey = `cached_${btoa(url).substring(0, 50)}`;
        const cached = getUrlFromLocal(cacheKey);

        if (cached) {
            resolve(cached);
            return;
        }

        // Nếu là data URL thì không cần cache
        if (url.startsWith('data:')) {
            saveUrlToLocal(url, cacheKey);
            resolve(url);
            return;
        }

        // Tải và chuyển thành data URL
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const reader = new FileReader();
                reader.onload = () => {
                    const dataUrl = reader.result as string;
                    saveUrlToLocal(dataUrl, cacheKey);
                    resolve(dataUrl);
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            })
            .catch(reject);
    });
};
// Lấy file từ localStorage
export const getFileFromLocal = (messageId: string) => {
    const data = localStorage.getItem(`file_${messageId}`);
    return data ? JSON.parse(data) : null;
};

// Xóa file khỏi localStorage
export const removeFileFromLocal = (messageId: string) => {
    localStorage.removeItem(`file_${messageId}`);
};

// Tạo URL tải xuống từ blob/base64
export const downloadFile = (fileData: any, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileData.url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Nén ảnh trước khi gửi (giảm dung lượng)
export const compressImage = (file: File, maxWidth = 800, quality = 0.7): Promise<File> => {
    return new Promise((resolve, reject) => {
        if (!file.type.startsWith('image/')) {
            resolve(file);
            return;
        }

        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target?.result as string;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                let width = img.width;
                let height = img.height;

                // Resize nếu ảnh quá lớn
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                ctx?.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (blob) {
                        const compressedFile = new File([blob], file.name, {
                            type: file.type,
                            lastModified: Date.now()
                        });
                        resolve(compressedFile);
                    } else {
                        resolve(file);
                    }
                }, file.type, quality);
            };

            img.onerror = reject;
        };

        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};