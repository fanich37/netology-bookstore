class DB {
  static delay() {
    return new Promise((res) => {
      const timerId = setTimeout(() => {
        clearTimeout(timerId);
        res();
      }, Math.round() * 2000);
    });
  }

  constructor(entities) {
    if (!entities && typeof entities !== 'string') {
      throw new Error()
    }

    this.entities = [];
  }

  async getOneById(id) {
    await DB.delay();

    return this.entities.find((record) => record.id === id);
  }

  async getAll() {
    await DB.delay();

    return this.entities;
  }

  async createRecord(record) {
    await DB.delay();

    this.entities.push(record);

    return record;
  }

  async updateRecord(id, updatedRecord) {
    await DB.delay();

    const index = this.entities.findIndex((record) => record.id === id);
    this.entities[index] = updatedRecord;

    return updatedRecord;
  }

  async deleteRecord(id) {
    await DB.delay();

    const isRecordToDeleteExist = this.entities.some((record) => record.id === id);

    if (isRecordToDeleteExist === false) {
      return false;
    }

    this.entities = this.entities.filter((record) => record.id !== id);

    return true;
  }
}

exports.DB = DB;
