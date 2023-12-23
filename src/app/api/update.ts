// update.ts
import { db } from "../db/db";

async function updateOrder(id: number, newOrder: number) {
  try {
    const targetItem: Todo = await new Promise((resolve, reject) => {
      db.get(
        "SELECT id, sort_order FROM todos WHERE id = ?",
        [id],
        (err, row: Todo) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });

    if (!targetItem) {
      throw new Error("Item with the provided id not found");
    }

    if (targetItem.sort_order !== newOrder) {
      await new Promise<void>((resolve, reject) => {
        db.run(
          "UPDATE todos SET sort_order = ? WHERE id = ?",
          [newOrder, id],
          (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        );
      });

      const adjustment = newOrder > targetItem.sort_order ? -1 : 1;

      // Update the sort orders of items with sort_order between the old and new orders
      await new Promise<void>((resolve, reject) => {
        db.run(
          "UPDATE todos SET sort_order = sort_order + ? WHERE id != ? AND sort_order >= ? AND sort_order <= ?",
          [
            adjustment,
            id,
            Math.min(targetItem.sort_order, newOrder),
            Math.max(targetItem.sort_order, newOrder),
          ],
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
  } catch (error: any) {
    console.error("Error updating order:", error.message);
    throw error;
  }
}

export { updateOrder };
