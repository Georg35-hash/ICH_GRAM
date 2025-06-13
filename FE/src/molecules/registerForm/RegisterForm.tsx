import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { $api } from '../../api/api';
import CustomButton from '../../atoms/customButton/CustomButton';
import CustomInput from '../../atoms/customInput/CustomInput';
import styles from './registerForm.module.css';
import logo from '../../assets/logo-ichgram.svg';
import { useTranslation } from 'react-i18next';

export const RegisterForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [userObject, setUserObject] = useState({
    email: '',
    password: '',
    username: '',
    full_name: '',
  });

  const [error, setError] = useState({
    email: '',
    username: '',
    general: '',
  });

  const handleInputChange = field => value => {
    setUserObject(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError({ email: '', username: '', general: '' }); // Сброс ошибок перед новым запросом

    try {
      const response = await $api.post('/auth/register', userObject);
      if (response.status === 201) {
        navigate('/'); // Перенаправляем на главную страницу при успешной регистрации
      }
    } catch (error) {
      console.error('Registration error:', error);

      if (error.response) {
        const errorData = error.response.data;

        if (error.response.status === 400) {
          // Обработка ошибок email и username
          setError(prevState => ({
            ...prevState,
            email: errorData.errors?.email || '',
            username: errorData.errors?.username || '',
            general: !errorData.errors ? errorData.message : '',
          }));
        } else {
          setError(prevState => ({
            ...prevState,
            general: t('registerForm.unpredictableError'),
          }));
        }
      } else {
        setError(prevState => ({
          ...prevState,
          general: t('registerForm.unpredictableError'),
        }));
      }
    }
  };

  return (
    <div className={styles.registerFormBox}>
      <form className={styles.registerForm} onSubmit={handleSubmit}>
        <img src={logo} alt="logo" />
        <h4>{t('registerForm.title')}</h4>
        <CustomInput
          placeholder={t('registerForm.placeholderEmail')}
          value={userObject.email}
          onChange={handleInputChange('email')}
          type="email"
          style={{
            paddingLeft: '8px',
            backgroundColor: '#FAFAFA',
            color: '#737373',
          }}
        />
        {error.email && <p className={styles.errorMessage}>{error.email}</p>}
        {/* Сообщение об ошибке email */}
        <CustomInput
          placeholder={t('registerForm.placeholderFullName')}
          value={userObject.full_name}
          onChange={handleInputChange('full_name')}
          type="text"
          style={{
            paddingLeft: '8px',
            backgroundColor: '#FAFAFA',
            color: '#737373',
            marginTop: '6px',
          }}
        />
        <CustomInput
          placeholder={t('registerForm.placeholderUsername')}
          value={userObject.username}
          onChange={handleInputChange('username')}
          type="text"
          style={{
            paddingLeft: '8px',
            backgroundColor: '#FAFAFA',
            color: '#737373',
            marginTop: '6px',
          }}
        />
        {error.username && (
          <p className={styles.errorMessage}>{error.username}</p>
        )}
        {/* Сообщение об ошибке username */}
        <CustomInput
          placeholder={t('registerForm.placeholderPassword')}
          value={userObject.password}
          onChange={handleInputChange('password')}
          type="password"
          style={{
            paddingLeft: '8px',
            backgroundColor: '#FAFAFA',
            color: '#737373',
            marginTop: '6px',
          }}
        />
        {error.general && (
          <p className={styles.errorMessage}>{error.general}</p>
        )}
        {/* Общее сообщение об ошибке */}
        <p className={styles.registerForm_p1}>
          {t('registerForm.termsInfo')}
          <span className={styles.agreementLink}>
            {t('registerForm.learnMore')}
          </span>
        </p>
        <p className={styles.registerForm_p2}>
          {t('registerForm.agreementText')}
          <span className={styles.agreementLink}>
            {t('registerForm.terms')}
          </span>
          ,
          <span className={styles.agreementLink}>
            {t('registerForm.privacyPolicy')}
          </span>
          ,
          <span className={styles.agreementLink}>
            {t('registerForm.cookiesPolicy')}
          </span>
          .
        </p>
        <CustomButton
          style={{ width: '268px', height: '32px' }}
          text={t('registerForm.signUpButton')}
          type="submit"
        />
      </form>
      <div className={styles.haveAccountBox}>
        <p>
          {t('registerForm.haveAccount')}
          <Link
            to={'/'}
            style={{ color: 'var(--color-text-blue)', fontWeight: 600 }}
          >
            {t('registerForm.login')}
          </Link>
        </p>
      </div>
    </div>
  );
};
