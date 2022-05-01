const sqlite3 = require('sqlite3');

class Database {
  constructor(dbFilePath) {
    const filePath = dbFilePath || ':memory:';
    this.db = new sqlite3.Database(filePath, (err) => {
      if (err) {
        console.log('Could not connect to database', err);
      } else {
        console.log('Connected to database', filePath);
      }
    });
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, (err) => {
        if (err) {
          console.log(`Error running sql: ${sql}`);
          console.log(err);
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, result) => {
        if (err) {
          console.log(`Error running sql: ${sql}`);
          console.log(err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  getAll(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          console.log(`Error running sql: ${sql}`);
          console.log(err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

module.exports = Database;
