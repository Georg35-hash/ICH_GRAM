import CustomInput from '../../atoms/customInput/CustomInput';
import styles from './searchBar.module.css';
import { useTranslation } from 'react-i18next';

const SearchBar = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.searchBar}>
      <div className={styles.searchBar_box}>
        <h3>{t('searchBar.search')}</h3>
        <CustomInput
          placeholder={t('searchBar.searchPlaceholder')}
          style={{ background: '  var(--color-bg-dark-grey)' }}
        />
        <h5>{t('searchBar.resent')}</h5>
      </div>
    </div>
  );
};

export default SearchBar;
