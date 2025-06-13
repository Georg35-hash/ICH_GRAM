import styles from './profileLink.module.css';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useTranslation } from 'react-i18next';
import profilePlaceholder from '../../assets/profile-placeholder.svg';

const ProfileLink = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { t } = useTranslation();
  return (
    <nav className={styles.profileLink}>
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          isActive ? styles.activeLink : styles.link
        }
      >
        <div className={styles.profileLink_photoBox}>
          <img
            src={user.profile_image || profilePlaceholder}
            alt={user.username}
          />
        </div>
        <span>{t('profileLink.profile')}</span>
      </NavLink>
    </nav>
  );
};
export default ProfileLink;
