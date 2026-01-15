import React, { useState } from 'react';

export function TestComponent() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-4 border border-blue-500 rounded bg-blue-50">
      <h3 className="text-lg font-bold">Test Component</h3>
      <p>Count: {count}</p>
      <button
        onClick={() => setCount(c => c + 1)}
        className="px-4 py-2 bg-blue-500 text-white rounded mt-2"
      >
        Increment
      </button>
    </div>
  );
}
