import styles from './searchContent.module.css';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { getAllUsers } from '../../redux/slices/userSlice';
import CustomInput from '../customInput/CustomInput';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import profilePlaceholder from '../../assets/profile-placeholder.svg';

function SearchContent() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [searchPerson, setSearchPerson] = useState('');
  const users = useSelector((state: RootState) => state.user.user || []);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const filteredUsers = Array.isArray(users)
    ? users.filter(user =>
        user.username.toLowerCase().includes(searchPerson.toLowerCase()),
      )
    : [];

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className={styles.searchContent}>
      <h3>{t('searchContent.search')}</h3>
      <div className={styles.searchContent_inputBox}>
        <CustomInput
          type="text"
          placeholder={t('searchContent.placeholder')}
          value={searchPerson}
          onChange={value => setSearchPerson(value)}
          style={{ background: 'var(--color-bg-dark-grey)' }}
        />
      </div>
      <h5>{t('searchContent.recent')}</h5>
      <div className={styles.searchContent_list}>
        {filteredUsers && filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <div
              key={user._id}
              className={styles.searchContent_listImage}
              onClick={() => handleUserClick(user._id)}
            >
              <img
                src={user.profile_image || profilePlaceholder}
                alt={user.username}
              />

              <h6>{user.username}</h6>
            </div>
          ))
        ) : (
          <p>Sorry, no users was found</p>
        )}
      </div>
    </div>
  );
}

export default SearchContent;
