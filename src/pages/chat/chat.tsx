import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
import ChatWindow from "../../components/ChatWindow/ChatWindow";
import "./chat.css";

export default function Chat() {
    return (
        <div className="chat-layout vh-100 d-flex">
            <LeftSidebar/>

            <ChatWindow/>

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

