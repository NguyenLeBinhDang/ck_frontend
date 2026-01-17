import React, {useEffect, useRef} from "react";
import {BsEmojiSmile, BsFiletypeGif, BsGift, BsImage, BsPaperclip, BsSend} from "react-icons/bs";
import styles from "./ChatWindow.module.css";
import EmojiPicker, {EmojiClickData} from "emoji-picker-react";
import {useParams} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {RootState} from "../../redux/store";
import {setActiveConversation} from "../../redux/chatSlice";
import {getPeopleChatMes, getRoomChatMes, sendChatMessage} from "../../services/socket";
import GifPicker from "../gif/GifPicker";

export default function ChatWindow() {

    const {id} = useParams();
    const [message, setMessage] = React.useState("");

    //emoji
    const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
    const emojiBtnRef = React.useRef<HTMLButtonElement>(null);
    const emojiPickerRef = React.useRef<HTMLDivElement>(null);


    //gif
    const [showGifPicker, setShowGifPicker] = React.useState(false);
    const gifBtnRef = React.useRef<HTMLButtonElement>(null);
    const gifPickerRef = React.useRef<HTMLDivElement>(null);

    // Lấy dữ liệu từ Redux
    // const currentUser = useSelector((state: RootState) => state?.user.name); // ID của mình
    const currentUser = localStorage.getItem("user");
    const conversation = useSelector((state: RootState) =>
        state.chat.conversations.find(c => c.id === id)
    );
    // Lấy tin nhắn của hội thoại hiện tại (mặc định mảng rỗng nếu chưa có)
    const currentMessages = useSelector((state: RootState) =>
        id ? state.chat.messages[id] || [] : []
    );
    // Cập nhật activeId và load lịch sử tin nhắn khi ID thay đổi
    const dispatch = useDispatch();
    useEffect(() => {
        if (id) {
            // Set active conversation để Sidebar biết đang chọn ai
            dispatch(setActiveConversation(id));
            setMessage(""); // Reset ô nhập

            // Gọi API lấy lịch sử tin nhắn
            // Cần biết type là 'people' hay 'room'. Nếu chưa load được conversation, mặc định 'people'
            const type = conversation?.type || 'people';
            if (type === 'people') {
                getPeopleChatMes(id);
            } else {
                getRoomChatMes(id);
            }
        }
    }, [id, dispatch, conversation?.type]);
    const onEmojiClick = (emojiData: EmojiClickData) => {
        setMessage((prevMessage) => prevMessage + emojiData.emoji);
    }

    useEffect(() => {
        if (id) {
            setMessage("")
        }
    }, [id]);

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

    const handleSendChat = () => {
        if (!id || !message.trim()) return;

        const type = conversation?.type || 'people';
        const to = conversation?.id || id;

        sendChatMessage(type, to, message);

        setMessage("");

    }

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


    const messagesEndRef = useRef<HTMLDivElement>(null);
    return (
        <div className={styles.windowContainer}>
            {/* --- MESSAGE LIST --- */}
            <div className={styles.messageArea}>
                {currentMessages.length > 0 ? (
                    currentMessages.map((msg, index) => {
                        let contentRender;
                        try {
                            const parsed = JSON.parse(msg.mes);

                            if (parsed.type === "img" || parsed.type === "gif") {
                                contentRender = (
                                    <img src={parsed.content}
                                         alt={parsed.type}
                                         style={{maxWidth: '200px', borderRadius: '8px'}}
                                    />
                                )
                            } else {
                                contentRender = parsed.content || msg.mes;
                            }
                        } catch (e) {
                            contentRender = msg.mes;
                        }

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
                                        {msg.from ? msg.from.charAt(0) : ''}
                                    </div>
                                )}
                                <div className={styles.bubbleWrapper}>
                                    <div
                                        className={`${styles.messageBubble} ${isMyMessage ? styles.bubbleMy : styles.bubbleTheir}`}>
                                        {contentRender}
                                    </div>
                                    <span className={styles.messageTime}>
                                        {timeString}
                                    </span>
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
            <div className={styles.footer}>

                <div className={styles.toolbar}>

                    <div className={styles.emojiWrapper}>
                        {showEmojiPicker && (<div className={styles.pickerContainer} ref={emojiPickerRef}>
                            <EmojiPicker
                                onEmojiClick={onEmojiClick}
                                width={300}
                                height={300}
                                previewConfig={{showPreview: false}}
                            />
                        </div>)}

                        <button
                            ref={emojiBtnRef}
                            className={`${styles.toolBtn} ${showEmojiPicker ? styles.active : ''}`}
                            title="Emoji"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                            <BsEmojiSmile size={20}/>
                        </button>
                    </div>

                    <div className={styles.emojiWrapper}>
                        {showGifPicker && (
                            <div className={styles.pickerContainer} ref={gifPickerRef}>
                                <GifPicker onGifSelect={handleSendGif}/>
                            </div>
                        )}

                        <button
                            ref={gifBtnRef}
                            className={`${styles.toolBtn} ${showGifPicker ? styles.active : ''}`}
                            title="Gửi GIF"
                            onClick={() => {
                                setShowGifPicker(!showGifPicker);
                                setShowEmojiPicker(false);
                            }}
                        >
                            <BsFiletypeGif size={20}/>
                        </button>
                    </div>

                    <button className={styles.toolBtn} title="Gửi ảnh">
                        <BsImage size={20}/>
                    </button>
                </div>

                <div className={styles.inputGroup}>
                    <textarea
                        className={styles.inputField}
                        rows={1}
                        placeholder="Nhập tin nhắn..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    ></textarea>

                    <button className={styles.sendBtn} onClick={() => {
                        handleSendChat()
                    }}>
                        <BsSend size={18}/>
                    </button>
                </div>
            </div>
        </div>
    );
}