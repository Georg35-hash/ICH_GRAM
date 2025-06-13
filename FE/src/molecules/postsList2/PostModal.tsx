import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addComment } from '../../redux/slices/commentsSlice';
import { RootState } from '../../redux/store';
import profilePlaceholder from '../../assets/profile-placeholder.svg';
import { FaEllipsisV } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import styles from './postModal.module.css';
import { $api } from '../../api/api';
import commbtn from '../../assets/comment_btn.svg';
import heart from '../../assets/heart_btn.svg';
import CommentContent from '../commentContent/CommentContent';

interface ModalProps {
  post: Post;
  onClose: () => void;
  onUpdatePosts: () => void;
}

const EmojiPicker: React.FC<{ onSelectEmoji: (emoji: string) => void }> = ({
  onSelectEmoji,
}) => {
  const [showEmojis, setShowEmojis] = useState(false);

  const emojis = Array.from({ length: 80 }, (_, i) =>
    String.fromCodePoint(0x1f600 + i),
  );

  const toggleEmojiPicker = () => {
    setShowEmojis(prev => {
      const newState = !prev;
      if (newState) {
        setTimeout(() => {
          setShowEmojis(false);
        }, 6000);
      }
      return newState;
    });
  };

  return (
    <div className={styles.emojiDropdown}>
      <button
        type="button"
        className={styles.emojiButton}
        onClick={toggleEmojiPicker}
      >
        😊
      </button>
      {showEmojis && (
        <div className={styles.emojiList}>
          {emojis.map((emoji, index) => (
            <span
              key={index}
              className={styles.emojiItem}
              onClick={() => onSelectEmoji(emoji)}
            >
              {emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const PostModal: React.FC<ModalProps> = ({ post, onClose, onUpdatePosts }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [commentsCount, setCommentsCount] = useState(post.comments_count || 0);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedCaption, setEditedCaption] = useState(post.caption); // Редактируемый caption
  const [editedImage, setEditedImage] = useState(post.image_url); // Редактируемое изображение

  useEffect(() => {
    setLikesCount(post.likes_count || 0);
    setCommentsCount(post.comments_count || 0);
  }, [post]);

  const handleAddComment = async () => {
    if (!currentUser || !currentUser._id) {
      setError(t('postModal.errorUserNotFound'));
      return;
    }

    try {
      await dispatch(
        addComment({
          postId: post._id,
          userId: currentUser._id,
          comment_text: newComment.trim(),
        }),
      );
      setNewComment('');
      setCommentsCount(prev => prev + 1);
    } catch (err) {
      setError(t('postModal.errorAddComment'));
    }
  };

  const handleLikePost = async () => {
    if (!currentUser || !currentUser._id) {
      setError(t('postModal.errorUserNotFound'));
      return;
    }

    try {
      await $api.post(`/post/${post._id}/like`, { userId: currentUser._id });
      setLikesCount(prev => prev + 1);
    } catch (err) {
      console.error('Ошибка при лайке поста:', err);
    }
  };

  const toggleActionMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActionMenu(!showActionMenu);
  };

  const handleDeletePost = async () => {
    try {
      await $api.delete(`/post/${post._id}`);
      onUpdatePosts(); // Обновляем список постов
      onClose(); // Закрываем модальное окно поста
      setShowDeleteConfirmation(false); // Закрываем окно подтверждения
    } catch (error) {
      console.error('Ошибка при удалении поста:', error);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalContent_leftside}>
          <img src={post.image_url || profilePlaceholder} alt="post" />
        </div>
        <div></div>
        <div className={styles.modalContent_rightside}>
          <div className={styles.modalContent_rightside_caption}>
            <div className={styles.topBlockTop}>
              <span className={styles.gradient_border}>
                <span className={styles.gradient_border_inner}>
                  <img
                    src={post.profile_image || profilePlaceholder}
                    alt="profile"
                  />
                </span>
              </span>
              <div className={styles.nameCaption}>
                <span className={styles.user_name}>{post.user_name}</span>
              </div>
            </div>

            <div className={styles.topBlock}>
              <span className={styles.gradient_border}>
                <span className={styles.gradient_border_inner}>
                  <img
                    src={post.profile_image || profilePlaceholder}
                    alt="profile"
                  />
                </span>
              </span>
              <div className={styles.nameCaption}>
                <span className={styles.modalCaption}>{post.caption}</span>
              </div>
            </div>

            <button
              className={styles.moreOptionsButton}
              onClick={toggleActionMenu}
            >
              <FaEllipsisV />
            </button>
          </div>

          {showActionMenu && (
            <div className={styles.actionMenu}>
              {/* Удаление */}
              <button
                className={`${styles.actionButton} ${styles.deleteButton}`}
                onClick={() => setShowDeleteConfirmation(true)}
              >
                Delete
              </button>

              {/* Редактирование */}
              <button
                className={styles.actionButton}
                onClick={() => {
                  setShowEditModal(true);
                  toggleActionMenu(); // Закрываем основное меню
                }}
              >
                Edit
              </button>

              {/* Переход к посту */}
              <button
                className={styles.actionButton}
                onClick={toggleActionMenu}
              >
                Go to post
              </button>

              {/* Копировать ссылку */}
              <button
                className={styles.actionButton}
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/post/${post._id}`,
                  );
                  alert('Link copied to clipboard!');
                }}
              >
                Copy link
              </button>

              {/* Отмена */}
              <button
                className={styles.actionButton}
                onClick={toggleActionMenu}
              >
                Cancel
              </button>
            </div>
          )}
          {showEditModal && (
            <div className={styles.editModal}>
              <div className={styles.editModalContent}>
                <h2>Edit Post</h2>

                {/* Редактирование текста */}
                <textarea
                  className={styles.editInput}
                  value={editedCaption}
                  onChange={e => setEditedCaption(e.target.value)}
                  placeholder="Edit caption"
                />

                {/* Загрузка нового изображения */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setEditedImage(reader.result as string); // Предварительный просмотр изображения
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />

                {editedImage && (
                  <img
                    src={editedImage}
                    alt="Preview"
                    className={styles.previewImage}
                  />
                )}

                {/* Кнопки сохранения и отмены */}
                <div className={styles.editButtons}>
                  <button
                    className={styles.saveButton}
                    onClick={async () => {
                      try {
                        // Отправка данных на сервер
                        await $api.put(`/post/${post._id}`, {
                          caption: editedCaption,
                          image_url: editedImage,
                        });
                        setShowEditModal(false); // Закрываем модальное окно
                        onUpdatePosts(); // Обновляем список постов
                      } catch (error) {
                        console.error(
                          'Ошибка при сохранении изменений:',
                          error,
                        );
                      }
                    }}
                  >
                    Save
                  </button>
                  <button
                    className={styles.cancelButton}
                    onClick={() => setShowEditModal(false)} // Закрываем без сохранения
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {showDeleteConfirmation && (
            <div className={styles.deleteConfirmation}>
              <p>Are you sure you want to delete this post?</p>
              <div className={styles.delButtons}>
                <button
                  className={styles.confirmDeleteButton}
                  onClick={handleDeletePost} // Удаляем пост и закрываем модалку
                >
                  Yes
                </button>
                <button
                  className={styles.cancelDeleteButton}
                  onClick={() => setShowDeleteConfirmation(false)} // Закрываем без удаления
                >
                  No
                </button>
              </div>
            </div>
          )}

          <div className={styles.commentsSection}>
            <CommentContent postId={post._id} />
          </div>
          <div>
            <div className={styles.modalContent_rightside_notifications}>
              <span>
                <img src={commbtn} alt="" /> {commentsCount}
              </span>
              <span>
                <img src={heart} alt="" onClick={handleLikePost} /> {likesCount}
                Likes
              </span>
            </div>
            <div className={styles.modalContent_rightside_notifications_date}>
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>

            <div className={styles.addCommentSection}>
              <EmojiPicker
                onSelectEmoji={emoji => setNewComment(prev => prev + emoji)}
              />
              <input
                type="text"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder={t('postModal.addComment')}
                className={styles.commentInput}
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className={styles.commentButton}
              >
                {t('postModal.submit')}
              </button>
            </div>
            {error && <p className={styles.errorText}>{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
