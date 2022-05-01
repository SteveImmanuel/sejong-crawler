class Users {
  constructor(dbInstance) {
    this.dbInstance = dbInstance;
    this.tableName = 'users';
    this.createTable();
  }

  async createTable() {
    return this.dbInstance.run(`CREATE TABLE IF NOT EXISTS ${this.tableName} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      isSubscribed BOOL NOT NULL DEFAULT 1)`);
  }

  async getUserById(id) {
    this.dbInstance.get(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
  }

  async getAllSubscribedUsers() {
    return this.db.getAll(`SELECT * FROM ${this.tableName} WHERE isSubscribed = true`);
  }

  async addUser(id, name) {
    return this.dbInstance.run(
      `INSERT INTO ${this.tableName} (id, name) VALUES (?, ?)`,
      [id, name],
    );
  }

  async updateSubscription({ id, isSubscribed }) {
    return this.db.run(
      `UPDATE ${this.tableName} SET isSubscribed = ? WHERE id = ?`,
      [isSubscribed, id],
    );
  }
}

module.exports = Users;
