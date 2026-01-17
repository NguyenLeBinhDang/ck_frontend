const GIPHY_API_KEY = "w2uhkXio6um1sNNiRGVdlsfRPZTQA82f";
const BASE_URL = "https://api.giphy.com/v1/gifs";

export const getTrendingGifs = async (limit = 20) => {
    try {
        // Giphy endpoint: /trending
        // rating=g: Lọc nội dung an toàn cho mọi lứa tuổi
        const response = await fetch(
            `${BASE_URL}/trending?api_key=${GIPHY_API_KEY}&limit=${limit}&rating=g`
        );
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error("Error fetching trending gifs:", error);
        return [];
    }
};

export const searchGifs = async (query: string, limit = 20) => {
    try {
        // Giphy endpoint: /search
        // rating=g: Lọc nội dung an toàn cho mọi lứa tuổi
        const response = await fetch(
            `${BASE_URL}/search?api_key=${GIPHY_API_KEY}&q=${query}&limit=${limit}&rating=g`
        );
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error("Error searching gifs:", error);
        return [];
    }
};