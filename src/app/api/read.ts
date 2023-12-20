// read.ts
import { db } from "../db/db";

const read = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM todos ORDER BY sort_order", (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

export { read };
