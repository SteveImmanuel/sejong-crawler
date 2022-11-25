const dbInstance = require('../db');

class Users {
  constructor() {
    this.dbInstance = dbInstance;
    this.tableName = 'users';
    this.createTable();
  }

  async createTable() {
    return this.dbInstance.run(`CREATE TABLE IF NOT EXISTS ${this.tableName} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      lang TEXT DEFAULT en)`);
  }

  async getUserById(id) {
    return this.dbInstance.get(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
  }

  async addUser(id, name, lang = 'en') {
    return this.dbInstance.run(
      `INSERT INTO ${this.tableName} (id, name, lang) VALUES (?, ?, ?)`,
      [id, name, lang],
    );
  }

  async updateLang(id, lang) {
    return this.dbInstance.run(`UPDATE ${this.tableName} SET lang = ? WHERE id = ?`, [lang, id]);
  }
}

const userModel = new Users();
module.exports = userModel;
