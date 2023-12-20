// update.ts
import { db } from "../db/db";

async function updateOrder(id: number, newOrder: number) {
  try {
    const allItems: Todo[] = await new Promise<any>((resolve, reject) => {
      db.all("SELECT id, sort_order FROM todos", (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });

    const targetItem = allItems.find((item) => item.id === id);

    if (!targetItem) {
      throw new Error("Item with the provided id not found");
    }

    // Check if the sort order is changing
    if (targetItem.sort_order !== newOrder) {
      // Assign the order to max order + 1
      const maxOrder = Math.max(...allItems.map((item) => item.sort_order));
      const updatedOrder = maxOrder + 1;

      await new Promise<void>((resolve, reject) => {
        db.run(
          "UPDATE todos SET sort_order = ? WHERE id = ?",
          [updatedOrder, id],
          (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        );
      });

      // Select the range of items and sort them
      const rangeStart = Math.min(targetItem.sort_order, newOrder);
      const rangeEnd = Math.max(targetItem.sort_order, newOrder);
      const rangeItems = allItems.filter(
        (item) => item.sort_order >= rangeStart && item.sort_order <= rangeEnd
      );
      rangeItems.sort((a, b) => a.sort_order - b.sort_order);

      const direction = targetItem.sort_order < newOrder ? 1 : -1;

      // Loop through the array and update orders
      for (const item of rangeItems) {
        await new Promise<void>((resolve, reject) => {
          db.run(
            "UPDATE todos SET sort_order = ? WHERE id = ?",
            [item.sort_order + direction, item.id],
            (err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            }
          );
        });
      }
    }
  } catch (error: any) {
    console.error("Error updating order:", error.message);
    throw error;
  }
}

export { updateOrder };
