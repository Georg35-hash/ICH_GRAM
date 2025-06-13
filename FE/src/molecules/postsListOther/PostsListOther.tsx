import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'; // импортируем useParams для получения user_id из URL

import { getOtherUserPosts } from '../../redux/slices/postsSlice';
import { AppDispatch } from '../../redux/store';
import PostModal from './OtherPostsModal';
import styles from './postsListOther.module.css';

const PostsListOther: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useParams<{ userId: string }>(); // получаем user_id из параметров маршрута
  const { posts, loading, error } = useSelector((state: any) => state.posts);
  const [selectedPost, setSelectedPost] = useState<any | null>(null); // Состояние для выбранного поста

  useEffect(() => {
    if (userId) {
      dispatch(getOtherUserPosts(userId)); // передаем user_id в функцию
    }
  }, [dispatch, userId]);

  const handleImageClick = (post: any) => {
    setSelectedPost(post); // Устанавливаем выбранный пост
  };

  const closeModal = () => {
    setSelectedPost(null); // Закрываем модальное окно
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.posnlistOther}>
      <div className={styles.postList}>
        {posts
          ?.map(post => (
            <img
              key={post._id}
              src={post.image_url}
              alt="post-thumbnail"
              onClick={() => handleImageClick(post)} // Обработчик клика
              style={{ cursor: 'pointer' }}
            />
          ))
          .reverse()}
      </div>

      {selectedPost && <PostModal post={selectedPost} onClose={closeModal} />}
    </div>
  );
};

export default PostsListOther;
