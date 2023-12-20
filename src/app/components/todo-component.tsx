import React, { useState } from "react";

export default function Todo() {
  const [order, setOrder] = useState(0);
  const [text, setText] = useState("");

  return (
    <div>
      <p>Order: {order}</p>
      <p>Text: {text}</p>
    </div>
  );
}
