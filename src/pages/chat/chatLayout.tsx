import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import styles from "./chat.module.css";
import {Outlet} from "react-router-dom";

export default function ChatLayout() {
    return (
        <div className={styles.chatContainer}>
            <LeftSidebar/>

            <div className={styles.content}>
                <Outlet/>
            </div>

        </div>
    );
}

