const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');
const multer = require('multer');

class FileStorage {
  static ENOENT = 'ENOENT';

  static uniqueFileName(originalname) {
    const uniqueId = nanoid(10);

    return originalname
      .split(' ')
      .join('_')
      .replace(/(\.[A-Za-z]+)$/i, `.${uniqueId}$&`);
  }

  constructor(pathToSaveFile) {
    this.pathToSaveFile = path.join(__dirname, '..', 'public', pathToSaveFile);
    this.init();
  }

  get storage() {
    return this.diskStorage;
  }

  get storagePath() {
    return this.pathToSaveFile;
  }

  async init() {
    this.diskStorage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.pathToSaveFile);
      },
      filename: (req, file, cb) => {
        const { originalname } = file;
        const uniqueFileName = FileStorage.uniqueFileName(originalname);

        cb(null, uniqueFileName);
      },
    });

    this.checkDir()
      .catch((error) => {
        const { code } = error;

        if (code === FileStorage.ENOENT) {
          try {
            fs.promises.mkdir(this.pathToSaveFile);
          } catch (error) {
            throw new Error(`The storage for files with path '${this.pathToSaveFile}' wasn't created.`);
          }
        }
      });
  }

  async checkDir() {
    const isDirExist = await fs.promises.access(this.pathToSaveFile);

    return isDirExist;
  }

  async deleteFile(fileName) {
    return this.checkDir()
      .then(() => {
        const filePath = path.join(this.pathToSaveFile, fileName);

        return fs.promises.unlink(filePath);
      });
  }
}

exports.FileStorage = FileStorage;
