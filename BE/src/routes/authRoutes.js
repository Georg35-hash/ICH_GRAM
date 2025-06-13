import express from 'express';
import { register, login, checkUser, updatePassword } from '../controllers/authController.js';

const router = express.Router();

// Регистрация нового пользователя
router.post('/register', register);

// Вход пользователя
router.post('/login', login);


router.post('/check-user', checkUser)


router.post('/update-password', updatePassword)

export default router;