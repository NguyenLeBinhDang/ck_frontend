import React from 'react';
import item from './ConversationItem.module.css'; // Import như một object

interface Props {
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unreadCount: number;
    isOnline: boolean;
    isActive: boolean;
    onSelect: (id: string) => void;
}

const ConversationItem: React.FC<Props> = ({
                                               id, name, avatar, lastMessage, time, unreadCount, isOnline, isActive, onSelect
                                           }) => {
    return (
        <div
            className={`${item.card} ${isActive ? item.active : ''}`}
            onClick={() => onSelect(id)}
        >
            <div className={item.content}>
                {/* Avatar */}
                <div className={item.avatarWrapper}>
                    <img src={avatar} alt={name} className={item.avatar} />
                    {isOnline && <span className={item.onlineDot} />}
                </div>

                {/* Message info */}
                <div className={item.messageInfo}>
                    <div className={item.header}>
                        <span className={item.name}>{name}</span>
                        <span className={item.time}>{time}</span>
                    </div>

                    <div className={item.preview}>
                        <p className={item.lastMessage}>{lastMessage}</p>
                        {unreadCount > 0 && (
                            <span className={item.unreadBadge}>{unreadCount}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConversationItem;