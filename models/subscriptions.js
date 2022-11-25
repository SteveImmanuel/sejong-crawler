const dbInstance = require('../db');

class Subscriptions {
  constructor() {
    this.dbInstance = dbInstance;
    this.tableName = 'subscriptions';
    this.createTable();
  }

  async createTable() {
    return this.dbInstance.run(`CREATE TABLE IF NOT EXISTS ${this.tableName} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      topicId INTEGER,
      FOREIGN KEY (userId) REFERENCES users(id),
      UNIQUE (userId,topicId))`);
  }

  async addSubscription(userId, topicId) {
    return this.dbInstance.run(
      `INSERT INTO ${this.tableName} (userId, topicId) VALUES (?, ?)`,
      [userId, topicId],
    );
  }

  async getSubscriptionsByTopicId(topicId) {
    return this.dbInstance.getAll(`SELECT * FROM ${this.tableName} WHERE topicId = ?`, [topicId]);
  }

  async getSubscriptionsByUserId(userId) {
    return this.dbInstance.getAll(`SELECT topicId FROM ${this.tableName} WHERE userId = ?`, [userId]);
  }

  async getSubscriptionsByUserIdAndTopicId(userId, topicId) {
    return this.dbInstance.get(
      `SELECT * FROM ${this.tableName} WHERE userId = ? AND topicId = ?`,
      [userId, topicId],
    );
  }

  async deleteSubscription(userId, topicId) {
    return this.dbInstance.run(
      `DELETE FROM ${this.tableName} WHERE userId = ? AND topicId = ?`,
      [userId, topicId],
    );
  }

  async deleteAllUserSubscriptions(userId) {
    return this.dbInstance.run(`DELETE FROM ${this.tableName} WHERE userId = ?`, [userId]);
  }
}

const subscriptionModel = new Subscriptions();
module.exports = subscriptionModel;
