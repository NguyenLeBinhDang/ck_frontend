import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import ChatWindow from "../../components/ChatWindow/ChatWindow";
import styles from "./chat.module.css";
import {Outlet} from "react-router-dom";

export default function ChatLayout() {
    return (
        <div className={styles.chatContainer}>
            <LeftSidebar/>

            <div className={styles.content}>
                <Outlet/>
            </div>

            {/*<div className="right-sidebar d-none d-lg-block">*/}
            {/*    <div className="p-3 text-center text-muted">*/}
            {/*        Thông tin hội thoại*/}
            {/*        <br />*/}
            {/*        (Media, Files, Link)*/}
            {/*    </div>*/}
            {/*</div>*/}

        </div>
    );
}

