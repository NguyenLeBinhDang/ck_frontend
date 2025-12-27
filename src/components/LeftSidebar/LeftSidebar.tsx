import React from "react";
import {FaSearch, FaSignOutAlt, FaUserCircle} from "react-icons/fa";
import styles from "./LeftSidebar.module.css";

export default function LeftSidebar() {
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

                </div>

            </div>
        </div>
    );
}