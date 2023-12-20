// page.tsx
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./app.css";

export default function Home() {
  const [todoitems, settodoItems] = React.useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = React.useState<string>("");
  const dragItem = React.useRef<number | null>(null);
  const dragOverItem = React.useRef<number | null>(null);

  useEffect(() => {
    const fetchInitialTodoItems = async () => {
      try {
        const response = await axios.get("/api/");
        const sortedTodoItems = response.data.sort(
          (a: { sort_order: number }, b: { sort_order: number }) =>
            a.sort_order - b.sort_order
        );
        settodoItems(sortedTodoItems);
      } catch (error: any) {
        console.error("Error fetching initial todo items:", error.message);
      }
    };

    // Call the fetch function when the component mounts
    fetchInitialTodoItems();
  }, []); // The empty dependency array ensures this effect runs once when the component mounts

  const handleSort = () => {
    // Duplicate items
    let _todoitems = [...todoitems];

    // Remove and save the dragged item content
    const draggedItemContent = _todoitems.splice(dragItem.current!, 1)[0];

    // Switch the position
    _todoitems.splice(dragOverItem.current!, 0, draggedItemContent);

    // Reset the position refs
    dragItem.current = null;
    dragOverItem.current = null;

    // Update the actual array
    settodoItems(_todoitems);
  };

  const handleAddItem = async () => {
    try {
      // Check if newTodoText is not empty
      if (newTodoText.trim() !== "") {
        // Send a POST request to add the new todo item
        await axios.post("/api/", {
          text: newTodoText,
          order: todoitems.length + 1,
        });

        // Refresh todo items after adding a new one
        const response = await axios.get("/api/");
        settodoItems(response.data);

        // Clear the input field
        setNewTodoText("");
      }
    } catch (error: any) {
      console.error("Error adding todo item:", error.message);
    }
  };

  return (
    <main>
      <h1>Todo List</h1>
      <button onClick={handleAddItem}>Add Item +</button>
      <input
        type="text"
        name="text"
        id="text"
        className="textbox"
        value={newTodoText}
        onChange={(e) => setNewTodoText(e.target.value)}
      />
      <div className="todo-list">
        {todoitems.map((item, index) => (
          <div
            key={index}
            className="list"
            draggable
            onDragStart={(e) => (dragItem.current = index)}
            onDragEnter={(e) => (dragOverItem.current = index)}
            onDragOver={handleSort}
            onDragEnd={(e) => e.preventDefault()}
          >
            {/* Change the line below to render the specific property */}
            {item.text}
          </div>
        ))}
      </div>
    </main>
  );
}
