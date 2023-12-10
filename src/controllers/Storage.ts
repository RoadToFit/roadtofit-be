import { Storage } from "@google-cloud/storage";

const projectId = '';
const keyFilename = '';
const storage = new Storage({
  projectId,
  keyFilename,
});

const bucket = storage.bucket('');

export {
  bucket,
}