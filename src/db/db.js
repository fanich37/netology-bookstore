const { model, Schema } = require('mongoose');

class DB {
  constructor(entityName, entitySchema) {
    if (
      (!entityName && typeof entityName !== 'string')
      || (!entitySchema && typeof entitySchema !== 'object')
    ) {
      throw new Error('The entityName or entitySchema is missing while initializing DB class.');
    }

    this.entity = model(entityName, new Schema(entitySchema));
  }

  async getOneById(id) {
    try {
      const result = await this.entity.findById(id, '-__v');

      return result;
    } catch (error) {
      throw new Error(`The error occured while trying to find record with ${id}`);
    }
  }

  async getOneByParams(params) {
    try {
      const result = await this.entity.findOne(params, '-__v');

      return result;
    } catch (error) {
      throw new Error(`[DB][getOneByParams]. Erorr: ${error.message}.`);
    }
  }

  async getAll() {
    try {
      const result = await this.entity.find({}, '-__v');

      return result;
    } catch (error) {
      throw new Error('The error occured while collecting all records');
    }
  }

  async createRecord(record) {
    try {
      const result = await this.entity.create(record);

      return result;
    } catch (error) {
      throw new Error('The error occured while creating record');
    }
  }

  async updateRecord(id, updatedData) {
    try {
      const result = await this.entity.findOneAndUpdate(
        { _id: id },
        updatedData,
        { new: true, projection: '-__v' },
      );

      return result;
    } catch (error) {
      throw new Error(`The error occured while updating record with id ${id}`);
    }
  }

  async deleteRecord(id) {
    try {
      const result = await this.entity.deleteOne({ _id: id });

      return result;
    } catch (error) {
      throw new Error(`The error occured while deleting record with id ${id}`);
    }
  }
}

exports.DB = DB;
