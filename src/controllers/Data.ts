import multer from 'multer';
import MulterGoogleCloudStorage from 'multer-cloud-storage'

const upload = multer({
  storage: new MulterGoogleCloudStorage({
    acl: 'publicRead',
    destination: 'profile/'
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
})

export {
  upload,
};