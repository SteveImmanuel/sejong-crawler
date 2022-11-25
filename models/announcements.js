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
      link TEXT)`);
  }

  async getAnnouncementById(id) {
    return this.dbInstance.get(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
  }

  async addAnnouncement(announcementId, title, link) {
    return this.dbInstance.run(
      `INSERT INTO ${this.tableName} (announcementId, title, link) VALUES (?, ?, ?)`,
      [announcementId, title, link],
    );
  }

  async getAllAnnoucementIds() {
    return this.dbInstance.getAll(`SELECT announcementId FROM ${this.tableName}`);
  }
}

const announcementModel = new Annoucements();
module.exports = announcementModel;
