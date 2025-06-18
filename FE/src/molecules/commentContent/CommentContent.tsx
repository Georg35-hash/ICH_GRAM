import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaHeart } from 'react-icons/fa';
import { RootState } from '../../redux/store';
import { fetchComments, likeComment } from '../../redux/slices/commentsSlice';
import profilePlaceholder from '../../assets/profile-placeholder.svg';
import styles from './CommentContent.module.css';
import { useTranslation } from 'react-i18next';
import parseData from '../../helpers/parseData';

interface CommentContentProps {
  postId: string;
}

const CommentContent: React.FC<CommentContentProps> = ({ postId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const comments = useSelector((state: RootState) => state.comments.comments);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const loading = useSelector((state: RootState) => state.comments.loading);

  // Обновляем комментарии при изменении postId
  useEffect(() => {
    dispatch(fetchComments(postId));
  }, [dispatch, postId]);

  const handleLikeComment = async (commentId: string) => {
    if (!currentUser || !currentUser._id) {
      console.error(t('postModal.errorUserNotFound'));
      return;
    }
    try {
      await dispatch(
        likeComment({ commentId, userId: currentUser._id }),
      ).unwrap();
      dispatch(fetchComments(postId));
    } catch (err) {
      console.error('Ошибка при лайке комментария:', err);
    }
  };

  if (loading) {
    return <p>{t('postModal.loadingComments')}</p>;
  }

  return (
    <div className={styles.commentsSection}>
      {comments.map((comment: any) => (
        <div key={comment._id} className={styles.comment}>
          <img
            src={
              comment.user_id === currentUser._id
                ? currentUser.profile_image || profilePlaceholder
                : comment.profile_image || profilePlaceholder
            }
            alt="comment-avatar"
            className={styles.commentAvatar}
          />
          <div className={styles.commentContent}>
            <p>
              <strong>
                {comment.user_id === currentUser._id
                  ? currentUser.username
                  : comment.user_name || 'Anonymous'}
              </strong>
              · {parseData(comment.created_at)}
            </p>
            <p>{comment.comment_text}</p>
          </div>
          <div className={styles.commentActions}>
            <FaHeart
              className={`${styles.likeIcon} ${
                comment.likes?.includes(currentUser._id)
                  ? styles.liked
                  : styles.unliked
              }`}
              onClick={() => handleLikeComment(comment._id)}
            />
            <span className={styles.likeCount}>
              {comment.likes?.length || 0}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentContent;
