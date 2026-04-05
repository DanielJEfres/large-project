import "./App.css";
import { Outlet } from "react-router";

function App() {
  // const [count, setCount] = useState(0);
  // commented out for now to fix typescript errors

  return (
    <>
      <Outlet />
    </>
  );
}

export default App;
