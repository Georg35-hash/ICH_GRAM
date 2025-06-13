import OtherProfile from '../../molecules/otherProfile/OtherProfile';
import PostsListOther from '../../molecules/postsListOther/PostsListOther';
import styles from './otherProfilePage.module.css';

const OtherProfilePage: React.FC = () => {
  return (
    <div className={styles.profilePage}>
      <OtherProfile />
      <PostsListOther />
    </div>
  );
};

export default OtherProfilePage;
