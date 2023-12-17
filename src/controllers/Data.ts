import { Request } from 'express';
import multer from 'multer';
import MulterGoogleCloudStorage from 'multer-cloud-storage'

const uploadUserImage = multer({
  storage: new MulterGoogleCloudStorage({
    acl: 'publicRead',
    destination: 'user_images/',
    filename: (req: Request, file: Express.Multer.File, cb: any) => {
      const now = new Date();
      const date = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
      const time = now.getHours() * 10000 + now.getMinutes() * 100 + now.getSeconds();
      return cb(null, `user_${date}_${time}_${file.originalname}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
})

export {
  uploadUserImage,
};