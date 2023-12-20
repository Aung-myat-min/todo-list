import { db } from "../db/db";

const write = (todo: Todo) => {
  return new Promise<void>((resolve, reject) => {
    // Step 1: Get the Latest Sort Order
    db.get("SELECT MAX(sort_order) AS max_order FROM todos", (err, row) => {
      if (err) {
        console.error(`Error getting latest sort order: ${err.message}`);
        reject(err);
        return;
      }

      // Type assertion to inform TypeScript about the expected property
      const latestSortOrder = (row as { max_order?: number })?.max_order || 0;

      // Step 2: Insert the New To-Do Item
      db.run(
        "INSERT INTO todos (text, sort_order) VALUES (?, ?)",
        [todo.text, latestSortOrder + 1], // Use the next available sort_order
        function (err) {
          if (err) {
            console.error(`Error writing to the database: ${err.message}`);
            reject(err);
          } else {
            // Assign the auto-incremented id to the todo object
            todo.id = this.lastID;
            resolve();
          }
        }
      );
    });
  });
};

export { write };
