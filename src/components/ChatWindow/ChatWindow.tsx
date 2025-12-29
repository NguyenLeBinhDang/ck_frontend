import React, {useEffect} from "react";
import {BsEmojiSmile, BsImage, BsPaperclip, BsSend} from "react-icons/bs";
import styles from "./ChatWindow.module.css";
import EmojiPicker, {EmojiClickData} from "emoji-picker-react";
import {useParams} from "react-router-dom";

export default function ChatWindow() {
    const {id} = useParams();
    const [message, setMessage] = React.useState("");
    const [showPicker, setShowPicker] = React.useState(false);

    const pickerRef = React.useRef<HTMLDivElement>(null);
    const btnRef = React.useRef<HTMLButtonElement>(null);


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
                showPicker &&
                pickerRef.current &&
                !pickerRef.current.contains(event.target as Node) &&
                btnRef.current &&
                !btnRef.current.contains(event.target as Node)
            ) {
                setShowPicker(false);
            }
        }

        document.addEventListener("mousedown", handleClickOut);
        return () => {
            document.removeEventListener("mousedown", handleClickOut);
        }
    }, [showPicker]);


    return (
        <div className={styles.windowContainer}>
            <div className={styles.messageArea}>

            </div>


            <div className={styles.footer}>

                <div className={styles.toolbar}>

                    <div className={styles.emojiWrapper}>
                        {showPicker && (<div className={styles.pickerContainer} ref={pickerRef}>
                            <EmojiPicker
                                onEmojiClick={onEmojiClick}
                                width={300}
                                height={300}
                                previewConfig={{showPreview: false}}
                            />
                        </div>)}

                        <button
                            ref={btnRef}
                            className={`${styles.toolBtn} ${showPicker ? styles.active : ''}`}
                            title="Emoji"
                            onClick={() => setShowPicker(!showPicker)}
                        >
                            <BsEmojiSmile size={20}/>
                        </button>
                    </div>

                    <button className={styles.toolBtn} title="Đính kèm file">
                        <BsPaperclip size={20}/>
                    </button>
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

                    <button className={styles.sendBtn}>
                        <BsSend size={18}/>
                    </button>
                </div>
            </div>
        </div>
    );
}