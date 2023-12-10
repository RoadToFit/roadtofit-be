import Multer from 'multer';

const uploadData = Multer({
  storage: Multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
})

export {
  uploadData,
};