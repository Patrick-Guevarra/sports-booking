import { useEffect, useState } from "react";
import api from "../api";

type Booking = { id: number; timeslot_id: number; status: string };

export default function Bookings() {
  const [data, setData] = useState<Booking[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/bookings")
      .then((r) => setData(r.data))
      .catch((e) => {
        setErr(e?.response?.data?.detail || "Unable to fetch bookings");
      });
  }, []);

  if (err) return <p>{err}</p>;

  return (
    <div>
      <h2>My Bookings</h2>
      <ul>
        {data.map((b) => (
          <li key={b.id}>
            Booking #{b.id} — Slot {b.timeslot_id} — {b.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
