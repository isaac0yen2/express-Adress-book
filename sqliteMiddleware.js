const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('mydatabase.db');

db.run(`
  CREATE TABLE IF NOT EXISTS verify (
    id INTEGER PRIMARY KEY,
    username TEXT,
    password TEXT
  )
`);

function sqliteMiddleware(req, res, next) {
  req.db = db;
  next();
}

module.exports = sqliteMiddleware;


/*db.run(`
  CREATE TABLE IF NOT EXISTS verify (
    id INTEGER PRIMARY KEY,
    quote_text TEXT
  )
`);   this would be used to create a new user table */