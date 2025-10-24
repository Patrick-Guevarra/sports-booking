import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function App() {
  return (
    <div>
      <NavBar />
      <main style={{ maxWidth: 960, margin: "24px auto", padding: "0 16px" }}>
        <Outlet />
      </main>
    </div>
  );
}
