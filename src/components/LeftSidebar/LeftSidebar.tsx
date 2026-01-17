import React, {useState} from "react";
import {FaPlus, FaSignOutAlt, FaUserCircle} from "react-icons/fa";
import styles from "./LeftSidebar.module.css";
import ConversationItem from "../conversationItem/ConversationItem";
import {useNavigate} from "react-router-dom";
import {RootState} from "../../redux/store";
import {setActiveConversation} from "../../redux/chatSlice";
import {useDispatch, useSelector} from "react-redux";
import {AddContactModal} from "../addContactModal/AddContactModal";
import {logoutWS} from "../../services/socket";

export default function LeftSidebar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Lấy dữ liệu từ Redux Store
    const conversations = useSelector((state: RootState) => state?.chat.conversations || []);
    const activeId = useSelector((state: RootState) => state.chat.activeId || null);

    const handleSelect = (id: string) => {
        dispatch(setActiveConversation(id));
        navigate(`/chat/${id}`);
    };

    return (
        <div className={styles.container}>

            <div className={styles.miniNav}>

                <div className={styles.bottomActions}>

                    {/* Avatar */}
                    <div className={styles.avatar} title="Thông tin cá nhân">
                        <FaUserCircle size={38}/>
                    </div>

                    {/* Logout Button */}
                    <button className={styles.logoutBtn} title="Đăng xuất" onClick={() => logoutWS()}>
                        <FaSignOutAlt size={16}/>
                    </button>
                </div>
            </div>

            <div className={styles.chatListWrapper}>
                <div className={styles.searchContainer}>
                    <div
                        className={styles.addContactButton}
                        onClick={() => setIsModalOpen(true)}
                    >
                        <span className={styles.addIcon}>
                            <FaPlus size={16}/>
                        </span>
                        <span>Thêm liên hệ</span>
                    </div>
                </div>
                <div className={styles.contactList}>
                    {/* --- BẮT ĐẦU VÒNG LẶP --- */}
                    {conversations.map((chat) => (
                        <ConversationItem
                            key={chat.id}
                            id={chat.id}
                            name={chat.name}
                            avatar={chat.avatar}
                            lastMessage={chat.lastMessage}
                            time={chat.time}
                            unreadCount={chat.unreadCount}
                            isOnline={chat.isOnline}
                            isActive={activeId === chat.id}
                            onSelect={handleSelect}
                        />
                    ))}
                    {/* --- KẾT THÚC VÒNG LẶP --- */}
                </div>

            </div>
            <AddContactModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}