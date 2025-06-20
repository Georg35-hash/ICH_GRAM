import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import http from "http"
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import { messageSocketHandler, authenticateSocket } from './routes/messageRoutes.js';
import { notificationSocketHandler } from "./middlewares/notificationSocketHandler.js";
import app from './app.js';

dotenv.config();
connectDB();

const server = http.createServer(app)

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Инициализация WebSocket сервера
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
  },
  transports: ["websocket", "polling"],
});
// Сохраняем io в app для доступа из контроллеров
app.set("io", io);
// Middleware для WebSocket-аутентификации
io.use((socket, next) => {
  authenticateSocket(socket, next); // Проверка JWT токена
});

// Обработка WebSocket-соединений
io.on('connection', (socket) => {
  console.log('Новое WebSocket соединение');

  // Подключаем обработчики сообщений
  messageSocketHandler(socket, io);

   // Подключаем обработчики уведомлений
 notificationSocketHandler(socket, io);
});


server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});