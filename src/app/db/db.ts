// db.ts
import { Database } from "sqlite3";

const db = new Database("db.sqlite");

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    sort_order INTEGER NOT NULL
  );
`;

// Ensure the table is created before performing operations
db.run(createTableQuery, (err) => {
  if (err) {
    console.error(`Error creating the 'todos' table: ${err.message}`);
  } else {
    console.log("Table 'todos' created successfully.");
  }
});

export { db };
