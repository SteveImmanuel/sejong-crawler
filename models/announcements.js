class Annoucements {
  constructor(dbInstance) {
    this.dbInstance = dbInstance;
    this.tableName = 'announcements';
    this.createTable();
  }

  async createTable() {
    return this.dbInstance.run(`CREATE TABLE IF NOT EXISTS ${this.tableName} (
      id INTEGER PRIMARY KEY,
      title TEXT,
      date TEXT,
      writer TEXT,
      link TEXT)`);
  }

  async getAnnouncementById(id) {
    this.dbInstance.get(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
  }

  async addAnnouncement(id, title, link, date = '', writer = '') {
    return this.dbInstance.run(
      `INSERT INTO ${this.tableName} (id, title, date, writer, link) VALUES (?, ?, ?, ?, ?)`,
      [id, title, date, writer, link],
    );
  }
}

module.exports = Annoucements;
