import React from 'react';
import HomePagePosts from '../../molecules/homePagePosts/HomePagePosts'; // Используем компонент для отображения постов
import styles from './HomePage.module.css';
import allUpdates from '../../assets/allUdate.png';

const HomePage: React.FC = () => {
  return (
    <div className={styles.homepagepost}>
      <HomePagePosts />
      <div className={styles.allUpdates}>
        <img src={allUpdates} alt="All updates" />
        <p className={styles.allUpBig}>You've seen all the updates</p>
        <p className={styles.allUpSmall}>
          You have viewed all new publications
        </p>
      </div>
    </div>
  );
};

export default HomePage;
