import React from 'react';
import { ImageForm } from '../../molecules/imageForm/ImageForm';
import './CreatePostPage.module.css'; // Импорт стилей, если нужно

const CreatePostPage: React.FC = () => {
  return (
    <div className="createPostPage">
      <h1 className="createPostTitle">Create new post</h1>
      <ImageForm />
    </div>
  );
};

export default CreatePostPage;