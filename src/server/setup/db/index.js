const {MongoClient} = require('mongodb');
const {promisify} = require('util');

let _db = null;

class DBConnection {
  static async connect(dbConfig) {
    const db = await promisify(MongoClient.connect)(dbConfig.CONN_URL);
    _db = db.db(dbConfig.DB_NAME);
  }

  static db() {
    return _db;
  }
}


module.exports = DBConnection;
