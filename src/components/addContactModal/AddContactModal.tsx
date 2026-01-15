import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { addConversation } from '../../redux/chatSlice';
import { checkUserExist, sendChatMessage } from '../../services/socket';
import styles from './AddContactModal.module.css';

interface AddContactModalProps {
    open: boolean;
    onClose: () => void;
}

export const AddContactModal: React.FC<AddContactModalProps> = ({ open, onClose }) => {
    const dispatch = useDispatch();

    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const conversations = useSelector((state: RootState) => state.chat.conversations);
    const currentUser = localStorage.getItem('user') || '';

    useEffect(() => {
        if (!open) {
            setUsername('');
            setError('');
            setLoading(false);
        }
    }, [open]);

    const handleAdd = async () => {
        const trimmed = username.trim();

        if (!trimmed) {
            setError('Vui lòng nhập tên người dùng');
            return;
        }

        if (trimmed === currentUser) {
            setError('Không thể thêm chính mình');
            return;
        }

        if (conversations.some(c => c.id === trimmed)) {
            setError('Người dùng đã có trong danh sách liên hệ');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const exists = await checkUserExist(trimmed);

            if (!exists) {
                setError('Người dùng không tồn tại');
                return;
            }

            // Thêm conversation
            dispatch(addConversation({
                id: trimmed,
                name: trimmed,
                avatar: `https://ui-avatars.com/api/?name=${trimmed}&background=random`,
                lastMessage: 'Đã kết nối 👋',
                time: new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                unreadCount: 0,
                isOnline: false,
                type: 'people'
            }));

            // Gửi tin nhắn chào
            sendChatMessage('people', trimmed, 'Xin chào! 👋');

            onClose();
        } catch (err) {
            setError('Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !loading) {
            handleAdd();
        }
    };

    if (!open) return null;

    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <h3 className={styles.title}>Thêm liên hệ mới</h3>

                {error && (
                    <div className={styles.errorMessage}>
                        <i className="fas fa-exclamation-circle" />
                        {error}
                    </div>
                )}

                <input
                    className={styles.input}
                    type="text"
                    placeholder="Nhập tên người dùng"
                    value={username}
                    disabled={loading}
                    autoFocus
                    onChange={e => {
                        setUsername(e.target.value);
                        setError('');
                    }}
                    onKeyDown={handleKeyPress}
                />

                <div className={styles.modalActions}>
                    <button
                        className={styles.cancelButton}
                        onClick={onClose}
                        disabled={loading}
                    >
                        Hủy
                    </button>

                    <button
                        className={styles.addButton}
                        onClick={handleAdd}
                        disabled={loading}
                    >
                        {loading ? 'Đang kiểm tra...' : 'Thêm'}
                    </button>
                </div>
            </div>
        </div>
    );
};
