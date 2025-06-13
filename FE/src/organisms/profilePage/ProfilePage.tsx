import React from 'react';
import PostsList from '../../molecules/postsList2/PostList2';
import CurrentUserProfile from '../../molecules/userProfile/CurrentUserProfile';
import styles from './profilePage.module.css';

const ProfilePage: React.FC = () => {
  return (
    <div className={styles.profilePage}>
      <CurrentUserProfile />
      <PostsList />
    </div>
  );
};

export default ProfilePage;
