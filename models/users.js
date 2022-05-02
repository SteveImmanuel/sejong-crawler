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
      lang TEXT DEFAULT en,
      isSubscribed BOOL NOT NULL DEFAULT 1)`);
  }

  async getUserById(id) {
    return this.dbInstance.get(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
  }

  async getAllSubscribedUsers() {
    return this.dbInstance.getAll(`SELECT * FROM ${this.tableName} WHERE isSubscribed = true`);
  }

  async addUser(id, name) {
    return this.dbInstance.run(
      `INSERT INTO ${this.tableName} (id, name) VALUES (?, ?)`,
      [id, name],
    );
  }

  async updateSubscription(id, isSubscribed) {
    return this.dbInstance.run(
      `UPDATE ${this.tableName} SET isSubscribed = ? WHERE id = ?`,
      [isSubscribed, id],
    );
  }
}

const userModel = new Users();
module.exports = userModel;
