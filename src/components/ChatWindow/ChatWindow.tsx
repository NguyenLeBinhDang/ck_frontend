import React from "react";
import {BsEmojiSmile, BsImage, BsPaperclip, BsSend} from "react-icons/bs";
import styles from "./ChatWindow.module.css";

export default function ChatWindow() {
    return (
        <div className={styles.windowContainer}>
            <div className={styles.messageArea}>

            </div>

            <div className={styles.footer}>

                <div className={styles.toolbar}>
                    <button className={styles.toolBtn} title="Emoji">
                        <BsEmojiSmile size={20}/>
                    </button>
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
                    ></textarea>

                    <button className={styles.sendBtn}>
                        <BsSend size={18}/>
                    </button>
                </div>
            </div>
        </div>
    );
}