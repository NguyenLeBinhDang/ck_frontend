import React, {useEffect, useRef, useState} from "react";
import {BsEmojiSmile, BsFiletypeGif, BsImage, BsPaperclip, BsSend, BsDownload} from "react-icons/bs";
import styles from "./ChatWindow.module.css";
import EmojiPicker, {EmojiClickData} from "emoji-picker-react";
import {useParams} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {RootState} from "../../redux/store";
import {setActiveConversation} from "../../redux/chatSlice";
import {getPeopleChatMes, getRoomChatMes, sendChatMessage} from "../../services/socket";
import GifPicker from "../gif/GifPicker";

import { uploadToCloudinary } from "../../services/cloudinaryService";

export default function ChatWindow() {
    const {id} = useParams();
    const [message, setMessage] = useState("");
    const [uploading, setUploading] = useState(false);

    // Emoji picker
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiBtnRef = useRef<HTMLButtonElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    // GIF picker
    const [showGifPicker, setShowGifPicker] = useState(false);
    const gifBtnRef = useRef<HTMLButtonElement>(null);
    const gifPickerRef = useRef<HTMLDivElement>(null);

    // File inputs
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Lấy dữ liệu từ Redux
    const currentUser = localStorage.getItem("user");
    const conversation = useSelector((state: RootState) =>
        state.chat.conversations.find(c => c.id === id)
    );
    const currentMessages = useSelector((state: RootState) =>
        id ? state.chat.messages[id] || [] : []
    );

    const dispatch = useDispatch();

    // Load messages khi conversation thay đổi
    useEffect(() => {
        if (id) {
            dispatch(setActiveConversation(id));
            setMessage("");

            const type = conversation?.type || 'people';
            if (type === 'people') {
                getPeopleChatMes(id);
            } else {
                getRoomChatMes(id);
            }
        }
    }, [id, dispatch, conversation?.type]);

    // Auto scroll xuống tin nhắn mới nhất
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
        }
    }, [currentMessages]);

    // Emoji handler
    const onEmojiClick = (emojiData: EmojiClickData) => {
        setMessage((prevMessage) => prevMessage + emojiData.emoji);
    }

    // Close pickers when clicking outside
    useEffect(() => {
        const handleClickOut = (event: MouseEvent) => {
            if (
                showEmojiPicker &&
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(event.target as Node) &&
                emojiBtnRef.current &&
                !emojiBtnRef.current.contains(event.target as Node)
            ) {
                setShowEmojiPicker(false);
            }

            if (
                showGifPicker &&
                gifPickerRef.current &&
                !gifPickerRef.current.contains(event.target as Node) &&
                gifBtnRef.current &&
                !gifBtnRef.current.contains(event.target as Node)
            ) {
                setShowGifPicker(false);
            }
        }

        document.addEventListener("mousedown", handleClickOut);
        return () => {
            document.removeEventListener("mousedown", handleClickOut);
        }
    }, [showEmojiPicker, showGifPicker]);

    // Gửi tin nhắn text
    const handleSendChat = () => {
        if (!id || !message.trim()) return;

        const type = conversation?.type || 'people';
        const to = conversation?.id || id;

        sendChatMessage(type, to, message);
        setMessage("");
    }

    // Gửi GIF
    const handleSendGif = (url: string) => {
        if (!id) return;

        const content = JSON.stringify({
            type: "gif",
            content: url
        });

        const type = conversation?.type || 'people';
        const to = conversation?.id || id;

        sendChatMessage(type, to, content);
        setShowGifPicker(false);
    }


    const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>, folder: "chat-images" | "chat-files") => {
        const files = e.target.files;
        if (!files?.length || !id) return;

        setUploading(true);
        try {
            const upload = await uploadToCloudinary(files[0], folder);
            const messageData = {
                type: folder === "chat-images" ? "image" : "file",
                url: upload.url,
                name: upload.originalName,
                size: upload.size,
                mimeType: upload.mimeType
            };

            sendChatMessage(
                conversation?.type || "people",
                conversation?.id || id,
                JSON.stringify(messageData)
            );
        } catch (err) {
            console.error("Upload failed:", err);
            alert(`Upload ${folder === "chat-images" ? "ảnh" : "file"} thất bại`);
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    // Render message content
    const renderMessageContent = (msg: any) => {
        try {
            const parsed = JSON.parse(msg.mes);

            switch (parsed.type) {
                case "image":
                    return (
                        <div className={styles.mediaContainer}>
                            <img
                                src={parsed.url}
                                alt={parsed.name}
                                className={styles.messageImage}
                                onClick={() => window.open(parsed.url, '_blank')}
                                loading="lazy"
                            />
                            <div className={styles.mediaInfo}>
                                <span>{parsed.name}</span>
                                {parsed.size && <span>{(parsed.size / 1024).toFixed(1)} KB</span>}
                            </div>
                        </div>
                    );

                case "file":
                    return (
                        <div className={styles.fileContainer}>
                            <div className={styles.fileIcon}>
                                <BsPaperclip size={20} />
                            </div>
                            <div className={styles.fileDetails}>
                                <span className={styles.fileName}>{parsed.name}</span>
                                <span className={styles.fileSize}>
                                    {(parsed.size / 1024).toFixed(1)} KB • {parsed.mimeType}
                                </span>
                            </div>
                            <a
                                href={parsed.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.downloadButton}
                                title="Tải xuống"
                            >
                                <BsDownload size={16} />
                            </a>
                        </div>
                    );

                case "gif":
                    return (
                        <div className={styles.mediaContainer}>
                            <img
                                src={parsed.url || parsed.content}
                                alt="GIF"
                                className={styles.messageGif}
                                onClick={() => window.open(parsed.url || parsed.content, '_blank')}
                                loading="lazy"
                            />
                        </div>
                    );

                default:
                    return parsed.content || msg.mes;
            }
        } catch {
            return msg.mes;
        }
    };

    return (
        <div className={styles.windowContainer}>
            {/* Message Area */}
            <div className={styles.messageArea}>
                {currentMessages.length > 0 ? (
                    currentMessages.map((msg, index) => {
                        const isMyMessage = msg.from === currentUser;
                        const timeString = msg.createAt ? new Date(msg.createAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        }) : '';

                        return (
                            <div
                                key={index}
                                className={`${styles.messageRow} ${isMyMessage ? styles.rowRight : styles.rowLeft}`}
                            >
                                {!isMyMessage && (
                                    <div className={styles.messageAvatar}>
                                        {msg.from?.charAt(0) || ''}
                                    </div>
                                )}
                                <div className={styles.bubbleWrapper}>
                                    <div className={`${styles.messageBubble} ${isMyMessage ? styles.bubbleMy : styles.bubbleTheir}`}>
                                        {renderMessageContent(msg)}
                                    </div>
                                    <span className={styles.messageTime}>{timeString}</span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className={styles.emptyChat}>
                        <p>Chưa có tin nhắn nào. Hãy bắt đầu trò chuyện!</p>
                    </div>
                )}
                <div ref={messagesEndRef}/>
            </div>

            {/* Hidden File Inputs */}
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="*/*"
                   onChange={(e) => handleUploadFile(e, "chat-files")} />
            <input type="file" ref={imageInputRef} style={{ display: 'none' }} accept="image/*"
                   onChange={(e) => handleUploadFile(e, "chat-images")} />

            {/* Footer */}
            <div className={styles.footer}>
                <div className={styles.toolbar}>
                    {/* Emoji */}
                    <div className={styles.emojiWrapper}>
                        {showEmojiPicker && (
                            <div className={styles.pickerContainer} ref={emojiPickerRef}>
                                <EmojiPicker onEmojiClick={onEmojiClick} width={300} height={300}
                                             previewConfig={{showPreview: false}} />
                            </div>
                        )}
                        <button ref={emojiBtnRef} className={`${styles.toolBtn} ${showEmojiPicker ? styles.active : ''}`}
                                title="Emoji" onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowGifPicker(false); }}>
                            <BsEmojiSmile size={20}/>
                        </button>
                    </div>

                    {/* GIF */}
                    <div className={styles.emojiWrapper}>
                        {showGifPicker && (
                            <div className={styles.pickerContainer} ref={gifPickerRef}>
                                <GifPicker onGifSelect={handleSendGif}/>
                            </div>
                        )}
                        <button ref={gifBtnRef} className={`${styles.toolBtn} ${showGifPicker ? styles.active : ''}`}
                                title="Gửi GIF" onClick={() => { setShowGifPicker(!showGifPicker); setShowEmojiPicker(false); }}>
                            <BsFiletypeGif size={20}/>
                        </button>
                    </div>

                    {/* Image & File */}
                    <button className={styles.toolBtn} title="Gửi ảnh" onClick={() => imageInputRef.current?.click()} disabled={uploading}>
                        <BsImage size={20}/>
                    </button>
                    <button className={styles.toolBtn} title="Đính kèm file" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                        <BsPaperclip size={20}/>
                    </button>
                </div>

                <div className={styles.inputGroup}>
                    <textarea className={styles.inputField} rows={1} placeholder="Nhập tin nhắn..."
                              value={message} onChange={(e) => setMessage(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendChat())} />

                    <button className={styles.sendBtn} onClick={handleSendChat} disabled={!message.trim() || uploading}>
                        <BsSend size={18}/>
                    </button>
                </div>

                {uploading && (
                    <div className={styles.uploadingOverlay}>
                        <div className={styles.uploadingSpinner}></div>
                        <span>Đang tải lên...</span>
                    </div>
                )}
            </div>
        </div>
    );
}