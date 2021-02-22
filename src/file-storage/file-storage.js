const fs = require('fs');
const path = require('path');

class FileStorage {
  static ENOENT = 'ENOENT';

  constructor(fileStoragePath) {
    this.fileStoragePath = path.join(__dirname, '..', 'public', fileStoragePath);
  }

  async checkDir() {
    try {
      await fs.promises.access(this.fileStoragePath);

      return Promise.resolve();
    } catch (error) {
      const { code } = error;

      if (code === FileStorage.ENOENT) {
        try {
          fs.promises.mkdir(this.fileStoragePath);
        } catch (error) {
          throw new Error(`The storage for files with path '${this.fileStoragePath}' wasn't created.`);
        }
      }
    }
  }

  async saveFile(file) {
    return this.checkDir()
      .then(() => {
        const { buffer, originalname } = file;
        const filePath = path.join(this.fileStoragePath, originalname);
        const fileBuffer = Buffer.from(buffer);

        return fs.promises.appendFile(filePath, fileBuffer);
      });
  }

  async deleteFile(filePath) {
    return this.checkDir()
      .then(() => {
        return fs.promises.unlink(filePath);
      });
  }

  getStorageDirPath() {
    return this.fileStoragePath;
  }
}

exports.FileStorage = FileStorage;
