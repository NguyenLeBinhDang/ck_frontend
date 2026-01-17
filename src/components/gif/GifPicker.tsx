import React, { useEffect, useState } from 'react';
import styles from './GifPicker.module.css';
import { getTrendingGifs, searchGifs } from '../../services/giphyService'; // Đổi import sang giphyService
import { BsSearch } from "react-icons/bs";

interface GifPickerProps {
    onGifSelect: (gifUrl: string) => void;
}

export default function GifPicker({ onGifSelect }: GifPickerProps) {
    const [gifs, setGifs] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadTrending();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search.trim()) {
                handleSearch(search);
            } else {
                loadTrending();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const loadTrending = async () => {
        setLoading(true);
        const results = await getTrendingGifs();
        setGifs(results);
        setLoading(false);
    };

    const handleSearch = async (query: string) => {
        setLoading(true);
        const results = await searchGifs(query);
        setGifs(results);
        setLoading(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.searchBar}>
                <BsSearch className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Tìm trên Giphy..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={styles.input}
                    autoFocus
                />
            </div>

            <div className={styles.grid}>
                {loading ? (
                    <p className={styles.loadingText}>Đang tải...</p>
                ) : (
                    gifs.map((gif) => (
                        <div
                            key={gif.id}
                            className={styles.gifItem}
                            onClick={() => {
                                // gif.images.original.url -> Ảnh gốc
                                // gif.images.downsized.url -> Ảnh nhẹ hơn
                                onGifSelect(gif.images.downsized.url);
                            }}
                        >
                            {/* GIPHY: Khi hiển thị list, dùng fixed_height_small để load nhanh và đều */}
                            <img
                                src={gif.images.fixed_height_small.url}
                                alt={gif.title}
                                loading="lazy"
                            />
                        </div>
                    ))
                )}
            </div>
            {/* Logo Giphy bắt buộc theo chính sách của họ (Optional nhưng nên có) */}
            <div style={{textAlign: 'right', padding: '0 5px', fontSize: '10px', color: '#ccc'}}>
                Powered by GIPHY
            </div>
        </div>
    );
}