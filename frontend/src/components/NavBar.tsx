import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";

export default function NavBar() {
  const { isAuthed, setToken } = useAuth();
  const nav = useNavigate();

  return (
    <nav style={{ display: "flex", gap: 16, padding: "12px 16px", borderBottom: "1px solid #eee" }}>
      <Link to="/">🏟️ Sports Booking</Link>
      <span style={{ flex: 1 }}></span>
      <Link to="/">Browse</Link>
      {isAuthed && <Link to="/bookings">My bookings</Link>}
      {isAuthed ? (
        <button onClick={() => { setToken(null); nav("/"); }}>Log out</button>
      ) : (
        <>
          <Link to="/login">Log in</Link>
          <Link to="/signup">Sign up</Link>
        </>
      )}
    </nav>
  );
}
