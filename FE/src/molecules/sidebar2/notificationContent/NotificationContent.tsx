// NotificationsContent.tsx
import React from 'react';

const NotificationsContent: React.FC = () => {
  const notifications = ['Friend request', 'New message', 'Post liked'];

  return (
    <div>
      <h2>Notifications</h2>
      <ul>
        {notificationstyles.map((notification, index) => (
          <li key={index}>{notification}</li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsContent;
