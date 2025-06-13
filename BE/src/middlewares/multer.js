import multer from 'multer';

// Настройка multer
const storage = multer.memoryStorage(); // Хранить файлы в памяти

const upload = multer({ storage,limits: { fileSize: 50 * 5024 * 5024 } });




export default upload;