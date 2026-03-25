import { useState } from "react";
import "./App.css";
import { Outlet } from "react-router";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1 className="text-3xl font-bold underline text-blue-600">
        (pretend nav is here)
      </h1>
      <Outlet />
    </>
  );
}

export default App;
