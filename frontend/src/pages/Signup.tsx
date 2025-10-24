import { FormEvent, useState } from "react";
import api from "../api";
import { useAuth } from "../auth";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const { setToken } = useAuth();
  const nav = useNavigate();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const r = await api.post("/auth/signup", { email, password });
      setToken(r.data.access_token);
      nav("/");
    } catch (e: any) {
      setErr(e?.response?.data?.detail || "Signup failed");
    }
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 420 }}>
      <h2>Create account</h2>
      {err && <p>{err}</p>}
      <label>
        Email<br />
        <input value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <br />
      <br />
      <label>
        Password<br />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      <br />
      <br />
      <button type="submit">Sign up</button>
    </form>
  );
}
