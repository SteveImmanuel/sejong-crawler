const dbInstance = require('../db');

class Annoucements {
  constructor() {
    this.dbInstance = dbInstance;
    this.tableName = 'announcements';
    this.createTable();
  }

  async createTable() {
    return this.dbInstance.run(`CREATE TABLE IF NOT EXISTS ${this.tableName} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      announcementId TEXT,
      title TEXT,
      link TEXT,
      topicId INTEGER)`);
  }

  async getAnnouncementById(id) {
    return this.dbInstance.get(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
  }

  async addAnnouncement(announcementId, title, link, topicId) {
    return this.dbInstance.run(
      `INSERT INTO ${this.tableName} (announcementId, title, link, topicId) VALUES (?, ?, ?, ?)`,
      [announcementId, title, link, topicId],
    );
  }

  async getAllAnnoucementIds() {
    return this.dbInstance.getAll(`SELECT announcementId FROM ${this.tableName}`);
  }
}

const announcementModel = new Annoucements();
module.exports = announcementModel;
