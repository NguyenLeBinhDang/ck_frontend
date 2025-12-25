import {FaSearch, FaSignOutAlt, FaUserCircle} from "react-icons/fa";
import {BsSearch} from "react-icons/bs";

export default function LeftSidebar() {
    const recentChats = []


    return (
        <div className="d-flex h-100 left-sidebar-wrapper">
            {/*    Mini Navbar*/}
            <div className="mini-nav d-flex flex-column align-items-center py-3">
                <div className="mt-auto d-flex flex-column align-items-center gap-3">
                    {/*    Avatar*/}
                    <div className="cursor-pointer">
                        <FaUserCircle size={38} className="text-secondary"/>
                    </div>
                    {/*    Logout*/}
                    <button className="btn btn-outline-danger btn-sm rounded-circle p-2" title="Logout">
                        <FaSignOutAlt size={18}/>
                    </button>
                </div>
            </div>
            {/*    chat list*/}
            <div className="chat-list d-flex flex-column w-100 bg-white">
                {/*    search bar*/}
                <div className="search-bar-container p-3">
                    <div className="input-group">
                    <span className="input-group-text bg-white border-end-0 text-muted">
                        <FaSearch/>
                    </span>
                        <input
                            type="text"
                            className="form-control border-start-0 shadow-none ps-0"
                            placeholder="Search..."
                        />
                    </div>
                </div>

                {/*    Recent chat*/}
                <div className="contact-list">
                    {}
                </div>

            </div>
        </div>

    );
}