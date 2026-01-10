import React, {useState} from "react";
import {FaSearch, FaSignOutAlt, FaUserCircle} from "react-icons/fa";
import styles from "./LeftSidebar.module.css";
import ConversationItem from "../conversationItem/ConversationItem";
import {useNavigate} from "react-router-dom";
import { RootState } from "../../redux/store";
import { setActiveConversation } from "../../redux/chatSlice";
import {useDispatch, useSelector} from "react-redux";

// 1. Định nghĩa kiểu dữ liệu cho một cuộc hội thoại
// interface Conversation {
//     id: string;
//     name: string;
//     avatar: string;
//     lastMessage: string;
//     time: string;
//     unreadCount: number;
//     isOnline: boolean;
// }
//
// // 2. Tạo dữ liệu giả (Mock Data) - Sau này sẽ lấy từ API
// const MOCK_CONVERSATIONS: Conversation[] = [
//     {
//         id: "1",
//         name: "Nguyễn Văn A",
//         avatar: "", // Link ảnh hoặc để rỗng
//         lastMessage: "Xin chào, hôm nay thế nào?",
//         time: "10:30",
//         unreadCount: 2,
//         isOnline: true,
//     },
//     {
//         id: "2",
//         name: "Team Dự Án",
//         avatar: "",
//         lastMessage: "Đã cập nhật code mới nhé",
//         time: "09:15",
//         unreadCount: 0,
//         isOnline: false,
//     },
//     {
//         id: "3",
//         name: "Support Bot",
//         avatar: "",
//         lastMessage: "Bạn cần giúp gì không?",
//         time: "Hôm qua",
//         unreadCount: 5,
//         isOnline: true,
//     },
// ];

export default function LeftSidebar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Lấy dữ liệu từ Redux Store
    const conversations = useSelector((state: RootState) => state?.chat.conversations|| []);
    const activeId = useSelector((state: RootState) => state.chat.activeId|| null);

    const handleSelect = (id: string) => {
        dispatch(setActiveConversation(id));
        navigate(`/chat/${id}`);
    };

    // const handleLogout = () => {
    //     logoutWS();
    //     navigate("/login");
    // };

    return (
        <div className={styles.container}>

            <div className={styles.miniNav}>

                <div className={styles.bottomActions}>

                    {/* Avatar */}
                    <div className={styles.avatar} title="Thông tin cá nhân">
                        <FaUserCircle size={38}/>
                    </div>

                    {/* Logout Button */}
                    <button className={styles.logoutBtn} title="Đăng xuất">
                        <FaSignOutAlt size={16}/>
                    </button>
                </div>
            </div>

            <div className={styles.chatListWrapper}>
                <div className={styles.searchContainer}>
                    <div className={styles.inputGroup}>
                        <span className={styles.searchIcon}>
                            <FaSearch size={16}/>
                        </span>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Tìm kiếm..."
                        />
                    </div>
                </div>

                <div className={styles.contactList}>
                    {/* --- BẮT ĐẦU VÒNG LẶP --- */}
                    {conversations.map((chat) => (
                        <ConversationItem
                            key={chat.id} // BẮT BUỘC PHẢI CÓ KEY DUY NHẤT
                            id={chat.id}
                            name={chat.name}
                            avatar={chat.avatar}
                            lastMessage={chat.lastMessage}
                            time={chat.time}
                            unreadCount={chat.unreadCount}
                            isOnline={chat.isOnline}
                            // Kiểm tra xem item này có đang được chọn không
                            isActive={activeId === chat.id}
                            // Truyền hàm xử lý click
                            onSelect={handleSelect}
                        />
                    ))}
                    {/* --- KẾT THÚC VÒNG LẶP --- */}
                </div>

            </div>
        </div>
    );
}