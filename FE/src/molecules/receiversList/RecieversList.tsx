// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// import { getUsersWithChats } from "../../redux/slices/userSlice";
// import { RootState } from "../../redux/store";
// import styles from"./recieversList.module.css";

// const RecieversList: React.FC = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { user, loading, error } = useSelector((state: RootState) => state.user);
//   const { username } = useSelector((state: RootState) => state.auth.user!);

//   const [activeUserId, setActiveUserId] = useState<string | null>(
//     () => localStorage.getItem("activeUserId") // Загружаем ID из localStorage при монтировании
//   );

//   useEffect(() => {
//     dispatch(getUsersWithChats());
//   }, [dispatch]);

//   if (loading) {
//     console.log("Data is loading...");
//     return <p>Загрузка...</p>;
//   }
//   if (error) {
//     console.error("An error occurred:", error);
//     return <p>Ошибка: {error}</p>;
//   }

//   console.log("Fetched user data:", user);

//   // Обработчик выбора пользователя
//   const handleSelectUser = (targetUserId: string) => {
//     setActiveUserId(targetUserId); // Устанавливаем выбранного пользователя активным
//     localStorage.setItem("activeUserId", targetUserId); // Сохраняем в localStorage
//     navigate("/messages", { state: { targetUserId } }); // Передаём ID пользователя в состояние
//   };

//   return (
//     <div className={styles.recieversList}>
//       <h4>{username}</h4>
//       <ul>
//         {user.map((chatUser) => {
//           const isActive = chatUser._id === activeUserId; // Проверяем, является ли текущий пользователь активным
//           return (
//             <li
//               className={`${styles.recieversList_userBox} ${isActive ? styles.active : ""}`}
//               key={chatUser._id}
//               onClick={() => handleSelectUser(chatUser._id)} // Переход в комнату сообщений при клике
//             >
//               <img
//                 className={styles.userBox_img}
//                 src={chatUser.profile_image}
//                 alt={chatUser.username}
//               />
//               <span className={styles.userBox_data}>
//                 <p className={styles.userBox_dataP1}>{chatUser.username}</p>
//                 <p className={styles.userBox_dataP2}>
//                   {chatUser.username} sent a message. •{" "}
//                 </p>
//               </span>
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// };

// export default RecieversList;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../redux/store';
import { getUsersWithChats } from '../../redux/slices/userSlice';
import styles from './recieversList.module.css';
import parseData from '../../helpers/parseData';

const RecieversList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector(
    (state: RootState) => state.user,
  );
  const { username } = useSelector((state: RootState) => state.auth.user!);

  const [activeUserId, setActiveUserId] = useState<string | null>(() =>
    localStorage.getItem('activeUserId'),
  );

  useEffect(() => {
    dispatch(getUsersWithChats());
  }, [dispatch]);

  const handleSelectUser = (
    targetUserId: string,
    lastMessageDate: string | null,
  ) => {
    setActiveUserId(targetUserId);
    localStorage.setItem('activeUserId', targetUserId);
    navigate('/messages', { state: { targetUserId, lastMessageDate } });
  };

  // Функция для получения даты последнего сообщения
  const getLastMessageDate = (messages: any[]) => {
    if (!messages || messagestyles.length === 0) {
      return null; // Если сообщений нет
    }

    try {
      const timestamps = messages
        .map(message => new Date(message.created_at).getTime())
        .filter(time => !isNaN(time)); // Убираем некорректные даты

      if (timestampstyles.length === 0) {
        return null;
      }

      const lastMessageTimestamp = Math.max(...timestamps);
      const lastMessageDate = new Date(lastMessageTimestamp);

      // Форматируем дату в удобный вид
      return lastMessageDate.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Error processing message dates:', error);
      return null;
    }
  };

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    console.error('An error occurred:', error);
    return <p>Ошибка: {error}</p>;
  }

  return (
    <div className={styles.recieversList}>
      <h4>{username}</h4>
      <ul>
        {user.map(chatUser => {
          const isActive = chatUser._id === activeUserId;
          const lastMessageDate = getLastMessageDate(chatUser.messages);

          return (
            <li
              className={`${styles.recieversList_userBox} ${isActive ? styles.active : ''}`}
              key={chatUser._id}
              onClick={() => handleSelectUser(chatUser._id, lastMessageDate)}
            >
              <img
                className={styles.userBox_img}
                src={chatUser.profile_image}
                alt={chatUser.username}
              />
              <span className={styles.userBox_data}>
                <p className={styles.userBox_dataP1}>{chatUser.username}</p>
                <p className={styles.userBox_dataP2}>
                  {chatUser.username} sent a message. •
                  {parseData(chatUser.lastMessage)}
                  {lastMessageDate && (
                    <span className={styles.lastMessageDate}>
                      {lastMessageDate}
                    </span>
                  )}
                </p>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RecieversList;
