import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addComment } from '../../redux/slices/commentsSlice';
import { RootState } from '../../redux/store';
import profilePlaceholder from '../../assets/profile-placeholder.svg';
import { useTranslation } from 'react-i18next';
import styles from './otherModal.module.css';
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
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [commentsCount, setCommentsCount] = useState(post.comments_count || 0);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedCaption, setEditedCaption] = useState(post.caption);
  const [editedImage, setEditedImage] = useState(post.image_url);

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

  const handleDeletePost = async () => {
    try {
      await $api.delete(`/post/${post._id}`);
      onUpdatePosts();
      onClose();
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
        <div className={styles.modalContent_rightside}>
          <button className={styles.closeButton} onClick={onClose}>
            ✖
          </button>
          <div className={styles.modalContent_rightside_caption}>
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
                <span className={styles.user_name}>{post.user_name}</span>
                <span className={styles.modalCaption}>{post.caption}</span>
              </div>
            </div>
          </div>

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
