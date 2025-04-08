class BaseRepository {
  constructor(model) {
    this.db = model;
  }

  // return Query
  findAll(query = {}) {
    return this.db.find(query);
  }

  findById(itemId) {
    return this.db.findById(itemId);
  }

  findOne(query = {}) {
    return this.db.findOne(query);
  }

  // return Promise
  exists(query = {}) {
    return this.db.exists(query);
  }

  create(data) {
    return new this.db(data).save();
  }
}

module.exports = BaseRepository;
