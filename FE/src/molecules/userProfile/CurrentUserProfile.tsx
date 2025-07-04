import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import CustomButton from '../../atoms/customButton/CustomButton';
import FollowsPanel from '../../components/follows/Follows';
import { logout } from '../../redux/slices/authSlice';
import profilePlaceholder from '../../assets/profile-placeholder.svg';
import { ILocalFollow } from '../../interfaces/follow.interface';
import { RootState } from '../../redux/store';
import styles from './currentUserProfile.module.css';
import web from '../../assets/web.svg';

const CurrentUserProfile: React.FC = () => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [follow, setFollow] = useState<ILocalFollow>({
    followers: 'Loading...',
    following: 'Loading...',
  });

  if (!user) return <div>{t('currentUserProfile.error')}</div>;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };
  const handleChangeFollow = (newFollow: ILocalFollow) => {
    setFollow(newFollow);
  };

  return (
    <div className={styles.currentUserProfile}>
      <span className={styles.gradient_border}>
        <span className={styles.gradient_border_inner}>
          <img
            src={user.profile_image || profilePlaceholder}
            alt={user.username}
          />
        </span>
      </span>
      <div className={styles.currentUserProfile_rightside}>
        <div className={styles.currentUserProfile_rightside_btnBox}>
          <p>{user.username}</p>
          <CustomButton
            className={styles.btn}
            text={t('currentUserProfile.btnEdit')}
            style={{
              fontWeight: 600,
              color: 'var(--color-text-dark)',
              width: '168.72px',
              backgroundColor: 'var(--color-bg-dark-grey)',
            }}
            onClick={handleEditProfile}
          />
          <CustomButton
            className={styles.btn}
            text={t('currentUserProfile.btnLogOut')}
            style={{
              width: '168.72px',
              fontWeight: 600,
            }}
            onClick={handleLogout} // Обработчик для кнопки выхода
          />
        </div>
        <div className={styles.currentUserProfile_statistic}>
          <p>
            <span className={styles.currentUserProfile_statisticCount}>
              {user.posts_count}
            </span>
            {t('currentUserProfile.posts')}
          </p>
          <FollowsPanel
            userId={user._id}
            follow={follow}
            setFollow={handleChangeFollow}
          />
        </div>
        <p className={styles.currentUserProfile_statisticBio}>{user.bio}</p>
        {user.bio_website ? (
          <a className={styles.webLink}>
            <img src={web} alt="" />
            {user.bio_website}
          </a>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default CurrentUserProfile;
