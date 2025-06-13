import Message from '../models/messageModel.js';
import User from '../models/userModel.js';

// Загрузка истории сообщений
export const loadMessages = async (userId, targetUserId, socket) => {
  // write userId, targetUserId,
  console.log("userId", userId)
  console.log("targetUserId", targetUserId)
  try {
    const messages = await Message.find({
      $or: [
        { sender_id: userId, receiver_id: targetUserId },
        { sender_id: targetUserId, receiver_id: userId },
      ],
    }).sort({ created_at: 1 }); 
    // Отправляем историю сообщений
    socket.emit('loadMessages', messages);
  } catch (error) {
    console.error('Ошибка при загрузке сообщений:', error);
    socket.emit('error', { error: 'Ошибка при загрузке сообщений' });
  }
};

// Отправка сообщения
export const sendMessage = async (userId, targetUserId, messageText, roomId, io) => {
  try {
    const message = new Message({
      sender_id: userId,
      receiver_id: targetUserId,
      message_text: messageText,
      created_at: new Date(),
    });

    await message.save(); // Сохранение сообщения в базе данных

    // Отправляем сообщение всем пользователям в комнате
    io.emit('receiveMessage', message);
  } catch (error) {
    console.error('Ошибка при отправке сообщения:', error);
  }
};

export const getUsersWithChats = async (req, res) => {
  const userId = req.user._id; // Получаем ID текущего пользователя из токена
  console.log("Идентификатор текущего пользователя:", userId);

  try {
    // Находим отправленные и полученные сообщения
    const sentIds = await Message.find({ sender_id: userId }).distinct('receiver_id');
    const receivedIds = await Message.find({ receiver_id: userId }).distinct('sender_id');

    // Объединяем ID и убираем дубли
    const userIds = [...new Set([...sentIds, ...receivedIds])];

    // Получаем профили пользователей
    const users = await User.find({ _id: { $in: userIds } }).select('-password').lean();

    // Используем Promise.all для обработки всех асинхронных операций
    const usersDTO = await Promise.all(users.map(async (user) => {
      // Найти последнее сообщение между текущим пользователем и каждым собеседником
      const lastMessage = await Message.find({
        $or: [
          { sender_id: userId, receiver_id: user._id },
          { sender_id: user._id, receiver_id: userId }
        ]
      })
      .sort({ created_at: -1 }) // Сортируем по дате, чтобы получить последнее сообщение
      .limit(1);

      return {
        ...user,
        lastMessage: lastMessage[0] ? lastMessage[0].created_at : null // Если сообщение есть, берем его дату
      };
    }));

    res.status(200).json(usersDTO); // Возвращаем список пользователей с последним сообщением
  } catch (error) {
    console.error("Ошибка при загрузке пользователей:", error);
    res.status(500).json({ message: 'Ошибка при загрузке пользователей', error: error.message });
  }
};